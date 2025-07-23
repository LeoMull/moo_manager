document.addEventListener('DOMContentLoaded', function() {
    const cowsForm = document.getElementById('cows-form');
    const addBtn = document.getElementById('add-cow-btn');
    const removeBtn = document.getElementById('remove-cow-btn');
    const submitBtn = document.getElementById('submit-production-btn');
    const backBtn = document.getElementById('back-production-btn');

    // Inicializa o formulário com uma linha vazia
    if (cowsForm && cowsForm.children.length === 0) {
        addCowRow();
    }

    // Event Listeners
    if (addBtn) addBtn.addEventListener('click', addCowRow);
    if (removeBtn) removeBtn.addEventListener('click', removeCowRow);
    if (submitBtn) submitBtn.addEventListener('click', handleProductionSubmit);
    if (backBtn) backBtn.addEventListener('click', () => {
        document.getElementById('production-content').style.display = 'none';
        document.getElementById('cows-content').style.display = 'block';
    });

    // Função para adicionar nova linha de vaca
    function addCowRow() {
        const form = document.getElementById('cows-form');
        const rows = form.querySelectorAll('.form-row');
        
        if (rows.length >= 10) {
            alert('Você pode adicionar no máximo 10 vacas por vez');
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
                <input type="date" class="cow-date-input" value="${getCurrentDate()}">
            </div>
        `;
        form.appendChild(newRow);
    }

    // Função para remover a última linha
    function removeCowRow() {
        const form = document.getElementById('cows-form');
        const rows = form.querySelectorAll('.form-row');
        
        if (rows.length > 1) {
            form.removeChild(rows[rows.length - 1]);
        } else {
            alert('Você deve manter pelo menos 1 vaca no formulário');
        }
    }

    // Função para lidar com o envio do formulário
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
            const date = row.querySelector('.cow-date-input').value;
            
            if (!cowId || !liters) {
                isValid = false;
                row.style.border = '1px solid red';
                return;
            }

            productions.push({
                idVaca: cowId,
                quantidade: parseFloat(liters),
                data: date
            });
        });

        if (!isValid) {
            alert('Preencha todos os campos corretamente');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const results = [];
            
            for (const prod of productions) {
                const response = await fetch(`${API_URL}/api/producao/${prod.idVaca}/contagem-leite`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        quantidade: prod.quantidade,
                        dataUltimaCtgLeite: prod.data
                    })
                });

                if (response.ok) {
                    results.push({
                        idVaca: prod.idVaca,
                        success: true
                    });
                } else {
                    const error = await response.json();
                    results.push({
                        idVaca: prod.idVaca,
                        success: false,
                        error: error.message || 'Erro desconhecido'
                    });
                }
            }

            // Mostrar resultados
            showResults(results);
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor');
        }
    }

    // Função auxiliar para mostrar resultados
    function showResults(results) {
        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;
        
        if (errorCount === 0) {
            alert(`Produção registrada com sucesso para ${successCount} vaca(s)!`);
            document.getElementById('cows-form').innerHTML = '';
            addCowRow();
        } else {
            let message = `Sucesso: ${successCount} vaca(s)\nErros: ${errorCount} vaca(s)\n\n`;
            results.filter(r => !r.success).forEach(r => {
                message += `Vaca ${r.idVaca}: ${r.error}\n`;
            });
            
            if (confirm(`${message}\nDeseja tentar novamente para as vacas com erro?`)) {
                // Marcar as linhas com erro
                const rows = document.querySelectorAll('#cows-form .form-row');
                rows.forEach((row, index) => {
                    if (!results[index].success) {
                        row.style.border = '1px solid red';
                    }
                });
            } else {
                document.getElementById('cows-form').innerHTML = '';
                addCowRow();
            }
        }
    }

    // Função auxiliar para obter a data atual no formato YYYY-MM-DD
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});