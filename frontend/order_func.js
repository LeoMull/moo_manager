const idTitle = document.getElementById("title_id");
const breedTitle = document.getElementById("title_breed");
const categoryTitle = document.getElementById("title_category");

const filterCowBreed = document.getElementById("filter-cow-breed");
const filterCowCategory = document.getElementById("filter-cow-category");
const filterCowLot = document.getElementById("filter-cow-lot");

filterCowBreed.addEventListener("change", loadCowsList);
filterCowCategory.addEventListener("change", loadCowsList);
filterCowLot.addEventListener("change", loadCowsList);

async function addLotOptions() {
    const lotSelect = document.getElementById("filter-cow-lot");
    let lots = await fetchLotes();
    console.log(fetchLotes());

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
    let cowList = await fetchCows();
    cowList.sort((a, b) => a.id.idVaca - b.id.idVaca);
    renderCowsList(cowList, "cows-list");
});
breedTitle.addEventListener("click", async () => {
    let cowList = await fetchCows();
    cowList.sort((a, b) => a.raca.localeCompare(b.raca));
    renderCowsList(cowList, "cows-list");
});
categoryTitle.addEventListener("click", async () => {
    let cowList = await fetchCows();
    cowList.sort((a, b) => a.categoria.localeCompare(b.categoria));
    renderCowsList(cowList, "cows-list");
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
function renderCowsList(vacas, containerId) {
    const cowsList = document.getElementById(containerId);
    if (!cowsList) return;
    cowsList.innerHTML = ""; // limpa antes de renderizar

    const racaSelecionada = filterCowBreed.value;
    const categoriaSelecionada = filterCowCategory.value;
    const loteSelecionado = filterCowLot.value;

    vacas
         // aplica filtro se existir
        .forEach(async vaca => {
            if (racaSelecionada != "NENHUMA" && vaca.raca !== racaSelecionada) return;
            if (categoriaSelecionada != "NENHUMA" && vaca.categoria !== categoriaSelecionada) return;

            let lote = await findCowLot(vaca.id.idVaca);
            console.log(loteSelecionado, lote);
            if (loteSelecionado != "NENHUMA" && lote !== loteSelecionado) return;

            const row = document.createElement("div");
            let producaoVaca;
            let producao = await fetchProductionById(vaca.id.idVaca);
            if(producao){
                console.log(producao);
                producaoVaca = producao.ultimaCtgLeite;
            }else{
                producaoVaca = 0.0;
            }
            row.innerHTML = `
                <div class="list-row" data-cow-id="${vaca.id.idVaca}">
                    <div class="list-item">#${vaca.id.idVaca}</div>
                    <div class="list-item">${vaca.raca}</div>
                    <div class="list-item">${vaca.categoria}</div>
                    <div class="list-item">${producaoVaca}</div>
                    <div class="list-item">
                        <img src="content/images/icon/eye.png" alt="Visualizar" 
                            class="action-icon view-cow" 
                            onclick="showCowProfile(${vaca.id.idVaca})">
                    </div>
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