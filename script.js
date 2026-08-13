// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBV5xJssncq_IMdUENKxCw4C7wLIEuAvyE",
    authDomain: "ai-video-studio-global.firebaseapp.com",
    projectId: "ai-video-studio-global",
    storageBucket: "ai-video-studio-global.firebasestorage.app",
    messagingSenderId: "62203997603",
    appId: "1:62203997603:web:9ce058c677c9e13e75fe16",
    measurementId: "G-6D2C6T5HHH"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ========== UNIVERSAL MODAL ==========
function showModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('universalModal').classList.add('active');
}

document.getElementById('modalBtn').addEventListener('click', () => {
    document.getElementById('universalModal').classList.remove('active');
});

// ========== INDEX.HTML ==========
if (document.querySelector('.auth-container')) {
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const form = tab.dataset.tab;
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            document.getElementById(form + 'Form').classList.add('active');
        });
    });

    // Register
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const company = document.getElementById('regCompany').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const errorEl = document.getElementById('regError');

        if (!company || !email || !password) {
            errorEl.textContent = 'All fields required';
            return;
        }
        if (password.length < 6) {
            errorEl.textContent = 'Password must be at least 6 chars';
            return;
        }

        try {
            const apiKey = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase();
            await db.collection('owners').doc(email).set({
                company,
                email,
                password,
                status: 'pending',
                apiKey,
                webhook: `https://yourdomain.com/webhook/${apiKey}`,
                subscription: 'active',
                subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            });
            showModal('Registration Success', 'Your account is pending approval from admin.');
            document.getElementById('registerForm').reset();
            errorEl.textContent = '';
        } catch (err) {
            errorEl.textContent = err.message;
        }
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const errorEl = document.getElementById('loginError');

        if (!email || !password) {
            errorEl.textContent = 'All fields required';
            return;
        }

        try {
            const doc = await db.collection('owners').doc(email).get();
            if (!doc.exists) {
                errorEl.textContent = 'Account not found';
                return;
            }
            const data = doc.data();
            if (data.status !== 'approved') {
                errorEl.textContent = 'Your account is not yet approved by admin.';
                return;
            }
            if (data.password !== password) {
                errorEl.textContent = 'Invalid password';
                return;
            }
            // Store owner data in localStorage
            localStorage.setItem('ownerEmail', email);
            localStorage.setItem('ownerData', JSON.stringify(data));
            localStorage.setItem('workers', JSON.stringify([]));
            window.location.href = 'dashboard.html';
        } catch (err) {
            errorEl.textContent = err.message;
        }
    });
}

// ========== ADMIN.HTML ==========
if (document.querySelector('.admin-container')) {
    const ADMIN_PASSWORD = 'admin123';

    function adminLogin() {
        const pass = document.getElementById('adminPass').value;
        if (pass === ADMIN_PASSWORD) {
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            loadPendingApprovals();
        } else {
            showModal('Error', 'Invalid admin password');
        }
    }

    async function loadPendingApprovals() {
        const tbody = document.querySelector('#approvalTable tbody');
        tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
        try {
            const snapshot = await db.collection('owners').get();
            tbody.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data.company}</td>
                    <td>${data.email}</td>
                    <td>${data.status}</td>
                    <td>
                        ${data.status === 'pending' ? `<button onclick="approveOwner('${data.email}')">Approve</button>` : 'Approved'}
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="4">Error: ${err.message}</td></tr>`;
        }
    }

    window.approveOwner = async (email) => {
        try {
            await db.collection('owners').doc(email).update({ status: 'approved' });
            showModal('Success', 'Owner approved successfully');
            loadPendingApprovals();
        } catch (err) {
            showModal('Error', err.message);
        }
    };
}

// ========== DASHBOARD.HTML ==========
if (document.querySelector('.dashboard-container')) {
    let currentOwner = null;
    let workers = [];

    // Load owner data
    function loadOwner() {
        const data = localStorage.getItem('ownerData');
        if (!data) {
            window.location.href = 'index.html';
            return;
        }
        currentOwner = JSON.parse(data);
        document.getElementById('companyDisplay').textContent = currentOwner.company;
        // Check subscription
        const expiry = new Date(currentOwner.subscriptionExpiry);
        if (expiry < new Date()) {
            document.getElementById('subscriptionLock').style.display = 'flex';
        } else {
            document.getElementById('subscriptionLock').style.display = 'none';
        }
        // Load workers from localStorage
        const stored = localStorage.getItem('workers_' + currentOwner.email);
        if (stored) {
            workers = JSON.parse(stored);
            renderTable();
        }
    }

    // Add Worker
    window.addWorker = function() {
        const name = document.getElementById('workerName').value.trim();
        const id = document.getElementById('workerId').value.trim();
        const iban = document.getElementById('workerIban').value.trim();
        const salary = parseFloat(document.getElementById('workerSalary').value);

        if (!name || !id || !iban || isNaN(salary)) {
            showModal('Error', 'All fields are required and salary must be a number');
            return;
        }

        // Salary Validation
        const error = validateSalary(salary);
        if (error) {
            showModal('Salary Error', error);
            return;
        }

        const worker = { name, id, iban, salary };
        workers.push(worker);
        saveWorkers();
        renderTable();
        document.getElementById('workerName').value = '';
        document.getElementById('workerId').value = '';
        document.getElementById('workerIban').value = '';
        document.getElementById('workerSalary').value = '';
    };

    function validateSalary(salary) {
        if (salary <= 0) return 'Salary must be greater than 0';
        if (salary > 1000 && salary <= 1000.99) return 'Salary cannot exceed 1000 SAR for this slab';
        if (salary > 2000 && salary <= 2000.99) return 'Salary cannot exceed 2000 SAR for this slab';
        if (salary > 3000 && salary <= 3000.99) return 'Salary cannot exceed 3000 SAR for this slab';
        if (salary > 4000 && salary <= 4000.99) return 'Salary cannot exceed 4000 SAR for this slab';
        if (salary >= 5000) return 'Salary cannot be 5000 SAR or more (max 4999.99)';
        return null;
    }

    function saveWorkers() {
        localStorage.setItem('workers_' + currentOwner.email, JSON.stringify(workers));
    }

    function renderTable(filter = '') {
        const tbody = document.querySelector('#workersTable tbody');
        let filtered = workers;
        if (filter) {
            filtered = workers.filter(w =>
                w.name.toLowerCase().includes(filter.toLowerCase()) ||
                w.iban.includes(filter)
            );
        }
        tbody.innerHTML = '';
        filtered.forEach((w, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${w.name}</td>
                <td>${w.id}</td>
                <td>${w.iban}</td>
                <td>${w.salary.toFixed(2)} SAR</td>
                <td>
                    <button onclick="editWorker(${idx})">Edit</button>
                    <button onclick="deleteWorker(${idx})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    window.searchWorker = function() {
        const query = document.getElementById('searchInput').value;
        renderTable(query);
    };

    window.editWorker = function(index) {
        const w = workers[index];
        document.getElementById('workerName').value = w.name;
        document.getElementById('workerId').value = w.id;
        document.getElementById('workerIban').value = w.iban;
        document.getElementById('workerSalary').value = w.salary;
        // Remove from list
        workers.splice(index, 1);
        saveWorkers();
        renderTable();
    };

    window.deleteWorker = function(index) {
        workers.splice(index, 1);
        saveWorkers();
        renderTable();
    };

    window.submitPayroll = function() {
        // Check for any salary errors
        let errors = [];
        workers.forEach((w, idx) => {
            const err = validateSalary(w.salary);
            if (err) {
                errors.push(`Worker #${idx+1} (${w.name}): ${err}`);
            }
        });
        if (errors.length > 0) {
            showModal('Validation Errors', errors.join('\n'));
            return;
        }
        showModal('Success', 'Payroll submitted successfully!');
        // Here you can send to server or webhook
    };

    // Three-dot menu
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.querySelector('.three-dot-menu').classList.toggle('active');
    });

    document.getElementById('profileLink').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.three-dot-menu').classList.remove('active');
        showProfileModal();
    });

    document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });

    function showProfileModal() {
        const data = currentOwner;
        document.getElementById('profEmail').textContent = data.email;
        document.getElementById('profPass').textContent = data.password;
        document.getElementById('profCompany').textContent = data.company;
        document.getElementById('profApiKey').textContent = data.apiKey;
        document.getElementById('profWebhook').textContent = data.webhook;
        document.getElementById('profileModal').classList.add('active');
    }

    window.closeProfileModal = function() {
        document.getElementById('profileModal').classList.remove('active');
    };

    window.togglePassView = function() {
        const span = document.getElementById('profPass');
        if (span.textContent === '••••••') {
            span.textContent = currentOwner.password;
        } else {
            span.textContent = '••••••';
        }
    };

    // Initialize
    loadOwner();
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}
