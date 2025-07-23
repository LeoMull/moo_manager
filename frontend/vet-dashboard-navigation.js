document.addEventListener('DOMContentLoaded', function() {
    const homeBtn = document.getElementById('home-btn');
    const newAppointmentBtn = document.getElementById('new-appointment-btn');
    const newInseminationBtn = document.getElementById('new-insemination-btn');
    const newTreatmentBtn = document.getElementById('new-treatment-btn');
    const backProfileBtn = document.getElementById('back-profile-btn');

    const homeContent = document.getElementById('home-content');
    const cowsContent = document.getElementById('cows-content');
    const profileContent = document.getElementById('profile-content');
    const appointmentContent = document.getElementById('appointment-content');
    const inseminationContent = document.getElementById('insemination-content');
    const treatmentContent = document.getElementById('treatment-content');

    function showSection(sectionToShow) {
        document.querySelectorAll('.dashboard-section > div').forEach(section => {
            section.style.display = 'none';
        });
        
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }
    }

    homeBtn.addEventListener('click', () => {
        showSection(homeContent);
        updateHomeStats();
    });

    newAppointmentBtn.addEventListener('click', () => {
        showSection(appointmentContent);
        resetAppointmentForm();
    });

    newInseminationBtn.addEventListener('click', () => {
        showSection(inseminationContent);
        resetInseminationForm();
    });

    newTreatmentBtn.addEventListener('click', () => {
        showSection(treatmentContent);
        resetTreatmentForm();
    });

    backProfileBtn.addEventListener('click', () => {
        showSection(cowsContent);
    });

    function loadCowsList() {
        const cowsList = document.getElementById('cows-list');
        if (!cowsList) return;
        
        cowsList.innerHTML = '';
        
        const sampleCows = [
            { id: '001', name: 'Mimosa', breed: 'Holandesa', age: '4 anos' },
            { id: '002', name: 'Branquinha', breed: 'Jersey', age: '5 anos' },
            { id: '003', name: 'Preta', breed: 'Holandesa', age: '3 anos' },
            { id: '004', name: 'Malhada', breed: 'Girolando', age: '2 anos' }
        ];
        
        sampleCows.forEach(cow => {
            const cowItem = document.createElement('div');
            cowItem.className = 'list-item';
            cowItem.innerHTML = `
                <div class="list-column">${cow.id}</div>
                <div class="list-column">${cow.name}</div>
                <div class="list-column">${cow.breed}</div>
                <div class="list-column">${cow.age}</div>
                <div class="list-column">
                    <button class="action-btn view-btn" data-cow-id="${cow.id}">Ver</button>
                </div>
            `;
            cowsList.appendChild(cowItem);
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cowId = btn.getAttribute('data-cow-id');
                loadCowProfile(cowId);
                showSection(profileContent);
            });
        });
    }

    function loadCowProfile(cowId) {
        document.getElementById('cow-id-modal').textContent = `ID: #${cowId}`;
        document.getElementById('cow-name').textContent = 'Vaca #' + cowId;
        
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        
        document.querySelector('.tab-btn[data-tab="general"]').classList.add('active');
        document.getElementById('general-tab').classList.add('active');
    }

    function updateHomeStats() {
        document.getElementById('cows-need-care').textContent = '5';
        document.getElementById('pending-inseminations').textContent = '3';
        document.getElementById('today-appointments').textContent = '2';
    }

    function resetAppointmentForm() {
        const form = document.getElementById('appointment-form');
        if (form) {
            form.reset();
            const dateInput = document.getElementById('appointment-date');
            if (dateInput) {
                const now = new Date();
                const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                dateInput.value = localDateTime;
            }
        }
    }

    function resetInseminationForm() {
        const form = document.getElementById('insemination-form');
        if (form) {
            form.reset();
            const dateInput = document.getElementById('insemination-date');
            if (dateInput) {
                dateInput.valueAsDate = new Date();
            }
        }
    }

    function resetTreatmentForm() {
        const form = document.getElementById('treatment-form');
        if (form) {
            form.reset();
            const dateInput = document.getElementById('treatment-date');
            if (dateInput) {
                dateInput.valueAsDate = new Date();
            }
        }
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    showSection(homeContent);
    updateHomeStats();
});