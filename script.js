import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// तेरी Firebase कॉन्फ़िगरेशन (सिर्फ ओनर के लॉगिन/रजिस्ट्रेशन को मैनेज करने के लिए)
const firebaseConfig = {
  apiKey: "AIzaSyBV5xJssncq_IMdUENKxCw4C7wLIEuAvyE",
  authDomain: "ai-video-studio-global.firebaseapp.com",
  projectId: "ai-video-studio-global",
  storageBucket: "ai-video-studio-global.firebasestorage.app",
  messagingSenderId: "62203997603",
  appId: "1:62203997603:web:9ce058c677c9e13e75fe16",
  measurementId: "G-6D2C6T5HHH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// लोकल स्टोरेज से कंपनी की आईडी चेक करें
const companyId = localStorage.getItem('companyId');
const companyName = localStorage.getItem('companyName');

if (!companyId) {
    showUniversalPopup("एक्सेस डिनाइड", "कृपया पहले लॉगिन करें!", "index.html");
} else {
    const titleElement = document.getElementById('company-title');
    if (titleElement) {
        titleElement.innerText = `डैशबोर्ड: ${companyName}`;
    }
}

// वर्कर्स का डेटा केवल इसी कंपनी के लोकल स्टोरेज में रहेगा (आपके डेटाबेस में नहीं)
const storageKey = 'payroll_workers_' + companyId;
let workers = JSON.parse(localStorage.getItem(storageKey)) || [];

const payrollForm = document.getElementById('payroll-form');
const workerListBody = document.getElementById('worker-list-body');
const payBtn = document.getElementById('pay-now-btn');

// टेबल में वर्कर्स दिखाना
function renderTable() {
    if (!workerListBody) return;
    workerListBody.innerHTML = '';
    
    if (workers.length === 0) {
        workerListBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">कोई वर्कर नहीं जोड़ा गया है।</td></tr>';
        return;
    }

    workers.forEach((w, index) => {
        workerListBody.innerHTML += `
            <tr>
                <td>${w.name}</td>
                <td>${w.iqama}</td>
                <td>${w.iban}</td>
                <td>${w.salary}</td>
                <td><button onclick="window.deleteWorker(${index})" style="background:#ff4757; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:4px;">हटाएं</button></td>
            </tr>
        `;
    });
}

// नया वर्कर जोड़ना (लोकल स्टोरेज)
if (payrollForm) {
    payrollForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newWorker = {
            name: document.getElementById('worker-name').value,
            iqama: document.getElementById('iqama-number').value,
            iban: document.getElementById('iban-number').value,
            salary: parseFloat(document.getElementById('salary-amount').value)
        };
        workers.push(newWorker);
        localStorage.setItem(storageKey, JSON.stringify(workers));
        payrollForm.reset();
        renderTable();
        showUniversalPopup("सफलता", "वर्कर सफलतापूर्वक जोड़ दिया गया है!");
    });
}

// वर्कर डिलीट करना
window.deleteWorker = function(index) {
    workers.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(workers));
    renderTable();
}

// 5000 लिमिट चेक वाला लॉजिक और यूनिवर्सल पॉप-अप
if (payBtn) {
    payBtn.addEventListener('click', () => {
        const highSalaryWorkers = workers.filter(w => w.salary > 5000);
        
        if (highSalaryWorkers.length > 0) {
            showUniversalPopup("⚠️ हाई सैलरी चेतावनी", `चेतावनी: ${highSalaryWorkers.length} वर्कर(्स) की सैलरी 5,000 से अधिक है। कृपया इसे चेक करें।`);
        } else {
            showUniversalPopup("सफलता", "पेरोल डेटा लिमिट के अंदर है। बैंक API पर भेजा जा रहा है...");
        }
    });
}

// --- यूनिवर्सल मॉडर्न पॉप-अप फंक्शन ---
window.showUniversalPopup = function(title, message, redirectUrl = null) {
    let modalBox = document.getElementById('universal-modal');
    
    if (!modalBox) {
        const modalHTML = `
            <div id="universal-modal" style="display:flex; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.6); justify-content:center; align-items:center;">
                <div style="background:white; padding:30px; border-radius:15px; width:380px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.3);">
                    <h3 id="uni-title" style="color:#333; margin-top:0; font-size:22px;"></h3>
                    <p id="uni-msg" style="color:#666; font-size:16px; line-height:1.5;"></p>
                    <div style="margin-top:20px;">
                        <button id="uni-ok-btn" style="background:#007bff; color:white; border:none; padding:10px 25px; border-radius:8px; font-weight:bold; cursor:pointer;">ठीक है</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modalBox = document.getElementById('universal-modal');
    }

    document.getElementById('uni-title').innerText = title;
    document.getElementById('uni-msg').innerText = message;
    modalBox.style.display = 'flex';

    document.getElementById('uni-ok-btn').onclick = function() {
        modalBox.style.display = 'none';
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    };
};

window.logout = function() {
    localStorage.clear();
    window.location.href = "index.html";
}

renderTable();
