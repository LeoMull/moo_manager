// dashboard-navigation.js

document.addEventListener('DOMContentLoaded', function() {
    const cowsContent = document.getElementById('cows-content');
    const profileContent = document.getElementById('profile-content');
    const productionContent = document.getElementById('production-content');
    const listCowsBtn = document.getElementById('list-cows-btn');
    const registerProductionBtn = document.getElementById('register-production-btn');
    const backProfileBtn = document.getElementById('back-profile-btn');
    const backProductionBtn = document.getElementById('back-production-btn');
    
    // Event Listeners
    if (listCowsBtn) listCowsBtn.addEventListener('click', showCowsList);
    if (registerProductionBtn) registerProductionBtn.addEventListener('click', showProductionForm);
    if (backProfileBtn) backProfileBtn.addEventListener('click', showCowsList);
    if (backProductionBtn) backProductionBtn.addEventListener('click', showCowsList);
    
    // Sistema de abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Inicialização
    showCowsList();
});

// Funções de navegação
function showCowsList() {
    document.getElementById('cows-content').style.display = 'block';
    document.getElementById('profile-content').style.display = 'none';
    document.getElementById('production-content').style.display = 'none';
    
    // Carrega os dados das vacas
    loadCowsData();
    addLotOptions();
}

function showProductionForm() {
    document.getElementById('cows-content').style.display = 'none';
    document.getElementById('profile-content').style.display = 'none';
    document.getElementById('production-content').style.display = 'block';
}