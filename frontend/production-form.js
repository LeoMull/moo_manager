document.addEventListener('DOMContentLoaded', function() {
    initializeProductionForm();
});

let productionFormInitialized = false;
let lastAlertTime = 0;

function initializeProductionForm() {
    if (productionFormInitialized) return;
    
    const cowsForm = document.getElementById('cows-form');
    const addBtn = document.getElementById('add-cow-btn');
    const removeBtn = document.getElementById('remove-cow-btn');
    const submitBtn = document.getElementById('submit-production-btn');

    if (cowsForm && cowsForm.children.length === 0) {
        addCowRow();
    }

    if (addBtn) {
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            addCowRow();
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            removeCowRow();
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            handleProductionSubmit();
        });
    }
    
    productionFormInitialized = true;
    updateButtonsState();
}

function addCowRow() {
    const form = document.getElementById('cows-form');
    if (!form) return;
    
    const rows = form.querySelectorAll('.form-row');
    const now = Date.now();
    
    if (rows.length >= 5) {
        if (now - lastAlertTime > 2000) {
            showAlert('Limite atingido', 'Você pode adicionar no máximo 5 vacas por vez', 'warning');
            lastAlertTime = now;
        }
        return;
    }
    
    const newRow = document.createElement('div');
    newRow.className = 'form-row';
    newRow.innerHTML = `
        <div class="form-group">
            <input type="text" class="cow-id-input" placeholder="Digite o ID da vaca" required>
        </div>
        <div class="form-group cow-liters">
            <input type="number" class="cow-liters-input" placeholder="Quantidade (litros)" min="0" step="0.1" required>
        </div>
        <div class="form-group">
            <input type="date" class="cow-date-input" value="${new Date().toISOString().split('T')[0]}" required>
        </div>
    `;
    form.appendChild(newRow);
    
    updateButtonsState();
}

function removeCowRow() {
    const form = document.getElementById('cows-form');
    if (!form) return;
    
    const rows = form.querySelectorAll('.form-row');
    const now = Date.now();
    
    if (rows.length <= 1) {
        if (now - lastAlertTime > 2000) {
            showAlert('Ação não permitida', 'Você deve manter pelo menos 1 vaca no formulário', 'warning');
            lastAlertTime = now;
        }
        return;
    }
    
    form.removeChild(rows[rows.length - 1]);
    updateButtonsState();
}

function updateButtonsState() {
    const form = document.getElementById('cows-form');
    if (!form) return;
    
    const rows = form.querySelectorAll('.form-row');
    const addBtn = document.getElementById('add-cow-btn');
    const removeBtn = document.getElementById('remove-cow-btn');
    
    if (addBtn) {
        addBtn.disabled = rows.length >= 5;
        addBtn.title = rows.length >= 5 ? 'Limite máximo de 5 vacas atingido' : 'Adicionar nova vaca';
    }
    
    if (removeBtn) {
        removeBtn.disabled = rows.length <= 1;
        removeBtn.title = rows.length <= 1 ? 'Você precisa manter pelo menos 1 vaca' : 'Remover última vaca';
    }
}

function showAlert(title, message, type) {
    alert(`${title}\n${message}`);
}

async function handleProductionSubmit() {
    const rows = document.querySelectorAll('#cows-form .form-row');
    if (rows.length === 0) {
        showAlert('Formulário vazio', 'Adicione pelo menos uma vaca para registrar produção', 'error');
        return;
    }

    console.log('Enviando dados de produção...');
}
