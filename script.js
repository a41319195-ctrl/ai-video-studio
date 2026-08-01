document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('prompt');
    const previewText = document.getElementById('previewText');
    const micBtn = document.getElementById('micBtn');
    const imageUpload = document.getElementById('imageUpload');

    // Generate Button Click Logic
    generateBtn.addEventListener('click', () => {
        const promptValue = promptInput.value.trim();
        const resolution = document.getElementById('resolution').value;
        const aspectRatio = document.getElementById('aspectRatio').value;

        if (!promptValue) {
            alert('Please enter a description or prompt for your video!');
            return;
        }

        // Show Loading State
        previewText.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="width: 30px; height: 30px; border: 3px solid #3b82f6; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p>Generating your cinematic ${resolution} video (${aspectRatio})...<br><span style="font-size: 12px; color: #94a3b8;">Synthesizing visuals, audio & effects...</span></p>
            </div>
        `;

        // Simulate Generation Process (Will be connected to backend API later)
        setTimeout(() => {
            previewText.innerHTML = `
                <div style="color: #22c55e; font-weight: 600;">
                    ✅ Video Generated Successfully!<br>
                    <span style="font-size: 12px; color: #94a3b8; font-weight: normal;">(Backend API integration pending)</span>
                </div>
            `;
        }, 4000);
    });

    // Voice Command Simulation (Speech Recognition)
    micBtn.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window || 'speechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'en-US';
            previewText.textContent = "Listening... Speak your prompt now!";
            
            recognition.onresult = (event) => {
                const speechToText = event.results[0][0].transcript;
                promptInput.value = speechToText;
                previewText.textContent = "Voice captured successfully!";
            };

            recognition.onerror = () => {
                previewText.textContent = "Voice recognition failed. Please type your prompt.";
            };

            recognition.start();
        } else {
            alert('Speech recognition is not supported on your browser. Please type your prompt.');
        }
    });

    // Image Upload Handler
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            previewText.innerHTML = `📁 Image Loaded: <strong>${file.name}</strong><br><span style="font-size: 12px; color: #94a3b8;">Ready for Image-to-Video conversion.</span>`;
        }
    });
});

// Add simple spinner animation dynamically
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
document.head.appendChild(styleSheet);
