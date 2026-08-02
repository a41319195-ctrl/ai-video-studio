document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const closeMenu = document.getElementById("closeMenu");
    const sidebar = document.getElementById("sidebar");
    const generateBtn = document.getElementById("generateBtn");
    const promptInput = document.getElementById("prompt");
    const previewText = document.getElementById("previewText");
    const micBtn = document.getElementById("micBtn");
    const imageUpload = document.getElementById("imageUpload");
    const userCoinsSpan = document.getElementById("userCoins");
    const videoDurationSelect = document.getElementById("videoDuration");
    const buyCoinsMenuLink = document.getElementById("buyCoinsMenuLink");
    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const userProfile = document.getElementById("userProfile");
    const userName = document.getElementById("userName");
    const logoutBtn = document.getElementById("logoutBtn");

    let currentUser = null;
    let currentCoins = 0;

    // Sidebar Toggle
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

    // Firebase Auth State Listener & Real-time Coin Sync
    setTimeout(() => {
        if (window.onAuthStateChanged && window.auth) {
            window.onAuthStateChanged(window.auth, async (user) => {
                if (user) {
                    currentUser = user;
                    if (googleLoginBtn) googleLoginBtn.style.display = "none";
                    if (userProfile) userProfile.style.display = "flex";
                    if (userName) userName.textContent = user.displayName || user.email;

                    // Load User Data & Setup Real-time Listener for Coins & Payments
                    await syncUserData(user.uid, user.email);
                } else {
                    currentUser = null;
                    if (googleLoginBtn) googleLoginBtn.style.display = "block";
                    if (userProfile) userProfile.style.display = "none";
                    if (userCoinsSpan) userCoinsSpan.textContent = "0";
                }
            });
        }
    }, 1000);

    // Google Login Trigger
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                await window.signInWithPopup(window.auth, window.googleProvider);
            } catch (error) {
                console.error("Login Error:", error);
                alert("Login failed. Please try again.");
            }
        });
    }

    // Logout Trigger
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await window.signOut(window.auth);
        });
    }

    // Sync User Data from Firestore
    async function syncUserData(uid, email) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);

            if (userSnap.exists()) {
                currentCoins = userSnap.data().coins || 0;
            } else {
                currentCoins = 15; // Free starter coins for new user
                await window.setDoc(userRef, { coins: currentCoins, email: email });
            }
            updateCoinDisplay();

            // Real-time listener to check if Admin approved pending coins
            // (Firestore onSnapshot can be added here for live auto-updating)
        } catch (error) {
            console.error("Error syncing user data:", error);
        }
    }

    // Generate Button & Coin Deduction Logic
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!currentUser) {
                alert("Please login with Google first to generate videos!");
                return;
            }

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

            if (currentCoins < coinCost) {
                alert(`❌ Insufficient Coins! You need ${coinCost} coins, but you have ${currentCoins}. Please buy coins to continue.`);
                openRechargeModal();
                return;
            }

            currentCoins -= coinCost;
            saveCoinsToFirestore();

            previewText.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <div style="width: 30px; height: 30px; border: 3px solid #3b82f6; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p>Spent 🪙 ${coinCost} Coins.<br>Generating your cinematic ${resolution} video (${durationSec}s)...<br><span style="font-size: 12px; color: #94a3b8;">Synthesizing visuals, audio & effects...</span></p>
                </div>
            `;

            // Simulate Video Generation Output with "Download" Button
            setTimeout(() => {
                previewText.innerHTML = `
                    <div style="color: #22c55e; font-weight: 600; margin-bottom: 10px;">
                        ✅ Video Generated Successfully!<br>
                        <span style="font-size: 12px; color: #94a3b8; font-weight: normal;">Deducted: ${coinCost} Coins | Remaining: ${currentCoins.toLocaleString()} Coins</span>
                    </div>
                    <video controls width="100%" style="border-radius: 8px; margin-top: 10px; max-height: 250px;">
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                        Your browser does not support HTML video.
                    </video>
                    <br>
                    <a href="https://www.w3schools.com/html/mov_bbb.mp4" download="ai-generated-video.mp4" style="display: inline-block; margin-top: 12px; text-decoration: none; padding: 10px 24px; background: #22c55e; color: white; border-radius: 6px; font-weight: bold;">डाउनलोड</a>
                `;
            }, 4000);
        });
    }

    // Coin Recharge Modal & Firebase Payment Queue Integration
    async function openRechargeModal() {
        if (!currentUser) {
            alert("Please login first to buy coin packages!");
            return;
        }

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
                case '1': paidAmount = 10; addedCoins = 140; break;
                case '2': paidAmount = 20; addedCoins = 300; break;
                case '3': paidAmount = 40; addedCoins = 630; break;
                case '4': paidAmount = 60; addedCoins = 1000; break;
                case '5': paidAmount = 120; addedCoins = 2150; break;
                default:
                    alert("Invalid selection. Please try again.");
                    return;
            }

            let sellerEmail = prompt("Enter your registered email address for payment tracking & admin notification:", currentUser.email);
            if (sellerEmail) {
                try {
                    // Send Payment Request to Firestore 'payments' collection for Admin Dashboard
                    const paymentRef = window.doc(window.db, "payments", `${currentUser.uid}_${Date.now()}`);
                    await window.setDoc(paymentRef, {
                        uid: currentUser.uid,
                        email: sellerEmail,
                        amount: paidAmount,
                        coins: addedCoins,
                        status: "pending",
                        timestamp: new Date().toISOString()
                    });

                    alert(`⏳ Payment request of $${paidAmount} submitted successfully!\nNotification sent to Admin Dashboard.\nOnce approved by Admin, 🪙 ${addedCoins} Coins will be automatically credited to your account.`);
                } catch (error) {
                    console.error("Error submitting payment:", error);
                    alert("Failed to submit payment request. Try again.");
                }
            }
        }
    }

    function updateCoinDisplay() {
        if (userCoinsSpan) {
            userCoinsSpan.textContent = currentCoins.toLocaleString();
        }
    }

    async function saveCoinsToFirestore() {
        updateCoinDisplay();
        if (currentUser) {
            try {
                const userRef = window.doc(window.db, "users", currentUser.uid);
                await window.setDoc(userRef, { coins: currentCoins }, { merge: true });
            } catch (error) {
                console.error("Error saving coins to DB:", error);
            }
        }
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
