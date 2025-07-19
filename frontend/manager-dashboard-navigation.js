// manager-dashboard-navigation.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos de conteúdo
    const homeContent = document.getElementById('home-content');
    const cowsContent = document.getElementById('cows-content');
    const profileContent = document.getElementById('profile-content');
    const addCowContent = document.getElementById('add-cow-content');
    const employeesContent = document.getElementById('employees-content');
    const lotsContent = document.getElementById('lots-content');
    
    // Botões do menu
    const homeBtn = document.getElementById('home-btn');
    const listCowsBtn = document.getElementById('list-cows-btn');
    const addCowBtn = document.getElementById('add-cow-btn');
    const employeesBtn = document.getElementById('employees-btn');
    const lotsBtn = document.getElementById('lots-btn');
    
    // Event Listeners
    if (homeBtn) homeBtn.addEventListener('click', showHome);
    if (listCowsBtn) listCowsBtn.addEventListener('click', showCowsList);
    if (addCowBtn) addCowBtn.addEventListener('click', showAddCowForm);
    if (employeesBtn) employeesBtn.addEventListener('click', showEmployees);
    if (lotsBtn) lotsBtn.addEventListener('click', showLots);
    
    // Sistema de abas (reutilizado do perfil da vaca)
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
    showHome();
});

// Funções de navegação
function showHome() {
    hideAllContents();
    document.getElementById('home-content').style.display = 'block';
}

function showCowsList() {
    hideAllContents();
    document.getElementById('cows-content').style.display = 'block';
    loadCowsData(); // Função que carrega os dados das vacas
}

function showCowProfile(cowId) {
    hideAllContents();
    document.getElementById('profile-content').style.display = 'block';
    loadCowProfile(cowId); // Função que carrega o perfil da vaca
}

function showAddCowForm() {
    hideAllContents();
    document.getElementById('add-cow-content').style.display = 'block';
}

function showEmployees() {
    hideAllContents();
    document.getElementById('employees-content').style.display = 'block';
    loadEmployeesData(); // Função que carrega os dados dos funcionários
}

function showLots() {
    hideAllContents();
    document.getElementById('lots-content').style.display = 'block';
    loadLotsData(); // Função que carrega os dados dos lotes
}

function hideAllContents() {
    const contents = [
        'home-content',
        'cows-content',
        'profile-content',
        'add-cow-content',
        'employees-content',
        'lots-content'
    ];
    
    contents.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
}

// Função para voltar para a lista de vacas (usada no botão voltar do perfil)
window.backToList = function() {
    showCowsList();
};