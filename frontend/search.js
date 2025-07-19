const DROPDOWN_MAX_HEIGHT = '180px';
const DEBOUNCE_TIME = 300;

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

async function filterCows(searchTerm) {
    const dropdown = document.getElementById('cow-search-dropdown');
    if (!dropdown) return;
    
    if (!searchTerm || searchTerm.length < 2) {
        hideDropdown();
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
                    <strong>#${cow.id.idAnimal}</strong> - ${cow.nome || 'Sem nome'}
                </div>
            `).join('');
            showDropdown();
        } else {
            dropdown.innerHTML = '<div class="dropdown-item no-results">Nenhuma vaca encontrada</div>';
            showDropdown();
        }
    } catch (error) {
        console.error('Erro ao filtrar vacas:', error);
        hideDropdown();
    }
}

function positionDropdown() {
    const searchBox = document.querySelector('.sidebar-box');
    const dropdown = document.getElementById('cow-search-dropdown');
    
    if (searchBox && dropdown) {
        const rect = searchBox.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom - 5}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${rect.width}px`;
    }
}

function showDropdown() {
    positionDropdown();
    const dropdown = document.getElementById('cow-search-dropdown');
    if (dropdown) {
        dropdown.classList.add('visible');
    }
}

function hideDropdown() {
    const dropdown = document.getElementById('cow-search-dropdown');
    if (dropdown) {
        dropdown.classList.remove('visible');
        dropdown.innerHTML = '';
    }
}

window.addEventListener('resize', positionDropdown);

// Inicialização da busca
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.sidebar-box');
    const searchInput = searchBox?.querySelector('.search-input');
    const searchIcon = searchBox?.querySelector('.search-icon');
    
    const debouncedFilter = debounce(function() {
        filterCows(searchInput.value);
    }, DEBOUNCE_TIME);
    
    searchInput?.addEventListener('input', debouncedFilter);
    
    searchIcon?.addEventListener('click', () => {
        searchCowById(searchInput.value);
        hideDropdown();
    });
    
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCowById(searchInput.value);
            hideDropdown();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!searchBox?.contains(e.target)) {
            hideDropdown();
        }
    });
});

function selectCowFromDropdown(cowId) {
    const searchInput = document.querySelector('.sidebar-box .search-input');
    if (searchInput) {
        searchInput.value = cowId;
        searchInput.focus();
    }
    hideDropdown();
    searchCowById(cowId);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Inicialização da busca
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.sidebar-box');
    const searchInput = searchBox?.querySelector('.search-input');
    const searchIcon = searchBox?.querySelector('.search-icon');
    
    if (!searchBox || !searchInput || !searchIcon) return;
    
    searchIcon.addEventListener('click', function() {
        searchCowById(searchInput.value);
        hideDropdown();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCowById(searchInput.value);
            hideDropdown();
        }
    });
    
    searchInput.addEventListener('input', debounce(function() {
        filterCows(searchInput.value);
    }, DEBOUNCE_TIME));
    
    document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target)) {
            hideDropdown();
        }
    });
});
