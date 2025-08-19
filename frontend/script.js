const API_URL = 'http://localhost:8080';

// Elementos do DOM - Autenticação
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const appContainer = document.getElementById('app-container');
const logoutBtn = document.getElementById('logout-btn');
const userNameSpan = document.getElementById('user-name');
const propertiesList = document.getElementById('properties-list');
const container = document.querySelector('.container');
const forgotPassword = document.getElementById('forgot-password');

// Elementos do DOM - Dashboard
const mainContent = document.getElementById('main-content');
const cowsContent = document.getElementById('cows-content');
const profileContent = document.getElementById('profile-content');
const homeBtn = document.getElementById('home-btn');
const listCowsBtn = document.getElementById('list-cows-btn');
const backProfileBtn = document.getElementById('back-profile-btn');

// Campos de formulário
const loginEmail = document.getElementById('cpf');
const loginPassword = document.getElementById('password');
const regEmail = document.getElementById('reg-email');
const regName = document.getElementById('reg-username');
const regCpf = document.getElementById('reg-cpf');
const regPropertyName = document.getElementById('reg-property-name');
const regCnir = document.getElementById('reg-cnir');
const regPassword = document.getElementById('reg-password');
const regConfirmPassword = document.getElementById('reg-confirm-password');

let currentUser = null;

// Event Listeners - Autenticação
if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (registerForm) registerForm.addEventListener('submit', handleRegister);
if (showRegister) showRegister.addEventListener('click', prepareRegistration);
if (showLogin) showLogin.addEventListener('click', () => toggleAuthForms('login', true));
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (forgotPassword) forgotPassword.addEventListener('click', handleForgotPassword);

// Event Listeners - Dashboard
if (homeBtn) homeBtn.addEventListener('click', showMainContent);
if (listCowsBtn) listCowsBtn.addEventListener('click', showCowsList);
if (backProfileBtn) backProfileBtn.addEventListener('click', showCowsList);

// Funções de Autenticação
function prepareRegistration() {
    if (loginEmail.value) {
        regEmail.value = loginEmail.value;
    }
    toggleAuthForms('register', true);
}

function toggleAuthForms(show, animate = false) {
    if (animate) {
        container.classList.toggle('register-mode', show === 'register');
        
        setTimeout(() => {
            loginContainer.style.display = show === 'login' ? 'block' : 'none';
            registerContainer.style.display = show === 'register' ? 'block' : 'none';
            
            if (show === 'login') {
                loginContainer.classList.add('fade-in');
                registerContainer.classList.remove('fade-in');
            } else {
                registerContainer.classList.add('fade-in');
                loginContainer.classList.remove('fade-in');
            }
        }, 200);
    } else {
        loginContainer.style.display = show === 'login' ? 'block' : 'none';
        registerContainer.style.display = show === 'register' ? 'block' : 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = loginEmail.value;
    const senha = loginPassword.value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.email;
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userRole', data.nivelDeAcesso);
                localStorage.setItem('userCnir', data.cnir);
            }
            
            if (data.nivelDeAcesso == 'GERENTE') {
                window.location.href = 'gerente.html';
                return;
            }

            if (data.nivelDeAcesso == 'FUNCIONARIO') {
                window.location.href = 'funcionario.html';
                return;
            }

            if (data.nivelDeAcesso == 'VETERINARIO') {
                window.location.href = 'veterinario.html';
                return;
            }
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao conectar com o servidor');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    console.log("Iniciando processo de cadastro...");

    if (regPassword.value !== regConfirmPassword.value) {
        alert('As senhas não coincidem!');
        return;
    }

    const userData = {
        email: regEmail.value,
        cpf: regCpf.value.replace(/\D/g, ''),
        senha: regPassword.value,
        nome: regName.value,
        nivelDeAcesso: "GERENTE",
        propriedade: {
            cnir: regCnir.value,
            nome: regPropertyName.value
        }
    };

    try {
        console.log("Criando propriedade...");
        // 1. Criar propriedade
        const propResponse = await fetch(`${API_URL}/api/propriedades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cnir: userData.propriedade.cnir,
                nome: userData.propriedade.nome
            })
        });

        if (!propResponse.ok) {
            const error = await propResponse.text();
            throw new Error(`Erro ao criar propriedade: ${error}`);
        }

        console.log("Registrando usuário como GERENTE...");
        const registerResponse = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuarioId: {
                    email: userData.email
                },
                propriedade: {
                    cnir: userData.propriedade.cnir,
                    nome: userData.propriedade.nome
                },
                cpf: userData.cpf,
                senha: userData.senha,
                nome: userData.nome,
                nivelDeAcesso: userData.nivelDeAcesso
            })
        });

        if (!registerResponse.ok) {
            const error = await registerResponse.text();
            throw new Error(`Erro no registro: ${error}`);
        }

        console.log("Realizando login automático...");
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userData.email,
                senha: userData.senha
            })
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            currentUser = loginData.email;

            localStorage.setItem('token', loginData.token);
            localStorage.setItem('userEmail', loginData.email);
            localStorage.setItem('userRole', 'GERENTE');
            if (loginData.propriedade && loginData.propriedade.cnir) {
                localStorage.setItem('userCnir', loginData.propriedade.cnir);
            }

            if (loginData.nivelDeAcesso == 'GERENTE') {
                window.location.href = 'gerente.html';
                return;
            }

            if (loginData.nivelDeAcesso == 'FUNCIONARIO') {
                window.location.href = 'funcionario.html';
                return;
            }
            
            alert("Cadastro realizado com sucesso!");
            showAppInterface();
        } else {
            alert("Cadastro concluído. Faça login manualmente.");
            toggleAuthForms('login', true);
        }
    } catch (error) {
        console.error('Erro completo no cadastro:', error);
        alert(`Erro: ${error.message}`);
    }
}

async function handleLogout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
    toggleAuthForms('login', true);
    loginForm.reset();
    appContainer.style.display = 'none';
}

function handleForgotPassword() {
    const email = prompt("Digite seu email para recuperar a senha:");
    if (email) {
        alert(`Um link de recuperação foi enviado para ${email} (simulação)`);
    }
}

function showAppInterface() {
    container.classList.add('app-mode');
    
    setTimeout(() => {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'none';
        appContainer.style.display = 'block';
        appContainer.classList.add('fade-in');
        
        const storedEmail = localStorage.getItem('userEmail');
        const storedRole = localStorage.getItem('userRole');
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = storedEmail.split('@')[0];
        }
        
        if (document.getElementById('main-content')) {
            setupDashboard();
        } else {
            showCowsList();
        }
    }, 500);
}

// Funções do Dashboard
function setupDashboard() {
    console.log("Configurando dashboard...");
    
    if (listCowsBtn) {
        listCowsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showCowsList();
        });
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showMainContent();
        });
    }
    
    showMainContent();
}

function showMainContent() {
    const mainContent = document.getElementById('main-content');
    const cowsContent = document.getElementById('cows-content');
    const profileContent = document.getElementById('profile-content');
    
    if (mainContent) mainContent.style.display = 'block';
    if (cowsContent) cowsContent.style.display = 'none';
    if (profileContent) profileContent.style.display = 'none';
}

function showCowsList() {
    const mainContent = document.getElementById('main-content');
    const cowsContent = document.getElementById('cows-content');
    const profileContent = document.getElementById('profile-content');
    
    if (mainContent) mainContent.style.display = 'none';
    if (cowsContent) cowsContent.style.display = 'block';
    if (profileContent) profileContent.style.display = 'none';
    
    loadCowsData();
}

async function loadCowsData() {
    const cowsList = document.getElementById('cows-list');
    if (!cowsList) return;
    
    cowsList.innerHTML = '<p>Carregando vacas...</p>';
    
    try {
        const vacas = await fetchAllCows();
        
        if (vacas.length === 0) {
            cowsList.innerHTML = '<p>Nenhuma vaca cadastrada</p>';
            return;
        }
        
        cowsList.innerHTML = vacas.map(vaca => `
            <div class="list-row" data-cow-id="${vaca.id.idVaca}">
                <div class="list-item">#${vaca.id.idVaca}</div>
                <div class="list-item">${vaca.raca}</div>
                <div class="list-item">${vaca.categoria}</div>
                <div class="list-item">${formatDate(vaca.dataNasc)}</div>
                <div class="list-item">
                    <img src="content/images/icon/eye.png" alt="Visualizar" 
                         class="action-icon view-cow" 
                         onclick="showCowProfile(${vaca.id.idVaca})">
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        cowsList.innerHTML = '<p>Erro ao carregar vacas</p>';
        console.error(error);
    }
}

// Funções de API para Vacas
async function fetchAllCows() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/vacas`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao buscar vacas');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function fetchCowById(cowId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/vacas/${cowId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao buscar vaca');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Funções para os botões de produção
function addCowRow() {
    const newRow = document.createElement('div');
    newRow.className = 'form-row';
    newRow.innerHTML = `
        <div class="form-group">
            <input type="text" placeholder="Digite o ID">
        </div>
        <div class="form-group cow-liters">
            <input type="number" placeholder="Quantidade">
        </div>
    `;
    document.getElementById('cows-form').appendChild(newRow);
}

function removeCowRow() {
    const form = document.getElementById('cows-form');
    const rows = form.querySelectorAll('.form-row');
    if (rows.length > 1) {
        form.removeChild(rows[rows.length - 1]);
    }
}

// Funções de propriedades
async function loadProperties() {
    try {
        const token = localStorage.getItem('token');
        console.log("Carregando propriedades...");
        
        const response = await fetch(`${API_URL}/propriedades`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const properties = await response.json();
            console.log("Propriedades carregadas:", properties);
            renderProperties(properties);
        } else if (response.status === 401) {
            handleLogout();
            alert('Sessão expirada. Faça login novamente.');
        } else {
            const error = await response.text();
            console.error("Erro na resposta:", error);
        }
    } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
    }
}

function renderProperties(properties) {
    if (!properties || properties.length === 0) {
        propertiesList.innerHTML = '<p class="no-properties">Nenhuma propriedade cadastrada</p>';
        return;
    }

    propertiesList.innerHTML = properties.map(prop => `
        <div class="property-card fade-in">
            <h4>${prop.nome || 'Sem nome'}</h4>
            <p><strong>CNIR:</strong> ${prop.cnir || 'Não informado'}</p>
            <button class="btn btn-secondary" onclick="viewPropertyDetails('${prop.cnir}')">
                Ver Detalhes
            </button>
        </div>
    `).join('');
}

function viewPropertyDetails(cnir) {
    alert(`Detalhes da propriedade CNIR: ${cnir}\n\nEsta funcionalidade pode ser expandida para mostrar mais informações.`);
}

// Função de debug
window.debugRegister = async () => {
    console.log("Preenchendo formulário automaticamente...");
    
    regEmail.value = "gerente" + Math.floor(Math.random() * 1000) + "@email.com";
    regCpf.value = "12345678901";
    regName.value = "Gerente Teste";
    regPropertyName.value = "Fazenda Modelo";
    regCnir.value = "CNIR" + Math.floor(Math.random() * 10000);
    regPassword.value = "senha123";
    regConfirmPassword.value = "senha123";
    
    await handleRegister({ preventDefault: () => {} });
};
