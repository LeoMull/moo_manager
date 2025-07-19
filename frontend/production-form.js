// production-form.js

document.addEventListener('DOMContentLoaded', function() {
    initializeProductionForm();
});

function initializeProductionForm() {
    const cowsForm = document.getElementById('cows-form');
    const addBtn = document.getElementById('add-cow-btn');
    const removeBtn = document.getElementById('remove-cow-btn');
    const submitBtn = document.getElementById('submit-production-btn');

    // Adiciona a primeira linha ao carregar
    if (cowsForm && cowsForm.children.length === 0) {
        addCowRow();
    }

    // Configura os listeners dos botões
    if (addBtn) addBtn.addEventListener('click', addCowRow);
    if (removeBtn) removeBtn.addEventListener('click', removeCowRow);
    if (submitBtn) submitBtn.addEventListener('click', handleProductionSubmit);
}

function addCowRow() {
    const newRow = document.createElement('div');
    newRow.className = 'form-row';
    newRow.innerHTML = `
        <div class="form-group">
            <input type="text" class="cow-id-input" placeholder="Digite o ID da vaca" required>
        </div>
        <div class="form-group cow-liters">
            <input type="number" class="cow-liters-input" placeholder="Quantidade (litros)" min="0" step="0.1" required>
        </div>
    `;
    document.getElementById('cows-form').appendChild(newRow);
}

function removeCowRow() {
    const form = document.getElementById('cows-form');
    const rows = form.querySelectorAll('.form-row');
    if (rows.length > 0) {  // Permite remover todas as linhas
        form.removeChild(rows[rows.length - 1]);
    }
}

async function handleProductionSubmit() {
    const rows = document.querySelectorAll('#cows-form .form-row');
    if (rows.length === 0) {
        alert('Adicione pelo menos uma vaca para registrar produção');
        return;
    }

    const productions = [];
    let isValid = true;

    rows.forEach(row => {
        const cowId = row.querySelector('.cow-id-input').value.trim();
        const liters = row.querySelector('.cow-liters-input').value.trim();
        
        if (!cowId || !liters) {
            isValid = false;
            return;
        }

        productions.push({
            idAnimal: cowId,
            quantidade: parseFloat(liters)
        });
    });

    if (!isValid) {
        alert('Preencha todos os campos corretamente');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/producao/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productions)
        });

        if (response.ok) {
            alert('Produção registrada com sucesso!');
            // Limpa o formulário
            document.getElementById('cows-form').innerHTML = '';
            // Adiciona uma nova linha vazia
            addCowRow();
        } else {
            const error = await response.json();
            alert(`Erro ao registrar produção: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}