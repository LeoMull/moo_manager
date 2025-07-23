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
        e.preventDefault(); // Adicionado para prevenir comportamentos padrão
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
    
    // Confirmar produção
    document.getElementById('confirm-production-btn')?.addEventListener('click', function() {
        const liters = productionInput.value.trim();
        alert(`Produção de ${liters} litros registrada!`);
        productionInput.value = '';
        modal.classList.remove('active');

        const cnir = localStorage.getItem('userCnir');
        
        console.log('CNIR:', cnir);

        addDailyProduction({
            cnir: cnir,
            data: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
            litros: parseFloat(liters)
        });


    });

});

async function addDailyProduction(params) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/producao/${params.cnir}/${params.data}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ litros: params.litros })
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar produção diária');
        }

        const data = await response.json();
        console.log('Produção diária adicionada:', data);
    } catch (error) {
        console.error('Erro:', error);
    }
}