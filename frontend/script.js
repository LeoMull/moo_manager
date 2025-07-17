const API_URL = 'http://localhost:8080';

// Elementos do DOM
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

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
showRegister.addEventListener('click', prepareRegistration);
showLogin.addEventListener('click', () => toggleAuthForms('login', true));
logoutBtn.addEventListener('click', handleLogout);
forgotPassword.addEventListener('click', handleForgotPassword);

// Funções principais
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
            }
            
            showAppInterface();
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

    // Validação básica
    if (regPassword.value !== regConfirmPassword.value) {
        alert('As senhas não coincidem!');
        return;
    }

    const userData = {
        email: regEmail.value,
        cpf: regCpf.value.replace(/\D/g, ''),
        senha: regPassword.value,
        nome: regName.value,
        nivelDeAcesso: "GERENTE", // Definido diretamente como GERENTE
        propriedade: {
            cnir: regCnir.value
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
        // 2. Registrar usuário
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
        // 3. Login automático
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
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('userEmail', loginData.email);
            localStorage.setItem('userRole', 'GERENTE');
            
            currentUser = loginData.email;
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

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    loginForm.reset();
    toggleAuthForms('login', true);
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
        userNameSpan.textContent = `${storedEmail} (${storedRole})`;
        
        loadProperties();
    }, 500);
}

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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log("Página carregada, verificando autenticação...");
    
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userEmail) {
        console.log("Token encontrado, validando...");
        fetch(`${API_URL}/auth/validate`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("Token válido, mostrando interface...");
                currentUser = userEmail;
                showAppInterface();
            } else {
                console.log("Token inválido, fazendo logout...");
                handleLogout();
            }
        })
        .catch(error => {
            console.error("Erro na validação:", error);
            handleLogout();
        });
    }
});

// Função para debug (remova em produção)
window.debugRegister = async () => {
    console.log("Preenchendo formulário automaticamente...");
    
    // Preenche os campos com valores de teste
    regEmail.value = "gerente" + Math.floor(Math.random() * 1000) + "@email.com";
    regCpf.value = "12345678901";
    regName.value = "Gerente Teste";
    regPropertyName.value = "Fazenda Modelo";
    regCnir.value = "CNIR" + Math.floor(Math.random() * 10000);
    regPassword.value = "senha123";
    regConfirmPassword.value = "senha123";
    
    // Dispara o registro
    await handleRegister({ preventDefault: () => {} });
};