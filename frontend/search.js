// Função para buscar vaca pelo ID
async function searchCowById(cowId) {
    if (!cowId) return;
    
    try {
        const cow = await fetchCowById(cowId);
        if (cow) {
            showCowProfile(cowId);
        } else {
            alert('Vaca não encontrada');
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        alert('Erro ao buscar vaca');
    }
}

// Função para filtrar vacas em tempo real
async function filterCows(searchTerm) {
    const dropdown = document.getElementById('cow-search-dropdown');
    if (!dropdown) return;
    
    if (!searchTerm || searchTerm.length < 2) {
        dropdown.style.display = 'none';
        return;
    }
    
    try {
        const cows = await fetchAllCows();
        const filteredCows = cows.filter(cow => 
            cow.id.idAnimal.toString().includes(searchTerm) || 
            (cow.nome && cow.nome.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        if (filteredCows.length > 0) {
            dropdown.innerHTML = filteredCows.map(cow => `
                <div class="dropdown-item" onclick="selectCowFromDropdown('${cow.id.idAnimal}')">
                    #${cow.id.idAnimal} - ${cow.nome || 'Sem nome'}
                </div>
            `).join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.innerHTML = '<div class="dropdown-item no-results">Nenhuma vaca encontrada</div>';
            dropdown.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao filtrar vacas:', error);
        dropdown.style.display = 'none';
    }
}

// Função para selecionar vaca do dropdown
function selectCowFromDropdown(cowId) {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = cowId;
    }
    const dropdown = document.getElementById('cow-search-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
    searchCowById(cowId);
}

// Função debounce para melhorar performance
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Inicialização da busca
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.sidebar-box:first-child .search-input-wrapper');
    if (searchBox) {
        searchBox.innerHTML += '<div id="cow-search-dropdown" class="dropdown"></div>';
        
        const searchInput = searchBox.querySelector('.search-input');
        const searchIcon = searchBox.querySelector('.search-icon');
        
        // Evento de clique no ícone de busca
        searchIcon.addEventListener('click', function() {
            searchCowById(searchInput.value);
        });
        
        // Evento de pressionar Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchCowById(searchInput.value);
            }
        });
        
        // Evento de digitação para filtro em tempo real com debounce
        searchInput.addEventListener('input', debounce(function() {
            filterCows(searchInput.value);
        }, 300));
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            const dropdown = document.getElementById('cow-search-dropdown');
            if (dropdown && !searchBox.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
});