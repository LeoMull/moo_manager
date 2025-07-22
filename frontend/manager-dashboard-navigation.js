// manager-dashboard-navigation.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos de conteúdo
    const homeContent = document.getElementById('home-content');
    const cowsContent = document.getElementById('cows-content');
    const profileContent = document.getElementById('profile-content');
    const addCowContent = document.getElementById('add-cow-content');
    const employeesContent = document.getElementById('employees-content');
    const lotsContent = document.getElementById('lots-content');
    const addCowForm = document.getElementById('add-cow-form');

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
    if (addCowForm) addCowForm.addEventListener('submit', addCow);
    
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
    // addCowRow();
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

async function addCow(event) {
    event.preventDefault();

    const cowId = document.getElementById('cow-id').value;
    const cowSex = document.getElementById('cow-sex').value;
    const cowBreed = document.getElementById('cow-breed').value;
    const cowBirthdate = document.getElementById('cow-birthdate').value;
    const cowCategory = document.getElementById('cow-category').value;
    const cowLot = document.getElementById('cow-lot').value;
    const cowNeedsCare = document.getElementById('cow-needs-care').checked;
    const cowObs = document.getElementById('cow-obs').value;
    const cowWeight = document.getElementById('cow-weight').value;
    const cowLastWeightDate = document.getElementById('cow-last-weight-date').value;
    const cowMotherId = document.getElementById('cow-mother-id').value;
    const cowMotherName = document.getElementById('cow-mother-name').value;
    const cowFatherId = document.getElementById('cow-father-id').value;
    const cowFatherName = document.getElementById('cow-father-name').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/api/vacas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: cowId,
                sexo: cowSex,
                raca: cowBreed,
                dataNasc: cowBirthdate,
                categoria: cowCategory,
                lote: cowLot,
                precisaAtendimento: cowNeedsCare,
                observacao: cowObs,
                peso: cowWeight,
                dataUltimoPesagem: cowLastWeightDate,
                idMae: cowMotherId,
                nomeMae: cowMotherName,
                idPai: cowFatherId,
                nomePai: cowFatherName
        })});

            if (response.ok) {
                document.getElementById('add-cow-message').textContent = "Vaca cadastrada com sucesso!";
                document.getElementById('add-cow-form').reset();
                showCowsList();
            } else {
                const error = await response.text();
                document.getElementById('add-cow-message').textContent = `Erro ao adicionar a vaca: ${error}`;
            }
    } catch (error) {
        document.getElementById('add-cow-message').textContent = "Erro de conexão com o servidor.";
    }
}

// Função para voltar para a lista de vacas (usada no botão voltar do perfil)
window.backToList = function() {
    showCowsList();
};