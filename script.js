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
        // যদি ভয়েস না আসে, একটি ডিফল্ট অপশন রাখবে
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

// কিছু ব্রাউজারে ভয়েস লোড হতে সময় লাগে, তাই একাধিকবার চেক করার ব্যবস্থা
populateVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoices;
}

// ব্যাকআপ হিসেবে ১ সেকেন্ড পর আবার কল করা হলো যাতে মিস না হয়
setTimeout(populateVoices, 1000);

// স্পিচ বা ভয়েস রিডিং ফাংশন
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

// রিসেট বা পরিষ্কার করার বাটন
clearButton.addEventListener("click", () => {
    synth.cancel();
    textInput.value = "";
    waveContainer.classList.remove("active");
    speakButton.innerHTML = '<i class="fas fa-play"></i> Play';
});
