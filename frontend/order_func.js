const idTitle = document.getElementById("title_id");
const breedTitle = document.getElementById("title_breed");
const categoryTitle = document.getElementById("title_category");
const productionTitle = document.getElementById("title_production");

const filterCowBreed = document.getElementById("filter-cow-breed");
const filterCowCategory = document.getElementById("filter-cow-category");
const filterCowLot = document.getElementById("filter-cow-lot");

filterCowBreed.addEventListener("change", loadCowsList);
filterCowCategory.addEventListener("change", loadCowsList);
filterCowLot.addEventListener("change", loadCowsList);

async function addLotOptions() {
    console.log("Entrou na função")
    const lotSelect = document.getElementById("filter-cow-lot");
    let lots = await fetchLotes();
    
    // Limpa as opções antigas (mantém apenas a opção "Nenhuma")
    lotSelect.innerHTML = '<option value="NENHUMA" selected>Nenhuma</option>';

    // Adiciona os lotes passados na lista
    lots.forEach(lot => {
        const option = document.createElement("option");
        option.value = lot.rotulo;
        option.textContent = lot.rotulo;
        lotSelect.appendChild(option);
    });
}

async function fetchLotes(){
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/lotes", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar vacas: " + response.status);
    }

    return await response.json();
}


idTitle.addEventListener("click", async () => {
    const cowList = await fetchCows();
    renderCowsList(cowList, "cows-list", "id");
});

breedTitle.addEventListener("click", async () => {
    const cowList = await fetchCows();
    renderCowsList(cowList, "cows-list", "raca");
});

categoryTitle.addEventListener("click", async () => {
    const cowList = await fetchCows();
    renderCowsList(cowList, "cows-list", "categoria");
});

productionTitle.addEventListener("click", async () => {
    const cowList = await fetchCows();
    renderCowsList(cowList, "cows-list", "producao");
});



async function fetchCows() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/vacas", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar vacas: " + response.status);
    }

    return await response.json();
}


// Função genérica: renderiza uma lista de vacas em um container
async function renderCowsList(vacas, containerId, sortBy = "id") {
    const cowsList = document.getElementById(containerId);
    if (!cowsList) return;
    cowsList.innerHTML = ""; // limpa antes de renderizar

    const racaSelecionada = filterCowBreed.value;
    const categoriaSelecionada = filterCowCategory.value;
    const loteSelecionado = filterCowLot.value;

    // Filtra vacas primeiro
    const vacasFiltradas = vacas.filter(vaca => {
        if (racaSelecionada != "NENHUMA" && vaca.raca !== racaSelecionada) return false;
        if (categoriaSelecionada != "NENHUMA" && vaca.categoria !== categoriaSelecionada) return false;
        return true;
    });

    // Busca lote e produção em paralelo
    const vacasComDados = await Promise.all(vacasFiltradas.map(async vaca => {
        const [lote, producao] = await Promise.all([
            findCowLot(vaca.id.idVaca),
            fetchProductionById(vaca.id.idVaca)
        ]);

        if (loteSelecionado != "NENHUMA" && lote !== loteSelecionado) return null;

        return {
            vaca,
            lote,
            producaoVaca: producao ? producao.ultimaCtgLeite : 0.0
        };
    }));

    // Remove itens nulos
    const vacasValidas = vacasComDados.filter(item => item !== null);

    // Ordena de acordo com o sortBy
    vacasValidas.sort((a, b) => {
        if (sortBy === "id") return a.vaca.id.idVaca - b.vaca.id.idVaca;
        if (sortBy === "raca") return a.vaca.raca.localeCompare(b.vaca.raca);
        if (sortBy === "categoria") return a.vaca.categoria.localeCompare(b.vaca.categoria);
        if (sortBy === "producao") return b.producaoVaca - a.producaoVaca; // maior produção primeiro
        return 0;
    });

    // Renderiza
    vacasValidas.forEach(item => {
        const { vaca, producaoVaca } = item;
        const row = document.createElement("div");
        
        row.className = "list-row";
        row.setAttribute("data-cow-id", vaca.id.idVaca);
        
        row.innerHTML = `
            <div class="list-item">
                <span>#${vaca.id.idVaca}</span>
                <button class="view-btn" onclick="showCowProfile(${vaca.id.idVaca})" title="Ver perfil">
                    <img src="content/images/icon/eye.png" alt="Ver perfil" class="action-icon">
                </button>
            </div>
            <div class="list-item">${vaca.raca}</div>
            <div class="list-item">${vaca.categoria}</div>
            <div class="list-item">${producaoVaca}L</div>
            <div class="list-item">
                <button class="attendance-btn" onclick="showCowAppointments(${vaca.id.idVaca})" title="Ver atendimentos">
                    Atendimentos
                </button>
            </div>
        `;
        cowsList.appendChild(row);
    });
}

// Função que carrega todas as vacas
async function loadCowsList() {
    try {
        const vacas = await fetchCows();
        renderCowsList(vacas, "cows-list");
    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar as vacas.");
    }
}

// Função que carrega apenas vacas que precisam de atendimento
async function loadCowsAppointmentList() {
    try {
        const vacas = await fetchCows();
        vacas.filter(vaca => vaca.precisaAtendimento);

        renderCowsList(vacas, "cows-list");
    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar as vacas.");
    }
}

// Função auxiliar para formatar datas
function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
}
