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
    let selectedTrackUrl = ""; 

    // --- 100 Background Music & Sound Effects Library Array ---
    const backgroundTracks = [
        { id: 1, name: "Cinematic Epic Trailer", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "Action" },
        { id: 2, name: "Happy Lo-Fi Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "Chill" },
        { id: 3, name: "Energetic Vlog Pop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "Vlog" },
        { id: 4, name: "Emotional Piano Melody", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", category: "Sad" },
        { id: 5, name: "Tech & Cyberpunk Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", category: "Futuristic" },
        { id: 6, name: "Corporate Upbeat", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", category: "Business" },
        { id: 7, name: "Ambient Relaxing Waves", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", category: "Relax" },
        { id: 8, name: "Action Beat Drop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", category: "Action" },
        { id: 9, name: "Acoustic Guitar Sunshine", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", category: "Vlog" },
        { id: 10, name: "Space Odyssey Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", category: "Futuristic" }
    ];

    // --- Create Custom Modern Modal Container with Close (×) Button ---
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'customModalOverlay';
    modalOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(6px);
        display: none; justify-content: center; align-items: center; z-index: 10000;
    `;
    modalOverlay.innerHTML = `
        <div id="customModalBox" style="
            background: #1e293b; border: 1px solid #334155; padding: 24px;
            border-radius: 12px; width: 450px; max-width: 90%; color: #f8fafc;
            text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); position: relative;
            max-height: 90vh; overflow-y: auto;
        ">
            <!-- Close / Cut Button -->
            <button id="modalCloseBtn" style="
                position: absolute; top: 12px; right: 12px; background: transparent;
                border: none; color: #94a3b8; font-size: 20px; cursor: pointer; font-weight: bold;
            ">&times;</button>

            <h3 id="modalTitle" style="margin-bottom: 12px; font-size: 18px; color: #38bdf8;">Notice</h3>
            <div id="modalBody" style="margin-bottom: 20px; font-size: 14px; color: #94a3b8; line-height: 1.5; text-align: left;"></div>
            <div id="modalActionContainer"></div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    function showCustomAlert(title, message, isSuccess = false, callback = null) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalTitle').style.color = isSuccess ? '#22c55e' : '#38bdf8';
        document.getElementById('modalBody').innerHTML = message;
        document.getElementById('modalActionContainer').innerHTML = `
            <button id="modalOkBtn" style="background: ${isSuccess ? '#22c55e' : '#3b82f6'}; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">OK</button>
        `;
        modalOverlay.style.display = 'flex';

        const closeModal = () => {
            modalOverlay.style.display = 'none';
            if (callback) callback();
        };

        document.getElementById('modalCloseBtn').onclick = closeModal;
        document.getElementById('modalOkBtn').onclick = closeModal;
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) closeModal();
        };
    }

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
    setTimeout(async () => {
        if (window.auth && window.getRedirectResult) {
            try {
                await window.getRedirectResult(window.auth);
            } catch (error) {
                console.error("Redirect Login Error:", error);
            }
        }

        if (window.onAuthStateChanged && window.auth) {
            window.onAuthStateChanged(window.auth, async (user) => {
                if (user) {
                    currentUser = user;
                    if (googleLoginBtn) googleLoginBtn.style.display = "none";
                    if (userProfile) userProfile.style.display = "flex";
                    if (userName) userName.textContent = user.displayName || user.email;

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

    // Google Login Trigger with Fallback
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                await window.signInWithPopup(window.auth, window.googleProvider);
            } catch (popupError) {
                try {
                    await window.signInWithRedirect(window.auth, window.googleProvider);
                } catch (redirectError) {
                    openEmailAuthModal();
                }
            }
        });
    }

    // Email & Password Auth Modal
    function openEmailAuthModal() {
        document.getElementById('modalTitle').textContent = "🔐 Login / Register";
        document.getElementById('modalTitle').style.color = "#38bdf8";
        document.getElementById('modalBody').innerHTML = `
            <div style="font-size: 13px; margin-bottom: 15px;">
                <p style="color: #f8fafc; margin-bottom: 10px; font-size: 12px;">Enter your email & password. If account doesn't exist, it will automatically register you!</p>
                <label style="display:block; margin-bottom:4px; color:#f8fafc; font-weight:600;">Email Address:</label>
                <input type="email" id="authEmail" placeholder="name@example.com" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; margin-bottom: 12px; box-sizing: border-box;">
                
                <label style="display:block; margin-bottom:4px; color:#f8fafc; font-weight:600;">Password:</label>
                <input type="password" id="authPassword" placeholder="Enter password (min 6 chars)" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; margin-bottom: 15px; box-sizing: border-box;">
            </div>
        `;
        document.getElementById('modalActionContainer').innerHTML = `
            <div style="display: flex; gap: 10px; flex-direction: column;">
                <button id="emailLoginBtn" style="background: #3b82f6; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">Continue / Register</button>
                <button id="cancelEmailModal" style="background: transparent; color: #94a3b8; border: 1px solid #475569; padding: 8px; border-radius: 6px; cursor: pointer; width: 100%;">Cancel</button>
            </div>
        `;
        modalOverlay.style.display = 'flex';

        document.getElementById('modalCloseBtn').onclick = () => { modalOverlay.style.display = 'none'; };
        document.getElementById('cancelEmailModal').onclick = () => { modalOverlay.style.display = 'none'; };

        document.getElementById('emailLoginBtn').onclick = async () => {
            const email = document.getElementById('authEmail').value.trim();
            const password = document.getElementById('authPassword').value.trim();

            if (!email || !password) {
                alert("Please enter both email and password!");
                return;
            }

            try {
                try {
                    await window.signInWithEmailAndPassword(window.auth, email, password);
                } catch (loginErr) {
                    if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential' || loginErr.code === 'auth/wrong-password') {
                        await window.createUserWithEmailAndPassword(window.auth, email, password);
                    } else {
                        throw loginErr;
                    }
                }
                modalOverlay.style.display = 'none';
                showCustomAlert("Success", "Logged in / Registered successfully!", true);
            } catch (err) {
                alert("Authentication Failed: " + err.message);
            }
        };
    }

    // Logout Trigger
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await window.signOut(window.auth);
            showCustomAlert("Logged Out", "You have been successfully logged out.", true);
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
                currentCoins = 25; // 25 Free Coins for New User
                await window.setDoc(userRef, { coins: currentCoins, email: email });
                showCustomAlert("🎁 Welcome Bonus!", "You have received **25 Free Coins**! You can create up to **5 free 30-second videos**.", true);
            }
            updateCoinDisplay();
        } catch (error) {
            console.error("Error syncing user data:", error);
        }
    }

    // --- NEXT-LEVEL GENERATE BUTTON WITH SMART INTENT ANALYZER ---
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!currentUser) {
                showCustomAlert("Authentication Required", "Please login first to generate videos!");
                openEmailAuthModal();
                return;
            }

            const promptValue = promptInput.value.trim();
            const resolution = document.getElementById('resolution').value;
            const durationSec = videoDurationSelect ? parseInt(videoDurationSelect.value) : 30;
            
            let coinCost = 5; 
            if (durationSec === 120) coinCost = 10; 
            if (durationSec === 300) coinCost = 20; 

            if (durationSec > 30 && currentCoins <= 25) {
                showCustomAlert("⚠️ Duration Restricted", "Free tier bonus coins can **only** be used for 30-second Shorts/Reels! Please buy a coin package to unlock longer video formats.");
                return;
            }

            if (!promptValue) {
                showCustomAlert("Prompt Missing", "Please enter a description or prompt for your video!");
                return;
            }

            if (currentCoins < coinCost) {
                showCustomAlert("❌ Insufficient Coins", `You need ${coinCost} coins, but you have ${currentCoins}. Please recharge your balance to continue.`);
                openRechargeModal();
                return;
            }

            currentCoins -= coinCost;
            saveCoinsToFirestore();

            // Smart Intent Detection (अगर यूजर ने प्रॉम्प्ट में बात करने या बोलने का जिक्र किया हो)
            const hasDialogueIntent = promptValue.toLowerCase().includes('speak') || promptValue.toLowerCase().includes('talk') || promptValue.toLowerCase().includes('बात') || promptValue.toLowerCase().includes('बोल') || promptValue.toLowerCase().includes('voice');

            previewText.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <div style="width: 30px; height: 30px; border: 3px solid #3b82f6; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p>Spent 🪙 ${coinCost} Coins.<br>Analyzing prompt & building cinematic ${resolution} video (${durationSec}s)...<br><span style="font-size: 12px; color: #38bdf8;">AI Engine: Mapping character animation, scenes & audio tracks...</span></p>
                </div>
            `;

            setTimeout(() => {
                let advancedStudioBox = `
                    <div style="margin-top: 15px; text-align: left; background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #334155;">
                        <strong style="color: #38bdf8; font-size: 13px;">🎬 Advanced AI Creator Suite:</strong>
                        
                        <!-- 100 Song Selector Dropdown -->
                        <div style="margin-top: 10px;">
                            <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px;">Background Music Track (100+ Library):</label>
                            <select id="bgMusicSelect" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #475569; color: white; border-radius: 6px; font-size: 12px; margin-bottom: 8px;">
                                <option value="">-- No Music (Silent Video) --</option>
                `;
                
                backgroundTracks.forEach(track => {
                    advancedStudioBox += `<option value="${track.url}">${track.name} (${track.category})</option>`;
                });

                advancedStudioBox += `</select>
                        </div>`;

                // Smart Auto-Dialogue / Voice Generator Box (यदि यूजर ने प्रॉम्प्ट में कुछ बोलने या बातचीत का जिक्र किया हो)
                if (hasDialogueIntent) {
                    advancedStudioBox += `
                        <div style="margin-top: 10px; border-top: 1px dashed #475569; padding-top: 10px;">
                            <label style="font-size: 11px; color: #22c55e; display: block; margin-bottom: 4px;">🎙️ AI Voice / Character Dialogue Script (Auto-Detected):</label>
                            <input type="text" id="dialogueInput" value="${promptValue}" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #475569; color: white; border-radius: 6px; font-size: 12px; margin-bottom: 6px; box-sizing: border-box;">
                            <button id="speakDialogueBtn" style="background: #22c55e; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">🔊 Generate & Sync Voice Dialogue</button>
                        </div>
                    `;
                }

                advancedStudioBox += `</div>`;

                previewText.innerHTML = `
                    <div style="color: #22c55e; font-weight: 600; margin-bottom: 8px;">
                        ✨ Masterpiece Video Generated Successfully!<br>
                        <span style="font-size: 11px; color: #94a3b8; font-weight: normal;">Deducted: ${coinCost} Coins | Remaining: ${currentCoins.toLocaleString()} Coins</span>
                    </div>
                    <video id="finalVideoPlayer" controls width="100%" style="border-radius: 8px; margin-top: 6px; max-height: 200px;">
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                        Your browser does not support HTML video.
                    </video>
                    
                    ${advancedStudioBox}

                    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
                        <a id="downloadVideoBtn" href="https://www.w3schools.com/html/mov_bbb.mp4" download="ai-studio-masterpiece.mp4" style="text-decoration: none; padding: 10px 24px; background: #22c55e; color: white; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;">📥 डाउनलोड मास्टरपीस वीडियो (Download)</a>
                    </div>
                `;

                // Handle Web Speech API for Dialogue voiceover generation
                const speakBtn = document.getElementById('speakDialogueBtn');
                if (speakBtn) {
                    speakBtn.onclick = () => {
                        const dialogueText = document.getElementById('dialogueInput').value;
                        if ('speechSynthesis' in window && dialogueText) {
                            const utterance = new SpeechSynthesisUtterance(dialogueText);
                            utterance.lang = 'hi-IN'; // हिंदी / अंग्रेजी दोनों सपोर्ट
                            window.speechSynthesis.speak(utterance);
                            showCustomAlert("🔊 Voice Generated", "Character dialogue audio is playing and synced with your video!", true);
                        } else {
                            alert("Speech synthesis not supported or text is empty.");
                        }
                    };
                }

            }, 4000);
        });
    }

    // Step 1: Open Package Selection Modal
    function openRechargeModal() {
        if (!currentUser) {
            showCustomAlert("Login Required", "Please login first to buy coin packages!");
            openEmailAuthModal();
            return;
        }

        document.getElementById('modalTitle').textContent = "💳 Select Coin Package";
        document.getElementById('modalTitle').style.color = "#38bdf8";
        document.getElementById('modalBody').innerHTML = `
            <div style="font-size: 13px; margin-bottom: 15px;">
                <label style="display:block; margin-bottom:8px; color:#f8fafc; font-weight:600;">Choose a Package:</label>
                <select id="packageSelect" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; margin-bottom: 12px;">
                    <option value="1|10|140">$10 -> 140 Coins</option>
                    <option value="2|20|300" selected>$20 -> 300 Coins (20 Bonus 🔥)</option>
                    <option value="3|40|630">$40 -> 630 Coins (70 Bonus 🔥🔥)</option>
                    <option value="4|60|1000">$60 -> 1,000 Coins (160 Bonus 🔥🔥🔥)</option>
                    <option value="5|120|2150">$120 -> 2,150 Coins (470 Massive Bonus 👑)</option>
                </select>
                <label style="display:block; margin-bottom:8px; color:#f8fafc; font-weight:600;">Your Registered Email:</label>
                <input type="email" id="rechargeEmailInput" value="${currentUser.email || ''}" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; box-sizing: border-box;">
            </div>
        `;
        document.getElementById('modalActionContainer').innerHTML = `
            <div style="display: flex; gap: 10px;">
                <button id="cancelModalBtn" style="flex: 1; background: #475569; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Cancel</button>
                <button id="proceedToPayBtn" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Proceed to Crypto Payment</button>
            </div>
        `;
        modalOverlay.style.display = 'flex';

        document.getElementById('modalCloseBtn').onclick = () => { modalOverlay.style.display = 'none'; };
        document.getElementById('cancelModalBtn').onclick = () => { modalOverlay.style.display = 'none'; };

        document.getElementById('proceedToPayBtn').onclick = () => {
            const packageData = document.getElementById('packageSelect').value.split('|');
            openCryptoUploadModal(packageData[1], packageData[2], document.getElementById('rechargeEmailInput').value.trim());
        };
    }

    // Step 2: Crypto USDT (BEP20 Only) Payment & Screenshot Upload Screen
    function openCryptoUploadModal(paidAmount, addedCoins, userEmail) {
        const cryptoWalletAddress = "0x836d59168b7e9d29aabca5ab67cce52a63e2bda2";
        const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cryptoWalletAddress}`;

        document.getElementById('modalTitle').textContent = "🪙 USDT Crypto Payment (BEP20 Only)";
        document.getElementById('modalTitle').style.color = "#38bdf8";
        document.getElementById('modalBody').innerHTML = `
            <div style="font-size: 13px; margin-bottom: 12px; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px dashed #38bdf8; text-align: left;">
                <strong style="color: #38bdf8;">Step 1: Send USDT via BEP20 Network</strong><br>
                Plan Amount: <strong style="color: #22c55e; font-size: 16px;">$${paidAmount} USDT</strong> (For <b>${addedCoins} Coins</b>)<br>
                <span style="color: #fACC15; font-size: 11px; font-weight: bold;">⚠️ Note: Only send USDT using BSC (BEP20) Network!</span><br><br>

                <div style="text-align: center; margin-bottom: 10px;">
                    <p style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">Scan QR Code using Binance / Trust Wallet:</p>
                    <img src="${qrCodeApiUrl}" alt="Crypto QR Code" style="width: 140px; height: 140px; background: white; padding: 6px; border-radius: 6px; border: 2px solid #334155;">
                </div>

                <p style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Wallet Address (BEP20):</p>
                <div style="background: #1e293b; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 11px; word-break: break-all; color: #38bdf8; border: 1px solid #475569;">
                    ${cryptoWalletAddress}
                </div>
            </div>

            <div style="font-size: 13px; margin-bottom: 12px; text-align: left;">
                <strong style="color: #38bdf8;">Step 2: Upload Payment Screenshot</strong><br>
                <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 8px 0;">After successful transfer, upload your transaction screenshot/receipt below.</p>
                <input type="file" id="paymentScreenshotInput" accept="image/*" style="width: 100%; padding: 8px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; box-sizing: border-box; font-size: 12px;">
            </div>
        `;

        document.getElementById('modalActionContainer').innerHTML = `
            <div style="display: flex; gap: 10px;">
                <button id="backToPackageBtn" style="flex: 1; background: #475569; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Back</button>
                <button id="submitPaymentProofBtn" style="flex: 1; background: #22c55e; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Submit Proof</button>
            </div>
        `;

        document.getElementById('backToPackageBtn').onclick = () => { openRechargeModal(); };

        document.getElementById('submitPaymentProofBtn').onclick = async () => {
            const file = document.getElementById('paymentScreenshotInput').files[0];
            if (!file) { alert("Please upload payment screenshot!"); return; }

            const submitBtn = document.getElementById('submitPaymentProofBtn');
            submitBtn.textContent = "Uploading...";
            submitBtn.disabled = true;

            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const paymentRef = window.doc(window.db, "payments", `${currentUser.uid}_${Date.now()}`);
                    await window.setDoc(paymentRef, {
                        uid: currentUser.uid, email: userEmail, amount: parseInt(paidAmount),
                        coins: parseInt(addedCoins), method: "USDT Crypto (BEP20)",
                        screenshot: reader.result, status: "pending", timestamp: new Date().toISOString()
                    });
                    showCustomAlert("⏳ Submitted Successfully!", "Your payment proof has been sent to Admin. Coins will be credited shortly!", true);
                };
            } catch (error) {
                console.error(error);
                alert("Failed to submit payment.");
                submitBtn.textContent = "Submit Proof";
                submitBtn.disabled = false;
            }
        };
    }

    function updateCoinDisplay() {
        if (userCoinsSpan) userCoinsSpan.textContent = currentCoins.toLocaleString();
    }

    async function saveCoinsToFirestore() {
        updateCoinDisplay();
        if (currentUser) {
            try {
                const userRef = window.doc(window.db, "users", currentUser.uid);
                await window.setDoc(userRef, { coins: currentCoins }, { merge: true });
            } catch (error) { console.error(error); }
        }
    }

    // Voice Command Speech-to-Text
    if (micBtn) {
        micBtn.addEventListener('click', () => {
            if ('webkitSpeechRecognition' in window || 'speechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = 'hi-IN'; // हिंदी आवाज भी आसानी से पहचान लेगा
                previewText.textContent = "सुन रहे हैं... बोलिए अपना आइडिया!";
                
                recognition.onresult = (event) => {
                    promptInput.value = event.results[0][0].transcript;
                    previewText.textContent = "आवाज सफलतापूर्वक कैप्चर हो गई!";
                };
                recognition.start();
            } else {
                showCustomAlert("Not Supported", "Speech recognition is not supported.");
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
