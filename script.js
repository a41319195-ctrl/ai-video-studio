// वर्कर्स का डेटा लोकल स्टोरेज से लोड करें
let workers = JSON.parse(localStorage.getItem('payrollData')) || [];

const payrollForm = document.getElementById('payroll-form');
const workerListBody = document.getElementById('worker-list-body');
const payBtn = document.getElementById('pay-now-btn');
const modal = document.getElementById('warning-modal');

// पेज लोड होते ही लिस्ट दिखाएं
function renderTable() {
    workerListBody.innerHTML = '';
    workers.forEach((w, index) => {
        workerListBody.innerHTML += `
            <tr>
                <td>${w.name}</td>
                <td>${w.iqama}</td>
                <td>${w.iban}</td>
                <td>${w.salary}</td>
                <td><button onclick="deleteWorker(${index})" style="background:#ff4757; color:white; border:none; padding:5px 10px; cursor:pointer;">Delete</button></td>
            </tr>
        `;
    });
}

// नया वर्कर सेव करें
payrollForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newWorker = {
        name: document.getElementById('worker-name').value,
        iqama: document.getElementById('iqama-number').value,
        iban: document.getElementById('iban-number').value,
        salary: parseFloat(document.getElementById('salary-amount').value)
    };
    workers.push(newWorker);
    localStorage.setItem('payrollData', JSON.stringify(workers));
    payrollForm.reset();
    renderTable();
});

// वर्कर डिलीट करें
function deleteWorker(index) {
    workers.splice(index, 1);
    localStorage.setItem('payrollData', JSON.stringify(workers));
    renderTable();
}

// 5000 लिमिट चेक वाला लॉजिक
payBtn.addEventListener('click', () => {
    const highSalaryWorkers = workers.filter(w => w.salary > 5000);
    
    if (highSalaryWorkers.length > 0) {
        // अगर कोई भी 5000 से ऊपर है, तो पॉप-अप दिखाओ
        document.getElementById('warning-text').innerText = 
            `Warning: ${highSalaryWorkers.length} worker(s) have salary above 5,000. Please confirm to proceed.`;
        modal.classList.remove('hidden');
    } else {
        alert("Payroll data is within limits. Proceeding to API...");
        // यहाँ से तुम्हारी बैंक API हिट होगी
    }
});

// कंफर्म बटन का काम
document.getElementById('confirm-pay-btn').addEventListener('click', () => {
    modal.classList.add('hidden');
    alert("Confirmed! Processing payroll via API...");
    // यहाँ से तुम्हारी बैंक API हिट होगी
});

// कैंसिल बटन का काम
document.getElementById('cancel-pay-btn').addEventListener('click', () => {
    modal.classList.add('hidden');
});

renderTable();
