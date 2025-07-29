document.addEventListener('DOMContentLoaded', function() {
    // Seleção dos elementos
    const productionInput = document.getElementById('daily-production-input');
    const plusIcon = document.getElementById('daily-production-plus');
    const modal = document.getElementById('production-modal');
    
    // Verificação dos elementos
    if (!productionInput || !plusIcon || !modal) {
        console.error('Elementos não encontrados!');
        return;
    }
    
    // Função para abrir o modal (reutilizável)
    function handleOpenModal() {
        const liters = productionInput.value.trim();
        
        if (!liters || isNaN(liters) || parseFloat(liters) <= 0) {
            alert('Digite uma quantidade válida (ex: 10.5)');
            productionInput.focus();
            return;
        }
        
        document.getElementById('modal-liters').textContent = liters;
        document.getElementById('modal-date').textContent = new Date().toLocaleDateString('pt-BR');
        modal.classList.add('active');
    }
    
    // Evento de clique no ícone +
    plusIcon.addEventListener('click', function(e) {
        e.preventDefault();
        handleOpenModal();
    });
    
    // Evento de tecla Enter no input
    productionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleOpenModal();
        }
    });
    
    // Fechar modal
    document.getElementById('cancel-production-btn')?.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Confirmar produção - CORREÇÃO PRINCIPAL AQUI
    document.getElementById('confirm-production-btn')?.addEventListener('click', async function() {
        const liters = productionInput.value.trim();
        const cnir = localStorage.getItem('userCnir');
        const today = new Date().toISOString().split('T')[0];
        
        if (!cnir) {
            alert('CNIR não encontrado no localStorage!');
            return;
        }
        
        try {
            // Chama a função de adicionar produção
            const success = await addDailyProduction({
                cnir: cnir,
                data: today,
                litros: parseFloat(liters)
            });
            
            if (success) {
                alert(`Produção de ${liters} litros registrada com sucesso!`);
                productionInput.value = '';
                modal.classList.remove('active');
                
                // Atualiza a UI se necessário
                if (typeof updateProductionDisplay === 'function') {
                    updateProductionDisplay();
                }
            }
        } catch (error) {
            console.error('Erro ao registrar produção:', error);
            alert('Erro ao registrar produção. Verifique o console para detalhes.');
        }
    });
});

// Função melhorada para adicionar produção
async function addDailyProduction(params) {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token não encontrado');
        }
        
        const response = await fetch(`http://localhost:8080/api/producao`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                producaoId: {
                    cnir: params.cnir,
                    data: params.data
                },
                propriedade: {
                    cnir: params.cnir
                },
                volume: params.litros
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao adicionar produção');
        }

        return true;
    } catch (error) {
        console.error('Erro na função addDailyProduction:', error);
        throw error; // Re-lança o erro para ser tratado no chamador
    }
}
