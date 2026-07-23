const synth = window.speechSynthesis;

const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voices");
const speakButton = document.getElementById("speakBtn");
const clearButton = document.getElementById("clearBtn");
const waveContainer = document.getElementById("waveContainer");

let voices = [];

function populateVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";
    
    if (voices.length === 0) {
        const option = document.createElement("option");
        option.textContent = "Loading voices...";
        voiceSelect.appendChild(option);
        return;
    }

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Initial voice load attempt
populateVoices();

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoices;
}

// Backup interval to ensure voices load properly in all browsers
let voiceCheckInterval = setInterval(() => {
    if (voices.length > 0) {
        populateVoices();
        clearInterval(voiceCheckInterval);
    } else {
        populateVoices();
    }
}, 100);

// Speech synthesis and playback control
speakButton.addEventListener("click", () => {
    if (synth.speaking || synth.pending) {
        synth.cancel();
        waveContainer.classList.remove("active");
        speakButton.innerHTML = '<i class="fas fa-play"></i> Play';
        return;
    }

    if (textInput.value.trim() !== "") {
        const utterThis = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoiceIndex = voiceSelect.value;
        
        if (voices[selectedVoiceIndex]) {
            utterThis.voice = voices[selectedVoiceIndex];
        }

        utterThis.onstart = () => {
            waveContainer.classList.add("active");
            speakButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
        };

        utterThis.onend = () => {
            waveContainer.classList.remove("active");
            speakButton.innerHTML = '<i class="fas fa-play"></i> Play';
        };

        utterThis.onerror = () => {
            waveContainer.classList.remove("active");
            speakButton.innerHTML = '<i class="fas fa-play"></i> Play';
        };

        synth.speak(utterThis);
    }
});

// Clear button functionality
clearButton.addEventListener("click", () => {
    synth.cancel();
    textInput.value = "";
    waveContainer.classList.remove("active");
    speakButton.innerHTML = '<i class="fas fa-play"></i> Play';
});
