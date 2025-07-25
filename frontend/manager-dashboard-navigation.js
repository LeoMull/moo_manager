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
    const addEmployeeForm = document.getElementById('add-employee-form');

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
    if (addEmployeeForm) addEmployeeForm.addEventListener('submit', addEmployee);
    
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

    const token = localStorage.getItem('token');
    const cnir = localStorage.getItem('userCnir');

    const vaca = {
        id: {
          idVaca: parseInt(document.getElementById("cow-id").value),
          cnir: cnir
        },
        sexo: document.getElementById("cow-sex").value,
        raca: document.getElementById("cow-breed-ipt").value,
        dataNasc: document.getElementById("cow-birthdate").value,
        categoria: document.getElementById("cow-category").value,
        lote: document.getElementById("cow-lot").value || null,
        precisaAtendimento: document.getElementById("cow-needs-care").checked,
        observacao: document.getElementById("cow-obs").value || null,
        peso: parseFloat(document.getElementById("cow-weight").value) || null,
        dataUltimaPesagem: document.getElementById("cow-last-weight-date").value || null,
        idMae: document.getElementById("cow-mother-id").value ? parseInt(document.getElementById("cow-mother-id").value) : null,
        nomeMae: document.getElementById("cow-mother-name").value || null,
        idPai: document.getElementById("cow-father-id").value ? parseInt(document.getElementById("cow-father-id").value) : null,
        nomePai: document.getElementById("cow-father-name").value || null
    };

    console.log(JSON.stringify(vaca));

    try {
        console.log(cnir);
        const response = await fetch("http://localhost:8080/api/vacas", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(vaca)
            });

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

async function addEmployee(event) {
    event.preventDefault();

    const employeeName = document.getElementById('employee-name').value;
    const employeeCpf = document.getElementById('employee-cpf').value;
    const employeeEmail = document.getElementById('employee-email').value;
    const employeePassword = document.getElementById('employee-password').value;
    const employeeRole = document.getElementById('employee-role').value;
    const cnir = localStorage.getItem('userCnir');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                usuarioId: {
                    email: employeeEmail,
                    cnir: cnir
                },
                propriedade: {
                    cnir: cnir,
                    nomePropriedade: null
                },
                nome: employeeName,
                cpf: employeeCpf,
                senha: employeePassword,
                nivelDeAcesso: employeeRole,
            })
        });

        if (response.ok) {
            document.getElementById('add-employee-message').textContent = "Colaborador cadastrado com sucesso!";
            document.getElementById('add-employee-form').reset();
            showEmployees();
        } else {
            const error = await response.text();
            document.getElementById('add-employee-message').textContent = `Erro ao adicionar o funcionário: ${error}`;
        }
    } catch (error) {
        document.getElementById('add-employee-message').textContent = "Erro de conexão com o servidor.";
    }
}

async function loadEmployeesData() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/api/usuarios/listar`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const funcionarios = await response.json();
            const list = document.getElementById('employee-list');
            list.innerHTML = '';
            
            funcionarios.forEach(f => {
                const item = document.createElement('div');
                item.className = 'employee-item';
                
                item.innerHTML = `
                    <div class="employee-info">
                        <div class="employee-field">
                            <strong>Nome</strong>
                            <span>${f.nome}</span>
                        </div>
                        <div class="employee-field">
                            <strong>CPF</strong>
                            <span>${f.cpf}</span>
                        </div>
                        <div class="employee-field">
                            <strong>E-mail</strong>
                            <span>${f.usuarioId.email}</span>
                        </div>
                        <div class="employee-field">
                            <strong>Função</strong>
                            <span>${f.nivelDeAcesso === 'FUNCIONARIO' ? 'Funcionário' : 
                                    f.nivelDeAcesso === 'VETERINARIO' ? 'Veterinário' : 'Proprietário'}</span>
                        </div>
                    </div>
                    <div class="employee-actions">
                        <button class="action-btn" onclick="editEmployee('${f.cpf}')">
                            <img src="content/images/icon/edit.png" alt="Editar" class="action-icon">
                        </button>
                        <button class="action-btn" onclick="deleteEmployee('${f.email}')">
                            <img src="content/images/icon/delete.png" alt="Excluir" class="action-icon">
                        </button>
                    </div>
                `;
                
                list.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar dados dos funcionários:", error);
    }
}

function editEmployee(cpf) {
    console.log("Editar funcionário com CPF:", cpf);
}

async function deleteEmployee(email) {
    const cnir = localStorage.getItem('userCnir');
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/api/usuarios/${cnir}/${email}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            document.getElementById('add-employee-message').textContent = "Funcionário deletado com sucesso!";
            document.getElementById('add-employee-form').reset();
            showEmployees();
        } else {
            const error = await response.text();
            document.getElementById('add-employee-message').textContent = `Erro ao deletar o funcionário: ${error}`;
        }
    } catch (error) {
        document.getElementById('add-employee-message').textContent = "Erro de conexão com o servidor.";
        console.log(error)
    }
}

// Função para voltar para a lista de vacas (usada no botão voltar do perfil)
window.backToList = function() {
    showCowsList();
};