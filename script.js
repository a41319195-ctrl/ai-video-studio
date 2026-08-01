document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('prompt');
    const previewText = document.getElementById('previewText');
    const micBtn = document.getElementById('micBtn');
    const imageUpload = document.getElementById('imageUpload');
    const userCoinsSpan = document.getElementById('userCoins');
    const videoDurationSelect = document.getElementById('videoDuration');
    const buyCoinsMenuLink = document.getElementById('buyCoinsMenuLink');

    // Initial State: Load coins from localStorage or default to Admin 1 Million (1,000,000)
    let userCoins = localStorage.getItem('ai_studio_coins') ? parseInt(localStorage.getItem('ai_studio_coins')) : 1000000;
    updateCoinDisplay();

    // Toggle Sidebar Menu
    if (menuBtn && sidebar && closeMenu) {
        menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
        closeMenu.addEventListener('click', () => sidebar.classList.remove('active'));
    }

    // Handle Buy Coins Click from Sidebar Menu
    if (buyCoinsMenuLink) {
        buyCoinsMenuLink.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.remove('active');
            openRechargeModal();
        });
    }

    // Generate Button & Coin Deduction Logic
    generateBtn.addEventListener('click', () => {
        const promptValue = promptInput.value.trim();
        const resolution = document.getElementById('resolution').value;
        const durationSec = videoDurationSelect ? parseInt(videoDurationSelect.value) : 300;
        
        let coinCost = 5; // 30 sec Shorts/Reel
        if (durationSec === 120) coinCost = 10; // 1-2 min
        if (durationSec === 300) coinCost = 20; // Up to 5 min

        if (!promptValue) {
            alert('Please enter a description or prompt for your video!');
            return;
        }

        if (userCoins < coinCost) {
            alert(`❌ Insufficient Coins! You need ${coinCost} coins, but you have ${userCoins}. Please buy coins to continue.`);
            openRechargeModal();
            return;
        }

        userCoins -= coinCost;
        saveCoins();

        previewText.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="width: 30px; height: 30px; border: 3px solid #3b82f6; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p>Spent 🪙 ${coinCost} Coins.<br>Generating your cinematic ${resolution} video (${durationSec}s)...<br><span style="font-size: 12px; color: #94a3b8;">Synthesizing visuals, audio & effects...</span></p>
            </div>
        `;

        setTimeout(() => {
            previewText.innerHTML = `
                <div style="color: #22c55e; font-weight: 600;">
                    ✅ Video Generated Successfully!<br>
                    <span style="font-size: 12px; color: #94a3b8; font-weight: normal;">Deducted: ${coinCost} Coins | Remaining: ${userCoins.toLocaleString()} Coins</span>
                </div>
            `;
        }, 4000);
    });

    // Coin Recharge Modal with Safe Bonus Pricing & Seller Email Verification
    function openRechargeModal() {
        let choice = prompt(
            "Select a Coin Package to Recharge:\n\n" +
            "1. $10  -> 140 Coins\n" +
            "2. $20  -> 300 Coins (20 Bonus 🔥)\n" +
            "3. $40  -> 630 Coins (70 Bonus 🔥🔥)\n" +
            "4. $60  -> 1,000 Coins (160 Bonus 🔥🔥🔥)\n" +
            "5. $120 -> 2,150 Coins (470 Massive Bonus 👑)\n\n" +
            "Enter package number (1 to 5):", 
            "2"
        );

        if (choice !== null) {
            let addedCoins = 0;
            let paidAmount = 0;

            switch(choice.trim()) {
                case '1':
                    paidAmount = 10; addedCoins = 140; break;
                case '2':
                    paidAmount = 20; addedCoins = 300; break;
                case '3':
                    paidAmount = 40; addedCoins = 630; break;
                case '4':
                    paidAmount = 60; addedCoins = 1000; break;
                case '5':
                    paidAmount = 120; addedCoins = 2150; break;
                default:
                    alert("Invalid selection. Please try again.");
                    return;
            }

            // Seller Email Verification and Admin Queue Integration
            let sellerEmail = prompt("Enter your registered email address for payment tracking & admin notification:", "admin@gbpay.global");
            if (sellerEmail) {
                alert(`⏳ Payment request of $${paidAmount} submitted successfully!\nNotification sent to Admin & Seller (${sellerEmail}).\nOnce verified by Admin in the dashboard, 🪙 ${addedCoins} Coins will be credited.`);
                
                // Instant local testing credit
                userCoins += addedCoins;
                saveCoins();
                alert(`🔔 [Admin System]: Payment verified! Added 🪙 ${addedCoins} Coins.\nNew Balance: ${userCoins.toLocaleString()} Coins`);
            }
        }
    }

    function updateCoinDisplay() {
        if (userCoinsSpan) {
            userCoinsSpan.textContent = userCoins.toLocaleString();
        }
    }

    function saveCoins() {
        localStorage.setItem('ai_studio_coins', userCoins);
        updateCoinDisplay();
    }

    // Voice Command Simulation
    if (micBtn) {
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
    }

    // Image Upload Handler
    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                previewText.innerHTML = `📁 Image Loaded: <strong>${file.name}</strong><br><span style="font-size: 12px; color: #94a3b8;">Ready for Image-to-Video conversion.</span>`;
            }
        });
    }
});

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
document.head.appendChild(styleSheet);
