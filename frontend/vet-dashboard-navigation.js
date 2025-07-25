// vet-dashboard-navigation.js
document.addEventListener('DOMContentLoaded', function() {
    const homeBtn = document.getElementById('home-btn');
    const newTreatmentBtn = document.getElementById('new-treatment-btn');
    const newInseminationBtn = document.getElementById('new-insemination-btn');
    const listTreatmentsBtn = document.getElementById('list-treatments-btn');

    const homeContent = document.getElementById('home-content');
    const treatmentsContent = document.getElementById('treatments-content');
    const treatmentContent = document.getElementById('treatment-content');
    const inseminationContent = document.getElementById('insemination-content');

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

    newTreatmentBtn.addEventListener('click', () => {
        showSection(treatmentContent);
        resetTreatmentForm();
    });

    newInseminationBtn.addEventListener('click', () => {
        showSection(inseminationContent);
        resetInseminationForm();
    });

    listTreatmentsBtn.addEventListener('click', () => {
        showSection(treatmentsContent);
        loadTreatmentsList();
    });

    function loadTreatmentsList() {
        const treatmentsList = document.getElementById('treatments-list');
        if (!treatmentsList) return;
        
        treatmentsList.innerHTML = '';
        
        const sampleCows = [
            { id: '001', name: 'Mimosa', breed: 'Holandesa', lastTreatment: '15/05/2024' },
            { id: '002', name: 'Branquinha', breed: 'Jersey', lastTreatment: '10/05/2024' },
            { id: '003', name: 'Preta', breed: 'Holandesa', lastTreatment: '05/05/2024' },
            { id: '004', name: 'Malhada', breed: 'Girolando', lastTreatment: '01/05/2024' }
        ];
        
        sampleCows.forEach(cow => {
            const cowItem = document.createElement('div');
            cowItem.className = 'list-row';
            cowItem.innerHTML = `
                <div class="list-item">${cow.id}</div>
                <div class="list-item">${cow.name}</div>
                <div class="list-item">${cow.breed}</div>
                <div class="list-item">${cow.lastTreatment}</div>
                <div class="list-item">
                    <button class="action-btn treat-btn" data-cow-id="${cow.id}">Atender</button>
                </div>
            `;
            treatmentsList.appendChild(cowItem);
        });
        
        document.querySelectorAll('.treat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cowId = btn.getAttribute('data-cow-id');
                document.getElementById('treatment-cow-id').value = cowId;
                showSection(treatmentContent);
            });
        });
    }

    function updateHomeStats() {
        document.getElementById('cows-need-care').textContent = '5';
        document.getElementById('pending-inseminations').textContent = '3';
        document.getElementById('today-appointments').textContent = '2';
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

    showSection(homeContent);
    updateHomeStats();
});
