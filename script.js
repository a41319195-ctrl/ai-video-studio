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
    let backgroundAudioElement = null;

    const backgroundTracks = [
        { id: 1, name: "Epic Cinematic Hans Zimmer Style", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "Cinematic" },
        { id: 2, name: "Chill Lofi Beats & Study Vibes", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "Chill" },
        { id: 3, name: "Upbeat Electronic Corporate Pop", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "Upbeat" },
        { id: 4, name: "Ambient Space Meditation Dream", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", category: "Ambient" }
    ];

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'customModalOverlay';
    modalOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(5px);
        display: none; justify-content: center; align-items: center; z-index: 10000;
    `;
    modalOverlay.innerHTML = `
        <div id="customModalBox" style="
            background: #1e293b; border: 1px solid #334155; padding: 24px;
            border-radius: 12px; width: 450px; max-width: 90%; color: #f8fafc;
            text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); position: relative;
            max-height: 90vh; overflow-y: auto;
        ">
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

    if (menuBtn && sidebar && closeMenu) {
        menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
        closeMenu.addEventListener('click', () => sidebar.classList.remove('active'));
    }

    if (buyCoinsMenuLink) {
        buyCoinsMenuLink.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.remove('active');
            openRechargeModal();
        });
    }

    setTimeout(async () => {
        if (window.auth && window.getRedirectResult) {
            try { await window.getRedirectResult(window.auth); } catch (e) {}
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
                    currentCoins = 0;
                    updateCoinDisplay();
                }
            });
        }
    }, 1000);

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                await window.signInWithPopup(window.auth, window.googleProvider);
            } catch (e) {
                try {
                    await window.signInWithRedirect(window.auth, window.googleProvider);
                } catch (err) {
                    openEmailAuthModal();
                }
            }
        });
    }

    function openEmailAuthModal() {
        document.getElementById('modalTitle').textContent = "🔐 Login / Register";
        document.getElementById('modalTitle').style.color = "#38bdf8";
        document.getElementById('modalBody').innerHTML = `
            <div style="font-size: 13px; margin-bottom: 15px;">
                <p style="color: #f8fafc; margin-bottom: 10px; font-size: 12px;">New accounts get 🪙 **25 Free Coins** instantly!</p>
                <label style="display:block; margin-bottom:4px; color:#f8fafc; font-weight:600;">Email Address:</label>
                <input type="email" id="authEmail" placeholder="name@example.com" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; margin-bottom: 12px; box-sizing: border-box;">
                
                <label style="display:block; margin-bottom:4px; color:#f8fafc; font-weight:600;">Password:</label>
                <input type="password" id="authPassword" placeholder="Enter password" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; margin-bottom: 15px; box-sizing: border-box;">
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
                let userCred;
                try {
                    userCred = await window.signInWithEmailAndPassword(window.auth, email, password);
                } catch (loginErr) {
                    userCred = await window.createUserWithEmailAndPassword(window.auth, email, password);
                    const userRef = window.doc(window.db, "users", userCred.user.uid);
                    await window.setDoc(userRef, { coins: 25, email: email }, { merge: true });
                }
                modalOverlay.style.display = 'none';
                showCustomAlert("Success", "Logged in / Registered successfully with 🪙 25 Free Coins!", true);
            } catch (err) {
                alert("Authentication Failed: " + err.message);
            }
        };
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await window.signOut(window.auth);
            showCustomAlert("Logged Out", "You have been successfully logged out.", true);
        });
    }

    async function syncUserData(uid, email) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);

            if (userSnap.exists() && userSnap.data().coins !== undefined) {
                currentCoins = userSnap.data().coins;
            } else {
                currentCoins = 25; 
                await window.setDoc(userRef, { coins: currentCoins, email: email }, { merge: true });
                showCustomAlert("🎁 Welcome Bonus!", "You have received **🪙 25 Free Coins**!", true);
            }
            updateCoinDisplay();
        } catch (error) {
            currentCoins = 25;
            updateCoinDisplay();
        }
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!currentUser) {
                showCustomAlert("Authentication Required", "Please login first to generate videos!");
                openEmailAuthModal();
                return;
            }

            const promptValue = promptInput.value.trim();
            const resolution = document.getElementById('resolution') ? document.getElementById('resolution').value : "720p";
            const durationSec = videoDurationSelect ? parseInt(videoDurationSelect.value) : 30;
            
            let coinCost = 5; 
            if (durationSec === 120) coinCost = 10; 
            if (durationSec === 300) coinCost = 20; 

            if (!promptValue) {
                showCustomAlert("Prompt Missing", "Please enter a description or prompt for your video!");
                return;
            }

            if (currentCoins < coinCost) {
                showCustomAlert("❌ Insufficient Coins", `You need 🪙 ${coinCost} coins, but you have 🪙 ${currentCoins}. Please recharge to continue.`);
                openRechargeModal();
                return;
            }

            currentCoins -= coinCost;
            saveCoinsToFirestore();

            previewText.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 30px 0;">
                    <div style="width: 35px; height: 35px; border: 3px solid #3b82f6; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="color: #f8fafc; font-weight: 500;">Spent 🪙 ${coinCost} Coins.<br>Generating your cinematic ${resolution} video (${durationSec}s)...</p>
                </div>
            `;

            setTimeout(() => {
                let musicOptionsHtml = `
                    <div style="margin-top: 15px; text-align: left; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155;">
                        <label style="color: #38bdf8; font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">🎵 Select Background Music / Sound Effect:</label>
                        <select id="bgMusicSelectDropdown" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #475569; color: white; border-radius: 6px; font-size: 12px; margin-bottom: 8px;">
                            <option value="">-- No Background Music (Original Audio) --</option>`;
                
                backgroundTracks.forEach(track => {
                    musicOptionsHtml += `<option value="${track.url}">${track.name} (${track.category})</option>`;
                });

                musicOptionsHtml += `</select>
                        <button id="applyMusicBtn" style="background: #3b82f6; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; width: 100%;">Apply & Play with Track</button>
                    </div>`;

                previewText.innerHTML = `
                    <div style="color: #22c55e; font-weight: 600; margin-bottom: 8px; font-size: 13px;">
                        ✅ Video Generated Successfully! <span style="color: #94a3b8; font-weight: normal;">(🪙 Remaining: ${currentCoins.toLocaleString()})</span>
                    </div>
                    
                    <div style="width: 100%; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid #334155;">
                        <video id="finalVideoPlayer" controls width="100%" style="display: block; max-height: 200px; background: #000;">
                            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                            Your browser does not support HTML video.
                        </video>
                    </div>

                    ${musicOptionsHtml}

                    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
                        <a id="downloadVideoBtn" href="https://www.w3schools.com/html/mov_bbb.mp4" download="ai-generated-video.mp4" style="text-decoration: none; padding: 12px 20px; background: #22c55e; color: white; border-radius: 6px; font-weight: bold; font-size: 13px; display: block; text-align: center; width: 100%;">📥 डाउनलोड वीडियो (Download Video)</a>
                    </div>
                `;

                const videoPlayer = document.getElementById('finalVideoPlayer');
                const applyMusicBtn = document.getElementById('applyMusicBtn');

                if (applyMusicBtn) {
                    applyMusicBtn.onclick = () => {
                        const selectBox = document.getElementById('bgMusicSelectDropdown');
                        selectedTrackUrl = selectBox.value;

                        if (backgroundAudioElement) {
                            backgroundAudioElement.pause();
                            backgroundAudioElement = null;
                        }

                        if (selectedTrackUrl) {
                            backgroundAudioElement = new Audio(selectedTrackUrl);
                            backgroundAudioElement.loop = true;
                            
                            videoPlayer.onplay = () => backgroundAudioElement.play().catch(e => {});
                            videoPlayer.onpause = () => backgroundAudioElement.pause();
                            videoPlayer.onseeking = () => { backgroundAudioElement.currentTime = videoPlayer.currentTime; };

                            backgroundAudioElement.play().then(() => {
                                videoPlayer.play();
                                showCustomAlert("🎵 Music Playing!", "Selected background track is playing in sync with your video!", true);
                            }).catch(err => {
                                showCustomAlert("Notice", "Click play on the video player to start audio.");
                            });
                        } else {
                            if (backgroundAudioElement) backgroundAudioElement.pause();
                            showCustomAlert("Notice", "Audio track removed.");
                        }
                    };
                }

            }, 3500);
        });
    }

    function openRechargeModal() {
        if (!currentUser) {
            showCustomAlert("Login Required", "Please login first!");
            openEmailAuthModal();
            return;
        }

        document.getElementById('modalTitle').textContent = "💳 Select Coin Package";
        document.getElementById('modalTitle').style.color = "#38bdf8";
        document.getElementById('modalBody').innerHTML = `
            <div style="font-size: 13px; margin-bottom: 15px;">
                <label style="display:block; margin-bottom:8px; color:#f8fafc; font-weight:600;">Choose a Package:</label>
                <select id="packageSelect" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; margin-bottom: 12px;">
                    <option value="1|10|140">$10 -> 🪙 140 Coins</option>
                    <option value="2|20|300" selected>$20 -> 🪙 300 Coins (20 Bonus 🔥)</option>
                    <option value="3|40|630">$40 -> 🪙 630 Coins (70 Bonus 🔥🔥)</option>
                    <option value="4|60|1000">$60 -> 🪙 1,000 Coins (160 Bonus 🔥🔥🔥)</option>
                </select>
                <label style="display:block; margin-bottom:8px; color:#f8fafc; font-weight:600;">Your Registered Email:</label>
                <input type="email" id="rechargeEmailInput" value="${currentUser.email || ''}" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; box-sizing: border-box;">
            </div>
        `;
        document.getElementById('modalActionContainer').innerHTML = `
            <div style="display: flex; gap: 10px;">
                <button id="cancelModalBtn" style="flex: 1; background: #475569; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Cancel</button>
                <button id="proceedToPayBtn" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Proceed to Crypto</button>
            </div>
        `;
        modalOverlay.style.display = 'flex';

        document.getElementById('modalCloseBtn').onclick = () => { modalOverlay.style.display = 'none'; };
        document.getElementById('cancelModalBtn').onclick = () => { modalOverlay.style.display = 'none'; };

        document.getElementById('proceedToPayBtn').onclick = () => {
            const packageData = document.getElementById('packageSelect').value.split('|');
            const paidAmount = packageData[1];
            const addedCoins = packageData[2];
            const userEmail = document.getElementById('rechargeEmailInput').value.trim();

            if (!userEmail) {
                alert("Please enter a valid email address!");
                return;
            }
            openCryptoUploadModal(paidAmount, addedCoins, userEmail);
        };
    }

    function openCryptoUploadModal(paidAmount, addedCoins, userEmail) {
        const cryptoWalletAddress = "0x836d59168b7e9d29aabca5ab67cce52a63e2bda2";
        const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cryptoWalletAddress}`;

        document.getElementById('modalTitle').textContent = "🪙 USDT Crypto Payment (BEP20)";
        document.getElementById('modalTitle').style.color = "#38bdf8";
        document.getElementById('modalBody').innerHTML = `
            <div style="font-size: 13px; margin-bottom: 12px; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px dashed #38bdf8; text-align: left;">
                <strong style="color: #38bdf8;">Step 1: Send $${paidAmount} USDT (BEP20)</strong><br>
                <div style="text-align: center; margin: 10px 0;">
                    <img src="${qrCodeApiUrl}" alt="QR" style="width: 130px; height: 130px; background: white; padding: 5px; border-radius: 6px;">
                </div>
                <div style="background: #1e293b; padding: 6px; border-radius: 4px; font-family: monospace; font-size: 11px; word-break: break-all; color: #38bdf8;">
                    ${cryptoWalletAddress}
                </div>
            </div>
            <div style="font-size: 13px; margin-bottom: 12px; text-align: left;">
                <strong style="color: #38bdf8;">Step 2: Upload Screenshot</strong>
                <input type="file" id="paymentScreenshotInput" accept="image/*" style="width: 100%; margin-top: 6px; padding: 6px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; font-size: 12px;">
            </div>
        `;
        document.getElementById('modalActionContainer').innerHTML = `
            <button id="submitPaymentProofBtn" style="background: #22c55e; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">Submit Payment Proof</button>
        `;

        document.getElementById('submitPaymentProofBtn').onclick = async () => {
            const fileInput = document.getElementById('paymentScreenshotInput');
            const file = fileInput.files[0];
            if (!file) {
                alert("Please upload the payment screenshot!");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Image = reader.result;
                const paymentRef = window.doc(window.db, "payments", `${currentUser.uid}_${Date.now()}`);
                await window.setDoc(paymentRef, {
                    uid: currentUser.uid,
                    email: userEmail,
                    amount: parseInt(paidAmount),
                    coins: parseInt(addedCoins),
                    method: "USDT Crypto (BEP20)",
                    screenshot: base64Image,
                    status: "pending",
                    timestamp: new Date().toISOString()
                });
                showCustomAlert("⏳ Success!", "Payment proof submitted! Admin will verify and credit your coins.", true);
            };
        };
    }

    function updateCoinDisplay() {
        if (userCoinsSpan) {
            userCoinsSpan.innerHTML = `🪙 ${currentCoins.toLocaleString()}`;
        }
    }

    async function saveCoinsToFirestore() {
        updateCoinDisplay();
        if (currentUser) {
            try {
                const userRef = window.doc(window.db, "users", currentUser.uid);
                await window.setDoc(userRef, { coins: currentCoins }, { merge: true });
            } catch (error) {}
        }
    }

    if (micBtn) {
        micBtn.addEventListener('click', () => {
            if ('webkitSpeechRecognition' in window || 'speechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                previewText.textContent = "Listening... Speak now!";
                recognition.onresult = (event) => {
                    promptInput.value = event.results[0][0].transcript;
                    previewText.textContent = "Voice captured!";
                };
                recognition.start();
            } else {
                showCustomAlert("Not Supported", "Speech recognition not supported.");
            }
        });
    }

    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                previewText.innerHTML = `📁 Image Loaded: <strong>${file.name}</strong>`;
            }
        });
    }
});

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
document.head.appendChild(styleSheet);
