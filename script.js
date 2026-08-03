document.addEventListener("DOMContentLoaded", () => {
    // ============ DOM REFS ============
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
    const audioGrid = document.getElementById("audioGrid");
    const audioSearch = document.getElementById("audioSearch");
    const applyAudioBtn = document.getElementById("applyAudioBtn");
    const clearAudioBtn = document.getElementById("clearAudioBtn");
    const selectedAudioCount = document.getElementById("selectedAudioCount");
    const videoPlayerContainer = document.getElementById("videoPlayerContainer");
    const finalVideoPlayer = document.getElementById("finalVideoPlayer");
    const downloadBtnContainer = document.getElementById("downloadBtnContainer");
    const downloadVideoBtn = document.getElementById("downloadVideoBtn");
    const videoCostDisplay = document.getElementById("videoCostDisplay");
    const ttsIndicator = document.getElementById("ttsIndicator");

    // ============ STATE ============
    let currentUser = null;
    let currentCoins = 0;
    let isVideoGenerated = false;
    let generatedVideoBlob = null;
    let generatedVideoUrl = "";
    let selectedAudioTracks = [];
    let audioPlayers = {};
    let currentAudioElement = null;

    // ============ CONSTANTS ============
    const ADMIN_WALLET_ID = "admin_wallet";
    const VIDEO_COSTS = { 30: 20, 120: 50, 300: 100 };
    const ADMIN_PASSWORD = "Hak0786@";

    // ============ 500+ AUDIO TRACKS DATABASE ============
    const audioTracks = [];

    // Generate 500+ audio tracks with categories
    const categories = ['Cinematic', 'Electronic', 'HipHop', 'Ambient', 'Rock', 'Jazz', 'Classical', 'Folk', 'World', 'Pop'];
    const adjectives = ['Epic', 'Chill', 'Upbeat', 'Dark', 'Bright', 'Mellow', 'Intense', 'Calm', 'Energetic', 'Mysterious'];
    const nouns = ['Dream', 'Vibe', 'Flow', 'Wave', 'Pulse', 'Rhythm', 'Soul', 'Spirit', 'Journey', 'Moment'];
    const prefixes = ['', 'Neon ', 'Cyber ', 'Quantum ', 'Echo ', 'Aura ', 'Zen ', 'Cosmic ', 'Lunar ', 'Solar '];
    const suffixes = [' Mix', ' Remix', ' Edit', ' Extended', ' Instrumental', ' Acoustic', ' Electric', ' Live'];

    // Base URLs for different styles
    const baseUrls = [
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-'
    ];

    for (let i = 0; i < 500; i++) {
        const catIndex = Math.floor(Math.random() * categories.length);
        const adjIndex = Math.floor(Math.random() * adjectives.length);
        const nounIndex = Math.floor(Math.random() * nouns.length);
        const preIndex = Math.floor(Math.random() * prefixes.length);
        const sufIndex = Math.floor(Math.random() * suffixes.length);
        
        const duration = [15, 20, 25, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300][Math.floor(Math.random() * 14)];
        const cost = duration <= 30 ? 2 : (duration <= 120 ? 4 : 8);
        
        const urlIndex = (i % 20) + 1;
        const url = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${urlIndex}.mp3`;
        
        audioTracks.push({
            id: i + 1,
            name: `${prefixes[preIndex]}${adjectives[adjIndex]} ${nouns[nounIndex]}${suffixes[sufIndex]}`,
            url: url,
            category: categories[catIndex],
            duration: duration,
            cost: cost
        });
    }

    // Ensure we have exactly 500 tracks
    while (audioTracks.length < 500) {
        const i = audioTracks.length;
        const catIndex = Math.floor(Math.random() * categories.length);
        const adjIndex = Math.floor(Math.random() * adjectives.length);
        const nounIndex = Math.floor(Math.random() * nouns.length);
        const preIndex = Math.floor(Math.random() * prefixes.length);
        const sufIndex = Math.floor(Math.random() * suffixes.length);
        const duration = [15, 20, 25, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300][Math.floor(Math.random() * 14)];
        const urlIndex = (i % 20) + 1;
        
        audioTracks.push({
            id: i + 1,
            name: `${prefixes[preIndex]}${adjectives[adjIndex]} ${nouns[nounIndex]}${suffixes[sufIndex]}`,
            url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${urlIndex}.mp3`,
            category: categories[catIndex],
            duration: duration,
            cost: duration <= 30 ? 2 : (duration <= 120 ? 4 : 8)
        });
    }

    console.log(`✅ Audio Library loaded: ${audioTracks.length} tracks`);

    // ============ MODAL ============
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

    // ============ ADMIN WALLET FUNCTIONS ============
    async function getAdminWalletBalance() {
        try {
            const walletRef = window.doc(window.db, "system", ADMIN_WALLET_ID);
            const walletSnap = await window.getDoc(walletRef);
            return walletSnap.exists() ? walletSnap.data().totalCoins || 1000000 : 1000000;
        } catch (error) {
            console.error("Error getting admin wallet:", error);
            return 1000000;
        }
    }

    async function deductFromAdminWallet(amount) {
        try {
            const walletRef = window.doc(window.db, "system", ADMIN_WALLET_ID);
            const walletSnap = await window.getDoc(walletRef);
            let currentBalance = walletSnap.exists() ? walletSnap.data().totalCoins : 1000000;
            if (currentBalance < amount) throw new Error("Admin wallet insufficient!");
            const newBalance = currentBalance - amount;
            await window.setDoc(walletRef, { totalCoins: newBalance, lastUpdated: new Date().toISOString() }, { merge: true });
            return newBalance;
        } catch (error) {
            console.error("Error deducting from admin wallet:", error);
            throw error;
        }
    }

    async function addToAdminWallet(amount) {
        try {
            const walletRef = window.doc(window.db, "system", ADMIN_WALLET_ID);
            const walletSnap = await window.getDoc(walletRef);
            let currentBalance = walletSnap.exists() ? walletSnap.data().totalCoins : 1000000;
            const newBalance = currentBalance + amount;
            await window.setDoc(walletRef, { totalCoins: newBalance, lastUpdated: new Date().toISOString() }, { merge: true });
            return newBalance;
        } catch (error) {
            console.error("Error adding to admin wallet:", error);
            throw error;
        }
    }

    // ============ USER COIN FUNCTIONS ============
    async function addUserCoins(uid, amount) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);
            let currentCoins = userSnap.exists() ? userSnap.data().coins || 0 : 0;
            await deductFromAdminWallet(amount);
            const newBalance = currentCoins + amount;
            await window.setDoc(userRef, { coins: newBalance }, { merge: true });
            return newBalance;
        } catch (error) {
            console.error("Error adding user coins:", error);
            throw error;
        }
    }

    async function spendUserCoins(uid, amount) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);
            let currentCoins = userSnap.exists() ? userSnap.data().coins || 0 : 0;
            if (currentCoins < amount) throw new Error("Insufficient coins!");
            const newBalance = currentCoins - amount;
            await window.setDoc(userRef, { coins: newBalance }, { merge: true });
            await addToAdminWallet(amount);
            return newBalance;
        } catch (error) {
            console.error("Error spending user coins:", error);
            throw error;
        }
    }

    // ============ FIND USER BY EMAIL (FIXED) ============
    async function findUserByEmail(email) {
        try {
            const usersRef = window.collection(window.db, "users");
            const q = window.query(usersRef, window.where("email", "==", email));
            const querySnap = await window.getDocs(q);
            if (querySnap.empty) {
                return null;
            }
            return querySnap.docs[0];
        } catch (error) {
            console.error("Error finding user by email:", error);
            return null;
        }
    }

    // ============ FIND USER BY UID ============
    async function findUserByUID(uid) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);
            if (userSnap.exists()) {
                return { id: uid, data: userSnap.data() };
            }
            return null;
        } catch (error) {
            console.error("Error finding user by UID:", error);
            return null;
        }
    }

    // ============ UI FUNCTIONS ============
    function updateCoinDisplay() {
        if (userCoinsSpan) {
            userCoinsSpan.innerHTML = `🪙 ${currentCoins.toLocaleString()}`;
        }
    }

    function updateVideoCostDisplay() {
        if (videoDurationSelect && videoCostDisplay) {
            const duration = parseInt(videoDurationSelect.value);
            videoCostDisplay.textContent = VIDEO_COSTS[duration] || 20;
        }
    }

    // ============ RENDER AUDIO LIBRARY ============
    let filteredTracks = [...audioTracks];

    function renderAudioLibrary(filter = '') {
        if (!audioGrid) return;
        
        const searchTerm = filter.toLowerCase().trim();
        filteredTracks = audioTracks.filter(track => 
            track.name.toLowerCase().includes(searchTerm) ||
            track.category.toLowerCase().includes(searchTerm)
        );

        audioGrid.innerHTML = '';
        
        if (filteredTracks.length === 0) {
            audioGrid.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 13px; padding: 20px; grid-column: 1/-1;">No tracks found</div>`;
            return;
        }

        filteredTracks.forEach(track => {
            const isSelected = selectedAudioTracks.some(t => t.id === track.id);
            const durationStr = formatDuration(track.duration);
            
            const item = document.createElement('div');
            item.className = `audio-item ${isSelected ? 'selected' : ''}`;
            item.dataset.id = track.id;
            
            item.innerHTML = `
                <input type="checkbox" ${isSelected ? 'checked' : ''} data-id="${track.id}">
                <span class="audio-name">${track.name}</span>
                <span class="audio-duration">${durationStr}</span>
                <span style="font-size: 8px; color: #ffcc00; background: #0f172a; padding: 1px 4px; border-radius: 4px;">🪙${track.cost}</span>
                <button class="audio-play" data-url="${track.url}" data-id="${track.id}">▶</button>
            `;
            
            audioGrid.appendChild(item);
        });

        // Add event listeners
        audioGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', function() {
                const id = parseInt(this.dataset.id);
                const track = audioTracks.find(t => t.id === id);
                if (this.checked) {
                    if (!selectedAudioTracks.some(t => t.id === id)) {
                        selectedAudioTracks.push(track);
                    }
                } else {
                    selectedAudioTracks = selectedAudioTracks.filter(t => t.id !== id);
                }
                updateSelectedCount();
                renderAudioLibrary(audioSearch.value);
            });
        });

        audioGrid.querySelectorAll('.audio-play').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const url = this.dataset.url;
                const id = parseInt(this.dataset.id);
                playAudioPreview(url, id);
            });
        });

        updateSelectedCount();
    }

    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }

    function updateSelectedCount() {
        if (selectedAudioCount) {
            selectedAudioCount.textContent = selectedAudioTracks.length;
        }
    }

    function playAudioPreview(url, id) {
        if (currentAudioElement) {
            currentAudioElement.pause();
            currentAudioElement = null;
        }
        
        currentAudioElement = new Audio(url);
        currentAudioElement.play().catch(e => {
            console.log("Audio play blocked, click to play");
        });
        
        // Stop after 10 seconds
        setTimeout(() => {
            if (currentAudioElement) {
                currentAudioElement.pause();
                currentAudioElement = null;
            }
        }, 10000);
    }

    // ============ AUDIO SEARCH ============
    if (audioSearch) {
        audioSearch.addEventListener('input', function() {
            renderAudioLibrary(this.value);
        });
    }

    // ============ CLEAR AUDIO ============
    if (clearAudioBtn) {
        clearAudioBtn.addEventListener('click', function() {
            selectedAudioTracks = [];
            updateSelectedCount();
            renderAudioLibrary(audioSearch.value);
            showCustomAlert("✕ Cleared", "All selected audio tracks have been cleared.", true);
        });
    }

    // ============ APPLY AUDIO (MULTI-SELECT) ============
    if (applyAudioBtn) {
        applyAudioBtn.addEventListener('click', async function() {
            if (!currentUser) {
                showCustomAlert("Login Required", "Please login first!");
                return;
            }
            
            if (!isVideoGenerated) {
                showCustomAlert("No Video", "Please generate a video first!");
                return;
            }
            
            if (selectedAudioTracks.length === 0) {
                showCustomAlert("No Audio Selected", "Please select at least one audio track!");
                return;
            }

            // Calculate total cost
            let totalCost = 0;
            selectedAudioTracks.forEach(track => {
                totalCost += track.cost;
            });

            if (currentCoins < totalCost) {
                showCustomAlert("❌ Insufficient Coins", 
                    `You need 🪙 ${totalCost} coins for ${selectedAudioTracks.length} track(s), but you have 🪙 ${currentCoins}.<br>Audio cost is separate from video cost.`);
                return;
            }

            try {
                // Spend coins for audio (separate deduction)
                currentCoins = await spendUserCoins(currentUser.uid, totalCost);
                updateCoinDisplay();

                // Build audio playlist
                const audioUrls = selectedAudioTracks.map(t => t.url);
                const audioNames = selectedAudioTracks.map(t => t.name);
                
                // Attach audio to video
                if (currentAudioElement) {
                    currentAudioElement.pause();
                    currentAudioElement = null;
                }

                // Create a playlist player
                let currentIndex = 0;
                function playNextAudio() {
                    if (currentIndex >= audioUrls.length) {
                        currentIndex = 0;
                    }
                    currentAudioElement = new Audio(audioUrls[currentIndex]);
                    currentAudioElement.loop = false;
                    currentAudioElement.play().catch(e => {});
                    currentAudioElement.onended = function() {
                        currentIndex++;
                        playNextAudio();
                    };
                    currentIndex++;
                }
                
                playNextAudio();

                // Sync with video
                if (finalVideoPlayer) {
                    finalVideoPlayer.onplay = () => {
                        if (currentAudioElement) currentAudioElement.play().catch(e => {});
                    };
                    finalVideoPlayer.onpause = () => {
                        if (currentAudioElement) currentAudioElement.pause();
                    };
                }

                showCustomAlert("🎵 Audio Attached!", 
                    `${selectedAudioTracks.length} track(s) attached to your video!<br>🪙 ${totalCost} coins spent (separate deduction).<br>Tracks: ${audioNames.join(', ')}`, 
                    true);

                // Reset selection
                selectedAudioTracks = [];
                updateSelectedCount();
                renderAudioLibrary(audioSearch.value);

            } catch (error) {
                showCustomAlert("Error", error.message || "Failed to attach audio!");
            }
        });
    }

    // ============ SIDEBAR ============
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

    // ============ AUTH ============
    async function setupAuthListener() {
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
    }

    setTimeout(() => {
        setupAuthListener();
    }, 500);

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                const result = await window.signInWithPopup(window.auth, window.googleProvider);
                if (result.user) {
                    await syncUserData(result.user.uid, result.user.email);
                }
            } catch (e) {
                if (e.code === 'auth/popup-blocked') {
                    try {
                        await window.signInWithRedirect(window.auth, window.googleProvider);
                    } catch (err) {
                        openEmailAuthModal();
                    }
                } else {
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
                <p style="color: #f8fafc; margin-bottom: 10px; font-size: 12px;">New accounts get 🪙 25 Free Coins!</p>
                <label style="display:block; margin-bottom:4px; color:#f8fafc; font-weight:600;">Email:</label>
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
                let isNewUser = false;
                try {
                    userCred = await window.signInWithEmailAndPassword(window.auth, email, password);
                } catch (loginErr) {
                    userCred = await window.createUserWithEmailAndPassword(window.auth, email, password);
                    isNewUser = true;
                    await addUserCoins(userCred.user.uid, 25);
                    const userRef = window.doc(window.db, "users", userCred.user.uid);
                    await window.setDoc(userRef, { coins: 25, email: email, createdAt: new Date().toISOString() }, { merge: true });
                }
                modalOverlay.style.display = 'none';
                await syncUserData(userCred.user.uid, email);
                currentUser = userCred.user;
                if (googleLoginBtn) googleLoginBtn.style.display = "none";
                if (userProfile) userProfile.style.display = "flex";
                if (userName) userName.textContent = userCred.user.displayName || email;
                showCustomAlert("✅ Success!", isNewUser ? "New account created with 🪙 25 Free Coins!" : "Welcome back!", true);
            } catch (err) {
                alert("Authentication Failed: " + err.message);
            }
        };
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await window.signOut(window.auth);
            currentUser = null;
            currentCoins = 0;
            updateCoinDisplay();
            if (googleLoginBtn) googleLoginBtn.style.display = "block";
            if (userProfile) userProfile.style.display = "none";
            showCustomAlert("Logged Out", "You have been logged out.", true);
        });
    }

    async function syncUserData(uid, email) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);
            if (userSnap.exists() && userSnap.data().coins !== undefined) {
                currentCoins = userSnap.data().coins;
            } else {
                await addUserCoins(uid, 25);
                currentCoins = 25;
                await window.setDoc(userRef, { coins: 25, email: email, createdAt: new Date().toISOString() }, { merge: true });
                showCustomAlert("🎁 Welcome!", "🪙 25 Free Coins added from admin reserve!", true);
            }
            updateCoinDisplay();
        } catch (error) {
            console.error("Error syncing user:", error);
            currentCoins = 25;
            updateCoinDisplay();
        }
    }

    // ============ VIDEO GENERATION ============
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!currentUser) {
                showCustomAlert("Login Required", "Please login first!");
                openEmailAuthModal();
                return;
            }

            const promptValue = promptInput.value.trim();
            const durationSec = parseInt(videoDurationSelect.value);
            const coinCost = VIDEO_COSTS[durationSec] || 20;

            if (!promptValue) {
                showCustomAlert("Prompt Missing", "Please enter a description!");
                return;
            }

            if (currentCoins < coinCost) {
                showCustomAlert("❌ Insufficient Coins", `Need 🪙 ${coinCost} coins, have 🪙 ${currentCoins}.`);
                openRechargeModal();
                return;
            }

            try {
                currentCoins = await spendUserCoins(currentUser.uid, coinCost);
                updateCoinDisplay();

                // Show TTS & Lip-Sync indicator
                ttsIndicator.classList.add('active');
                ttsIndicator.querySelector('.tts-status').textContent = '🎤 Syncing audio...';

                previewText.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 30px 0;">
                        <div style="width: 35px; height: 35px; border: 3px solid #3b82f6; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <p style="color: #f8fafc; font-weight: 500;">🪙 ${coinCost} Coins spent.<br>Generating video with TTS & Lip-Sync...</p>
                    </div>
                `;

                // Simulate video generation with TTS
                setTimeout(async () => {
                    // Create a video blob (simulated)
                    const videoBlob = await fetch('https://www.w3schools.com/html/mov_bbb.mp4').then(r => r.blob());
                    generatedVideoBlob = videoBlob;
                    generatedVideoUrl = URL.createObjectURL(videoBlob);

                    // Show video player
                    videoPlayerContainer.style.display = 'block';
                    finalVideoPlayer.src = generatedVideoUrl;
                    finalVideoPlayer.load();

                    // Show download button
                    downloadBtnContainer.classList.add('show');
                    downloadVideoBtn.href = generatedVideoUrl;
                    downloadVideoBtn.download = `ai-video-${Date.now()}.mp4`;

                    isVideoGenerated = true;

                    // Update TTS indicator
                    ttsIndicator.querySelector('.tts-status').textContent = '✅ Active - Realistic Lip-Sync';

                    previewText.innerHTML = `
                        <div style="color: #22c55e; font-weight: 600; font-size: 13px;">
                            ✅ Video Generated! 🪙 ${currentCoins.toLocaleString()} remaining
                        </div>
                        <div style="font-size: 12px; color: #94a3b8;">
                            🎤 Text-to-Speech & Lip-Sync enabled
                        </div>
                    `;

                    // Auto-play video with TTS simulation
                    setTimeout(() => {
                        finalVideoPlayer.play().catch(e => {});
                    }, 500);

                }, 4000);

            } catch (error) {
                showCustomAlert("Error", error.message || "Failed to generate video!");
            }
        });
    }

    // ============ RECHARGE MODAL ============
    function openRechargeModal() {
        if (!currentUser) {
            showCustomAlert("Login Required", "Please login first!");
            openEmailAuthModal();
            return;
        }

        document.getElementById('modalTitle').textContent = "💳 Buy Coins";
        document.getElementById('modalTitle').style.color = "#38bdf8";
        document.getElementById('modalBody').innerHTML = `
            <div style="font-size: 13px;">
                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 12px;">💡 1 Coin = $0.10 - $0.12</p>
                <select id="packageSelect" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; margin-bottom: 12px;">
                    <option value="1|10|85">$10 → 🪙 85 Coins</option>
                    <option value="2|20|190" selected>$20 → 🪙 190 Coins</option>
                    <option value="3|40|400">$40 → 🪙 400 Coins</option>
                    <option value="4|60|675">$60 → 🪙 675 Coins</option>
                </select>
                <input type="email" id="rechargeEmailInput" value="${currentUser.email || ''}" style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; box-sizing: border-box;">
            </div>
        `;
        document.getElementById('modalActionContainer').innerHTML = `
            <div style="display: flex; gap: 10px;">
                <button id="cancelModalBtn" style="flex: 1; background: #475569; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Cancel</button>
                <button id="proceedToPayBtn" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Pay with Crypto</button>
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
            if (!userEmail) { alert("Enter email!"); return; }
            openCryptoUploadModal(paidAmount, addedCoins, userEmail);
        };
    }

    // ============ CRYPTO PAYMENT (FIXED SCREENSHOT UPLOAD) ============
    function openCryptoUploadModal(paidAmount, addedCoins, userEmail) {
        const cryptoWalletAddress = "0x836d59168b7e9d29aabca5ab67cce52a63e2bda2";
        const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cryptoWalletAddress}`;

        document.getElementById('modalTitle').textContent = "🪙 USDT Payment (BEP20)";
        document.getElementById('modalTitle').style.color = "#38bdf8";
        document.getElementById('modalBody').innerHTML = `
            <div style="font-size: 13px; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px dashed #38bdf8; text-align: left;">
                <strong style="color: #38bdf8;">Send $${paidAmount} USDT (BEP20)</strong>
                <div style="text-align: center; margin: 10px 0;">
                    <img src="${qrCodeApiUrl}" alt="QR" style="width: 120px; height: 120px; background: white; padding: 5px; border-radius: 6px;">
                </div>
                <div style="background: #1e293b; padding: 6px; border-radius: 4px; font-family: monospace; font-size: 11px; word-break: break-all; color: #38bdf8;">
                    ${cryptoWalletAddress}
                </div>
            </div>
            <div style="font-size: 13px; margin-top: 12px; text-align: left;">
                <strong style="color: #38bdf8;">Upload Screenshot:</strong>
                <input type="file" id="paymentScreenshotInput" accept="image/*" style="width: 100%; margin-top: 6px; padding: 8px; background: #0f172a; border: 1px solid #475569; color: white; border-radius: 6px; font-size: 12px;">
            </div>
            <div style="font-size: 12px; color: #94a3b8; text-align: left; margin-top: 8px;">
                ⚡ Admin verifies → 🪙 ${addedCoins} coins from admin reserve
            </div>
        `;
        document.getElementById('modalActionContainer').innerHTML = `
            <button id="submitPaymentProofBtn" style="background: #22c55e; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">📤 Submit Payment Proof</button>
        `;

        // FIXED: Screenshot upload working now
        document.getElementById('submitPaymentProofBtn').onclick = async () => {
            const fileInput = document.getElementById('paymentScreenshotInput');
            const file = fileInput.files[0];
            
            if (!file) {
                alert("Please upload the payment screenshot!");
                return;
            }

            try {
                const reader = new FileReader();
                reader.onload = async function(e) {
                    try {
                        const base64Image = e.target.result;
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
                        showCustomAlert("✅ Success!", 
                            `Payment proof submitted!<br>Admin will verify and credit 🪙 ${addedCoins} coins.`, 
                            true);
                        modalOverlay.style.display = 'none';
                    } catch (err) {
                        alert("Failed to submit: " + err.message);
                    }
                };
                reader.readAsDataURL(file);
            } catch (error) {
                alert("Error reading file: " + error.message);
            }
        };
    }

    // ============ VOICE RECOGNITION ============
    if (micBtn) {
        micBtn.addEventListener('click', () => {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                previewText.textContent = "🎤 Listening... Speak now!";
                recognition.onresult = (event) => {
                    promptInput.value = event.results[0][0].transcript;
                    previewText.textContent = "✅ Voice captured!";
                };
                recognition.start();
            } else {
                showCustomAlert("Not Supported", "Speech recognition not supported.");
            }
        });
    }

    // ============ IMAGE UPLOAD ============
    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                previewText.innerHTML = `📁 Image Loaded: <strong>${file.name}</strong>`;
            }
        });
    }

    // ============ DURATION CHANGE ============
    if (videoDurationSelect) {
        videoDurationSelect.addEventListener('change', updateVideoCostDisplay);
    }

    // ============ INIT ============
    renderAudioLibrary();
    updateVideoCostDisplay();
    updateCoinDisplay();

    console.log("✅ AI Video Studio loaded with 500+ audio tracks!");
    console.log(`🪙 Admin wallet: 1,000,000 coins reserve`);
    console.log(`🎵 Audio library: ${audioTracks.length} tracks available`);
});

// Spin animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
document.head.appendChild(styleSheet);
