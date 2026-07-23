const synth = window.speechSynthesis;

const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voices");
const speakButton = document.getElementById("speakBtn");
const clearButton = document.getElementById("clearBtn");
const waveContainer = document.getElementById("waveContainer");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");

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

populateVoices();

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoices;
}

let voiceCheckInterval = setInterval(() => {
    if (voices.length > 0) {
        populateVoices();
        clearInterval(voiceCheckInterval);
    } else {
        populateVoices();
    }
}, 100);

// Live Word and Character Counter
textInput.addEventListener("input", () => {
    const text = textInput.value;
    charCount.textContent = text.length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    wordCount.textContent = words;
});

// Update slider visual values
rateInput.addEventListener("input", () => {
    rateValue.textContent = rateInput.value + "x";
});

pitchInput.addEventListener("input", () => {
    pitchValue.textContent = pitchInput.value;
});

// Play / Stop functionality
speakButton.addEventListener("click", () => {
    if (synth.speaking) {
        synth.cancel();
        waveContainer.classList.remove("active");
        speakButton.innerHTML = '<i class="fas fa-play"></i> Play Speech';
        return;
    }

    if (textInput.value.trim() !== "") {
        synth.cancel();

        const utterThis = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoiceIndex = voiceSelect.value;
        
        if (voices[selectedVoiceIndex]) {
            utterThis.voice = voices[selectedVoiceIndex];
        }

        utterThis.rate = parseFloat(rateInput.value);
        utterThis.pitch = parseFloat(pitchInput.value);

        utterThis.onstart = () => {
            waveContainer.classList.add("active");
            speakButton.innerHTML = '<i class="fas fa-stop"></i> Stop Speech';
        };

        utterThis.onend = () => {
            waveContainer.classList.remove("active");
            speakButton.innerHTML = '<i class="fas fa-play"></i> Play Speech';
        };

        utterThis.onerror = () => {
            waveContainer.classList.remove("active");
            speakButton.innerHTML = '<i class="fas fa-play"></i> Play Speech';
        };

        synth.speak(utterThis);
    }
});

// Reset functionality
clearButton.addEventListener("click", () => {
    synth.cancel();
    textInput.value = "";
    charCount.textContent = "0";
    wordCount.textContent = "0";
    rateInput.value = "1";
    pitchInput.value = "1";
    rateValue.textContent = "1x";
    pitchValue.textContent = "1";
    waveContainer.classList.remove("active");
    speakButton.innerHTML = '<i class="fas fa-play"></i> Play Speech';
});
