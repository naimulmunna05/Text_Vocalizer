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
    
    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

populateVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoices;
}


speakButton.addEventListener("click", () => {
    if (synth.speaking) {
        synth.cancel();
    }

    if (textInput.value !== "") {
        const utterThis = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoiceIndex = voiceSelect.value;
        
        if (voices[selectedVoiceIndex]) {
            utterThis.voice = voices[selectedVoiceIndex];
        }

        utterThis.onstart = () => {
            waveContainer.classList.add("active");
            speakButton.innerHTML = '<i class="fas fa-pause"></i> থামুন';
        };

        utterThis.onend = () => {
            waveContainer.classList.remove("active");
            speakButton.innerHTML = '<i class="fas fa-play"></i> প্লে করুন';
        };

        utterThis.onerror = () => {
            waveContainer.classList.remove("active");
            speakButton.innerHTML = '<i class="fas fa-play"></i> প্লে করুন';
        };

        synth.speak(utterThis);
    }
});


clearButton.addEventListener("click", () => {
    synth.cancel();
    textInput.value = "";
    waveContainer.classList.remove("active");
    speakButton.innerHTML = '<i class="fas fa-play"></i> প্লে করুন';
});
