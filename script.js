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
    const musicGrid = document.getElementById("musicGrid");
    const currentTrackDisplay = document.getElementById("currentTrackDisplay");
    const selectedTrackName = document.getElementById("selectedTrackName");
    const trackCoinCost = document.getElementById("trackCoinCost");
    const applyMusicBtn = document.getElementById("applyMusicBtn");
    const videoPlayerContainer = document.getElementById("videoPlayerContainer");
    const finalVideoPlayer = document.getElementById("finalVideoPlayer");
    const downloadVideoBtn = document.getElementById("downloadVideoBtn");

    let currentUser = null;
    let currentCoins = 0;
    let selectedTrackUrl = "";
    let selectedTrackNameText = "";
    let selectedTrackCost = 0;
    let backgroundAudioElement = null;
    let videoPlayerElement = null;
    let isVideoGenerated = false;
    let generatedVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

    // ADMIN SYSTEM WALLET - This is the central transaction manager
    const ADMIN_WALLET_ID = "admin_wallet";
    const ADMIN_PASSWORD = "Hak0786@";

    // 100+ Music Tracks Database
    const musicTracks = [
        // Hindi Trending Tracks
        { id: 1, name: "Kesariya - Brahmastra", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "Hindi", duration: 180 },
        { id: 2, name: "Apna Bana Le - Bhediya", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "Hindi", duration: 210 },
        { id: 3, name: "Kalank - Title Track", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "Hindi", duration: 240 },
        { id: 4, name: "Ghungroo - War", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", category: "Hindi", duration: 195 },
        { id: 5, name: "Tum Hi Ho - Aashiqui 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", category: "Hindi", duration: 270 },
        { id: 6, name: "Dilbar - Satyameva Jayate", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", category: "Hindi", duration: 175 },
        { id: 7, name: "Chamma Chamma - Fraud Saiyaan", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", category: "Hindi", duration: 190 },
        { id: 8, name: "Leja Re - T-Series", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", category: "Hindi", duration: 200 },
        { id: 9, name: "Dance Monkey - Hindi Cover", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", category: "Hindi", duration: 185 },
        { id: 10, name: "Butterfly - Jazz", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", category: "Hindi", duration: 160 },
        { id: 11, name: "Mere Ghar Ram Aaye", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", category: "Hindi", duration: 220 },
        { id: 12, name: "Jai Shri Ram - A.R. Rahman", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", category: "Hindi", duration: 250 },
        { id: 13, name: "Kya Hua Tera Wada", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", category: "Hindi", duration: 230 },
        { id: 14, name: "Tere Mast Mast Do Nain", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", category: "Hindi", duration: 260 },
        { id: 15, name: "Jeena Jeena - Badlapur", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", category: "Hindi", duration: 205 },
        { id: 16, name: "Suna Hai - Koi Mil Gaya", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", category: "Hindi", duration: 215 },
        { id: 17, name: "Bhool Bhulaiyaa 2 - Title", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", category: "Hindi", duration: 225 },
        { id: 18, name: "Laung Laachi - Punjabi", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", category: "Hindi", duration: 170 },
        { id: 19, name: "Param Sundari - Mimi", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3", category: "Hindi", duration: 155 },
        { id: 20, name: "Bade Miyan Chote Miyan", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3", category: "Hindi", duration: 165 },

        // English Trending Tracks
        { id: 21, name: "Shape of You - Ed Sheeran", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "English", duration: 195 },
        { id: 22, name: "Blinding Lights - Weeknd", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "English", duration: 185 },
        { id: 23, name: "Levitating - Dua Lipa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "English", duration: 185 },
        { id: 24, name: "Dance Monkey - Tones", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", category: "English", duration: 175 },
        { id: 25, name: "Believer - Imagine Dragons", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", category: "English", duration: 205 },
        { id: 26, name: "Senorita - Camila Cabello", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", category: "English", duration: 190 },
        { id: 27, name: "Roar - Katy Perry", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", category: "English", duration: 200 },
        { id: 28, name: "Firework - Katy Perry", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", category: "English", duration: 185 },
        { id: 29, name: "Timber - Pitbull", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", category: "English", duration: 195 },
        { id: 30, name: "Party Rock Anthem", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", category: "English", duration: 260 },
        { id: 31, name: "Uptown Funk - Bruno Mars", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", category: "English", duration: 260 },
        { id: 32, name: "Happy - Pharrell Williams", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", category: "English", duration: 210 },
        { id: 33, name: "Let It Go - Frozen", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", category: "English", duration: 210 },
        { id: 34, name: "Shallow - Lady Gaga", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", category: "English", duration: 180 },
        { id: 35, name: "Someone You Loved", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", category: "English", duration: 195 },
        { id: 36, name: "Bad Guy - Billie Eilish", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", category: "English", duration: 185 },
        { id: 37, name: "Old Town Road - Lil Nas", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", category: "English", duration: 200 },
        { id: 38, name: "Peaches - Justin Bieber", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", category: "English", duration: 185 },
        { id: 39, name: "Montero - Lil Nas X", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3", category: "English", duration: 185 },
        { id: 40, name: "Stay - Kid LAROI", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3", category: "English", duration: 170 },

        // Mix / International / Trending
        { id: 41, name: "Despacito - Luis Fonsi", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "Mix", duration: 220 },
        { id: 42, name: "Ai Se Eu Te Pego", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "Mix", duration: 180 },
        { id: 43, name: "Gangnam Style - Psy", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "Mix", duration: 210 },
        { id: 44, name: "Macarena - Los Del Rio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", category: "Mix", duration: 220 },
        { id: 45, name: "La Bamba - Ritchie Valens", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", category: "Mix", duration: 140 },
        { id: 46, name: "Waka Waka - Shakira", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", category: "Mix", duration: 210 },
        { id: 47, name: "We Are The World", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", category: "Mix", duration: 280 },
        { id: 48, name: "Heal The World - MJ", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", category: "Mix", duration: 260 },
        { id: 49, name: "Earth Song - Michael Jackson", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", category: "Mix", duration: 320 },
        { id: 50, name: "Another Day In Paradise", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", category: "Mix", duration: 240 },
        { id: 51, name: "Every Breath You Take", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", category: "Mix", duration: 210 },
        { id: 52, name: "Hello - Adele", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", category: "Mix", duration: 290 },
        { id: 53, name: "All Of Me - John Legend", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", category: "Mix", duration: 250 },
        { id: 54, name: "Thinking Out Loud", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", category: "Mix", duration: 280 },
        { id: 55, name: "Perfect - Ed Sheeran", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", category: "Mix", duration: 260 },
        { id: 56, name: "Photograph - Ed Sheeran", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", category: "Mix", duration: 250 },
        { id: 57, name: "Say You Won't Let Go", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", category: "Mix", duration: 250 },
        { id: 58, name: "I'm Yours - Jason Mraz", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", category: "Mix", duration: 240 },
        { id: 59, name: "I Gotta Feeling - BEP", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3", category: "Mix", duration: 280 },
        { id: 60, name: "Poker Face - Lady Gaga", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3", category: "Mix", duration: 200 },
        { id: 61, name: "Tik Tok - Kesha", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "Mix", duration: 190 },
        { id: 62, name: "Dynamite - BTS", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "Mix", duration: 190 },
        { id: 63, name: "Butter - BTS", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "Mix", duration: 180 },
        { id: 64, name: "Kill This Love - Blackpink", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", category: "Mix", duration: 195 },
        { id: 65, name: "How You Like That", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", category: "Mix", duration: 185 },
        { id: 66, name: "Boombayah - Blackpink", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", category: "Mix", duration: 210 },
        { id: 67, name: "Ddu-Du Ddu-Du", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", category: "Mix", duration: 200 },
        { id: 68, name: "MONEY - Lisa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", category: "Mix", duration: 170 },
        { id: 69, name: "LALISA - Lisa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", category: "Mix", duration: 195 },
        { id: 70, name: "Pink Venom - Blackpink", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", category: "Mix", duration: 185 },
        { id: 71, name: "Shut Down - Blackpink", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", category: "Mix", duration: 175 },
        { id: 72, name: "After LIKE - IVE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", category: "Mix", duration: 170 },
        { id: 73, name: "LOVE DIVE - IVE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", category: "Mix", duration: 175 },
        { id: 74, name: "ELEVEN - IVE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", category: "Mix", duration: 180 },
        { id: 75, name: "WA DA DA - Kep1er", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", category: "Mix", duration: 180 },
        { id: 76, name: "Savage - aespa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", category: "Mix", duration: 190 },
        { id: 77, name: "Next Level - aespa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", category: "Mix", duration: 200 },
        { id: 78, name: "Black Mamba - aespa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", category: "Mix", duration: 185 },
        { id: 79, name: "Drunk-Dazed - ENHYPEN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3", category: "Mix", duration: 210 },
        { id: 80, name: "Fever - ENHYPEN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3", category: "Mix", duration: 200 },
        { id: 81, name: "Polaroid Love", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "Mix", duration: 180 },
        { id: 82, name: "Let Me In - ENHYPEN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "Mix", duration: 195 },
        { id: 83, name: "Tamed-Dashed - ENHYPEN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "Mix", duration: 205 },
        { id: 84, name: "Future Perfect - ENHYPEN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", category: "Mix", duration: 195 },
        { id: 85, name: "Blessed-Cursed - ENHYPEN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", category: "Mix", duration: 185 },
        { id: 86, name: "ParadoXXX Invasion", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", category: "Mix", duration: 190 },
        { id: 87, name: "TFW - ENHYPEN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", category: "Mix", duration: 180 },
        { id: 88, name: "Just A Little Bit", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", category: "Mix", duration: 175 },
        { id: 89, name: "Upper Side Dreamin'", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", category: "Mix", duration: 180 },
        { id: 90, name: "Attention - NewJeans", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", category: "Mix", duration: 185 },
        { id: 91, name: "Hype Boy - NewJeans", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", category: "Mix", duration: 175 },
        { id: 92, name: "Ditto - NewJeans", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", category: "Mix", duration: 180 },
        { id: 93, name: "OMG - NewJeans", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", category: "Mix", duration: 185 },
        { id: 94, name: "Cookie - NewJeans", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", category: "Mix", duration: 190 },
        { id: 95, name: "Hurt - NewJeans", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", category: "Mix", duration: 175 },
        { id: 96, name: "Zero - NewJeans", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", category: "Mix", duration: 185 },
        { id: 97, name: "NewJeans - NewJeans", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", category: "Mix", duration: 180 },
        { id: 98, name: "Dance Monkey - Cover", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3", category: "Mix", duration: 175 },
        { id: 99, name: "Believer - Orchestral", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3", category: "Mix", duration: 200 },
        { id: 100, name: "Epic Cinematic Mix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3", category: "Mix", duration: 300 }
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

    // ============ ADMIN WALLET FUNCTIONS ============
    
    // Initialize Admin Wallet if not exists
    async function initializeAdminWallet() {
        try {
            const walletRef = window.doc(window.db, "system", ADMIN_WALLET_ID);
            const walletSnap = await window.getDoc(walletRef);
            
            if (!walletSnap.exists()) {
                await window.setDoc(walletRef, {
                    totalCoins: 1000000,
                    lastUpdated: new Date().toISOString()
                });
                console.log("✅ Admin Wallet initialized with 1,000,000 coins");
                return 1000000;
            }
            return walletSnap.data().totalCoins || 1000000;
        } catch (error) {
            console.error("Error initializing admin wallet:", error);
            return 1000000;
        }
    }

    // Get Admin Wallet Balance
    async function getAdminWalletBalance() {
        try {
            const walletRef = window.doc(window.db, "system", ADMIN_WALLET_ID);
            const walletSnap = await window.getDoc(walletRef);
            if (walletSnap.exists()) {
                return walletSnap.data().totalCoins || 1000000;
            }
            return 1000000;
        } catch (error) {
            console.error("Error getting admin wallet:", error);
            return 1000000;
        }
    }

    // Deduct from Admin Wallet (When giving coins to users)
    async function deductFromAdminWallet(amount) {
        try {
            const walletRef = window.doc(window.db, "system", ADMIN_WALLET_ID);
            const walletSnap = await window.getDoc(walletRef);
            let currentBalance = walletSnap.exists() ? walletSnap.data().totalCoins : 1000000;
            
            if (currentBalance < amount) {
                throw new Error("Admin wallet insufficient balance!");
            }
            
            const newBalance = currentBalance - amount;
            await window.setDoc(walletRef, {
                totalCoins: newBalance,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            
            console.log(`💰 Admin Wallet: -${amount} = ${newBalance}`);
            return newBalance;
        } catch (error) {
            console.error("Error deducting from admin wallet:", error);
            throw error;
        }
    }

    // Add to Admin Wallet (When users spend coins)
    async function addToAdminWallet(amount) {
        try {
            const walletRef = window.doc(window.db, "system", ADMIN_WALLET_ID);
            const walletSnap = await window.getDoc(walletRef);
            let currentBalance = walletSnap.exists() ? walletSnap.data().totalCoins : 1000000;
            
            const newBalance = currentBalance + amount;
            await window.setDoc(walletRef, {
                totalCoins: newBalance,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            
            console.log(`💰 Admin Wallet: +${amount} = ${newBalance}`);
            return newBalance;
        } catch (error) {
            console.error("Error adding to admin wallet:", error);
            throw error;
        }
    }

    // ============ USER COIN FUNCTIONS ============

    // Get user coins
    async function getUserCoins(uid) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);
            if (userSnap.exists()) {
                return userSnap.data().coins || 0;
            }
            return 0;
        } catch (error) {
            console.error("Error getting user coins:", error);
            return 0;
        }
    }

    // Set user coins with admin wallet deduction
    async function setUserCoins(uid, newBalance, deductFromAdmin = false) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            
            // If deducting from admin wallet
            if (deductFromAdmin) {
                const userSnap = await window.getDoc(userRef);
                const currentUserCoins = userSnap.exists() ? userSnap.data().coins || 0 : 0;
                const coinsToAdd = newBalance - currentUserCoins;
                
                if (coinsToAdd > 0) {
                    await deductFromAdminWallet(coinsToAdd);
                }
            }
            
            await window.setDoc(userRef, { coins: newBalance }, { merge: true });
            return newBalance;
        } catch (error) {
            console.error("Error setting user coins:", error);
            throw error;
        }
    }

    // Add coins to user with admin wallet deduction
    async function addUserCoins(uid, amount) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);
            let currentCoins = userSnap.exists() ? userSnap.data().coins || 0 : 0;
            
            // Deduct from admin wallet first
            await deductFromAdminWallet(amount);
            
            const newBalance = currentCoins + amount;
            await window.setDoc(userRef, { coins: newBalance }, { merge: true });
            
            return newBalance;
        } catch (error) {
            console.error("Error adding user coins:", error);
            throw error;
        }
    }

    // Spend user coins (adds back to admin wallet)
    async function spendUserCoins(uid, amount) {
        try {
            const userRef = window.doc(window.db, "users", uid);
            const userSnap = await window.getDoc(userRef);
            let currentCoins = userSnap.exists() ? userSnap.data().coins || 0 : 0;
            
            if (currentCoins < amount) {
                throw new Error("Insufficient coins!");
            }
            
            const newBalance = currentCoins - amount;
            await window.setDoc(userRef, { coins: newBalance }, { merge: true });
            
            // Add spent coins back to admin wallet
            await addToAdminWallet(amount);
            
            return newBalance;
        } catch (error) {
            console.error("Error spending user coins:", error);
            throw error;
        }
    }

    // ============ UI FUNCTIONS ============

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

    function updateCoinDisplay() {
        if (userCoinsSpan) {
            userCoinsSpan.innerHTML = `🪙 ${currentCoins.toLocaleString()}`;
        }
    }

    // ============ MUSIC LIBRARY ============

    function renderMusicLibrary() {
        if (!musicGrid) return;
        
        musicGrid.innerHTML = '';
        
        // Group by category
        const categories = {};
        musicTracks.forEach(track => {
            if (!categories[track.category]) {
                categories[track.category] = [];
            }
            categories[track.category].push(track);
        });

        // Render tracks
        musicTracks.forEach(track => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.dataset.id = track.id;
            
            const durationMinutes = Math.floor(track.duration / 60);
            const durationSeconds = track.duration % 60;
            const durationStr = durationMinutes > 0 ? `${durationMinutes}m ${durationSeconds}s` : `${durationSeconds}s`;
            
            // Calculate coin cost based on duration
            let cost = 2;
            if (track.duration <= 30) cost = 2;
            else if (track.duration <= 120) cost = 4;
            else if (track.duration <= 300) cost = 8;
            else cost = 8;
            
            item.innerHTML = `
                <span class="name">${track.name}</span>
                <span style="font-size: 10px; color: #94a3b8;">${durationStr}</span>
                <span style="font-size: 9px; color: #ffcc00; background: #0f172a; padding: 1px 6px; border-radius: 8px;">🪙${cost}</span>
                <button class="play-btn" data-url="${track.url}" data-name="${track.name}" data-cost="${cost}" data-id="${track.id}">▶</button>
            `;
            
            musicGrid.appendChild(item);
        });

        // Add event listeners to play buttons
        document.querySelectorAll('.music-item .play-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const url = this.dataset.url;
                const name = this.dataset.name;
                const cost = parseInt(this.dataset.cost);
                const id = parseInt(this.dataset.id);
                
                // Remove active class from all items
                document.querySelectorAll('.music-item').forEach(el => el.classList.remove('active'));
                this.closest('.music-item').classList.add('active');
                
                selectTrack(url, name, cost, id);
            });
        });
    }

    function selectTrack(url, name, cost, id) {
        selectedTrackUrl = url;
        selectedTrackNameText = name;
        selectedTrackCost = cost;
        
        // Update display
        if (currentTrackDisplay) {
            currentTrackDisplay.style.display = 'block';
            selectedTrackName.textContent = name;
            trackCoinCost.textContent = `Cost: ${cost} Coins`;
        }
        
        // Preview the track
        if (backgroundAudioElement) {
            backgroundAudioElement.pause();
            backgroundAudioElement = null;
        }
        
        backgroundAudioElement = new Audio(url);
        backgroundAudioElement.loop = true;
        backgroundAudioElement.play().catch(e => {
            // Auto-play blocked, user can click apply
        });
        
        showCustomAlert("🎵 Track Selected", `"${name}" selected!<br>Cost: 🪙 ${cost} coins to attach to video.<br>Click "Apply Music" to attach to your video.`, true);
    }

    // ============ APPLY MUSIC TO VIDEO ============

    if (applyMusicBtn) {
        applyMusicBtn.addEventListener('click', async function() {
            if (!currentUser) {
                showCustomAlert("Login Required", "Please login first!");
                openEmailAuthModal();
                return;
            }
            
            if (!isVideoGenerated) {
                showCustomAlert("No Video", "Please generate a video first!");
                return;
            }
            
            if (!selectedTrackUrl) {
                showCustomAlert("No Music Selected", "Please select a track from the Music Library first!");
                return;
            }
            
            if (currentCoins < selectedTrackCost) {
                showCustomAlert("❌ Insufficient Coins", `You need 🪙 ${selectedTrackCost} coins to attach this music, but you have 🪙 ${currentCoins}.`);
                return;
            }
            
            try {
                // Spend coins for music attachment
                currentCoins = await spendUserCoins(currentUser.uid, selectedTrackCost);
                updateCoinDisplay();
                
                // Attach music to video
                if (backgroundAudioElement) {
                    backgroundAudioElement.pause();
                    backgroundAudioElement = null;
                }
                
                backgroundAudioElement = new Audio(selectedTrackUrl);
                backgroundAudioElement.loop = true;
                
                if (videoPlayerElement) {
                    videoPlayerElement.onplay = () => {
                        backgroundAudioElement.play().catch(e => {});
                    };
                    videoPlayerElement.onpause = () => {
                        backgroundAudioElement.pause();
                    };
                    videoPlayerElement.onseeking = () => {
                        backgroundAudioElement.currentTime = videoPlayerElement.currentTime;
                    };
                    
                    backgroundAudioElement.play().then(() => {
                        videoPlayerElement.play();
                        showCustomAlert("🎵 Music Attached!", `"${selectedTrackNameText}" is now playing with your video!<br>🪙 ${selectedTrackCost} coins spent.`, true);
                    }).catch(err => {
                        showCustomAlert("Notice", "Click play on the video player to start audio.");
                    });
                }
                
            } catch (error) {
                showCustomAlert("Error", error.message || "Failed to attach music!");
            }
        });
    }

    // ============ AUTHENTICATION ============

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
        // Initialize admin wallet
        await initializeAdminWallet();
        
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
                    
                    // Give 25 free coins - DEDUCT from admin wallet
                    await addUserCoins(userCred.user.uid, 25);
                    
                    await window.setDoc(userRef, { 
                        coins: 25, 
                        email: email,
                        createdAt: new Date().toISOString()
                    }, { merge: true });
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
                // New user - give 25 free coins from admin wallet
                await addUserCoins(uid, 25);
                currentCoins = 25;
                await window.setDoc(userRef, { 
                    coins: 25, 
                    email: email,
                    createdAt: new Date().toISOString()
                }, { merge: true });
                showCustomAlert("🎁 Welcome Bonus!", "You have received **🪙 25 Free Coins**!<br>These come from the admin reserve wallet.", true);
            }
            updateCoinDisplay();
        } catch (error) {
            currentCoins = 25;
            updateCoinDisplay();
        }
    }

    function getCoinCost(durationSec) {
        if (durationSec === 30) return 2;
        if (durationSec === 120) return 4;
        if (durationSec === 300) return 8;
        return 2;
    }

    // ============ VIDEO GENERATION ============

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
            
            let coinCost = getCoinCost(durationSec);

            if (!promptValue) {
                showCustomAlert("Prompt Missing", "Please enter a description or prompt for your video!");
                return;
            }

            if (currentCoins < coinCost) {
                showCustomAlert("❌ Insufficient Coins", `You need 🪙 ${coinCost} coins, but you have 🪙 ${currentCoins}. Please recharge to continue.`);
                openRechargeModal();
                return;
            }

            try {
                // Spend coins for video generation - adds back to admin wallet
                currentCoins = await spendUserCoins(currentUser.uid, coinCost);
                updateCoinDisplay();

                previewText.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 30px 0;">
                        <div style="width: 35px; height: 35px; border: 3px solid #3b82f6; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <p style="color: #f8fafc; font-weight: 500;">Spent 🪙 ${coinCost} Coins.<br>Generating your cinematic ${resolution} video (${durationSec}s)...</p>
                    </div>
                `;

                setTimeout(() => {
                    // Show video player (NO music list inside)
                    videoPlayerContainer.style.display = 'block';
                    isVideoGenerated = true;
                    
                    // Set video source
                    if (finalVideoPlayer) {
                        finalVideoPlayer.src = generatedVideoUrl;
                        finalVideoPlayer.load();
                    }
                    
                    if (downloadVideoBtn) {
                        downloadVideoBtn.href = generatedVideoUrl;
                        downloadVideoBtn.download = `ai-generated-video-${Date.now()}.mp4`;
                    }
                    
                    previewText.innerHTML = `
                        <div style="color: #22c55e; font-weight: 600; margin-bottom: 8px; font-size: 13px;">
                            ✅ Video Generated Successfully! <span style="color: #94a3b8; font-weight: normal;">(🪙 Remaining: ${currentCoins.toLocaleString()})</span>
                        </div>
                    `;
                    
                    // Restore video player container (it was hidden, now show)
                    videoPlayerContainer.style.display = 'block';
                    
                    // Set video player reference
                    videoPlayerElement = finalVideoPlayer;

                }, 3500);

            } catch (error) {
                showCustomAlert("Error", error.message || "Failed to generate video!");
            }
        });
    }

    // ============ RECHARGE / PAYMENT SYSTEM ============

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
            <div style="font-size: 12px; color: #94a3b8; text-align: left; margin-top: 8px;">
                ⚡ Admin will verify and credit 🪙 ${addedCoins} coins from the admin reserve.
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
                showCustomAlert("⏳ Success!", "Payment proof submitted! Admin will verify and credit your coins.<br>🪙 ${addedCoins} coins will be added from admin reserve.", true);
                modalOverlay.style.display = 'none';
            };
        };
    }

    // ============ VOICE RECOGNITION ============

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

    // ============ IMAGE UPLOAD ============

    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                previewText.innerHTML = `📁 Image Loaded: <strong>${file.name}</strong>`;
            }
        });
    }

    // ============ INITIALIZE MUSIC LIBRARY ============
    renderMusicLibrary();

    // ============ ADMIN WALLET STATUS CHECK ============
    async function checkAdminWallet() {
        const balance = await getAdminWalletBalance();
        console.log(`🏦 Admin Wallet Balance: ${balance.toLocaleString()} coins`);
        return balance;
    }
    
    // Check admin wallet on load
    setTimeout(checkAdminWallet, 2000);
});

// Spin animation style
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
document.head.appendChild(styleSheet);
