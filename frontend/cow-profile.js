async function loadCowProfile(cowId) {
    const cow = await fetchCowById(cowId);

    if (!cow) {
        alert('Vaca não encontrada');
        return;
    }
    
    document.getElementById('cow-name').textContent = cow.nome || `Vaca #${cowId}`;
    document.getElementById('cow-id-modal').textContent = `ID: #${cowId}`;
    
    document.getElementById('cow-lot').textContent = cow.lote || 'Não informado';
    document.getElementById('cow-needs-care').textContent = cow.precisaAtendimento ? 'Sim' : 'Não';
    document.getElementById('cow-weight').textContent = cow.peso ? `${cow.peso} kg` : 'Não pesada';
    document.getElementById('cow-last-weighing').textContent = cow.dataUltimaPesagem ? formatDate(cow.dataUltimaPesagem) : 'Nunca';
    document.getElementById('cow-breed').textContent = cow.raca || 'Não informada';
    document.getElementById('cow-birth').textContent = cow.dataNasc ? formatDate(cow.dataNasc) : 'Não informada';
    document.getElementById('cow-category').textContent = cow.categoria || 'Não categorizada';
    document.getElementById('cow-mother').textContent = cow.nomeMae ? `${cow.nomeMae} (#${cow.idMae})` : 'Não informada';
    document.getElementById('cow-father').textContent = cow.nomePai ? `${cow.nomePai} (#${cow.idPai})` : 'Não informado';
}

async function loadReproductionTab(cowId) {
    const cow = await fetchReproductionById(cowId);
    if (!cow.reproducao || !cow.ciclo) {
        console.warn('Dados de reprodução ou ciclo não encontrados');
        return;
    }
    // Dados gerais da reprodução
    document.getElementById('cow-repro-status').textContent = cow.reproducao.situacaoRepo || '';
    document.getElementById('cow-birth-type').textContent = cow.reproducao.tipoUltParto || '';
    document.getElementById('cow-days-last-birth').textContent = cow.reproducao.diasDesdeUltimoParto || '';
    document.getElementById('cow-birth-count').textContent = cow.reproducao.numPartos || '';
    document.getElementById('cow-next-birth').textContent = cow.reproducao.prevParto ? formatDate(cow.reproducao.prevParto) : '';
    document.getElementById('cow-last-ied').textContent = cow.reproducao.iedUltimoParto ? formatDate(cow.reproducao.iedUltimoParto) : '';
    document.getElementById('cow-last-birth-date').textContent = cow.reproducao.dataUltParto ? formatDate(cow.reproducao.dataUltParto) : '';

    // Dados do ciclo atual
    document.getElementById('cow-attempts').textContent = cow.ciclo.numTentativas || '';
    document.getElementById('cow-days-last-attempt').textContent = cow.ciclo.diasDesdeUltimaTentativa || '';
    document.getElementById('cow-first-heat').textContent = cow.ciclo.dataPrimeiroCio ? formatDate(cow.ciclo.dataPrimeiroCio) : '';
    document.getElementById('cow-last-heat').textContent = cow.ciclo.dataUltimoCio ? formatDate(cow.ciclo.dataUltimoCio) : '';
    document.getElementById('cow-first-attempt').textContent = cow.ciclo.dataPrimeiraTentativa ? formatDate(cow.ciclo.dataPrimeiraTentativa) : '';
    document.getElementById('cow-last-attempt').textContent = cow.ciclo.dataUltimaTentativa ? formatDate(cow.ciclo.dataUltimaTentativa) : '';
    document.getElementById('cow-last-attempt-father').textContent = cow.ciclo.idPaiUltimaTentativa ? `Touro Forte (#${padId(cow.ciclo.idPaiUltimaTentativa)})` : '';
    document.getElementById('cow-last-attempt-mother').textContent = cow.ciclo.idMaeUltimaTentativa ? `Branquinha (#${padId(cow.ciclo.idMaeUltimaTentativa)})` : '';
}

function padId(id) {
    return id.toString().padStart(3, '0');
}

async function loadProductionTab(cowId) {
    const cow = await fetchProductionById(cowId);
    if (!cow.producaoVaca) {
        console.warn('Dados de produção não encontrados');
        return;
    }

    document.getElementById('cow-drying-forecast').textContent = cow.producaoVaca.dataPrevisaoSecagem ? formatDate(cow.producaoVaca.dataPrevisaoSecagem) : '';
    document.getElementById('cow-last-drying').textContent = cow.producaoVaca.dataUltimaSecagem ? formatDate(cow.producaoVaca.dataUltimaSecagem) : '';
    document.getElementById('cow-lactation-count').textContent = cow.producaoVaca.qtdLactacoes || '';
    document.getElementById('cow-last-milk-count').textContent = cow.producaoVaca.ultimaContagemLeite ? parseFloat(cow.producaoVaca.ultimaContagemLeite).toFixed(2) : '';
    document.getElementById('cow-last-milk-date').textContent = cow.producaoVaca.dataUltimaContagem ? formatDate(cow.producaoVaca.dataUltimaContagem) : '';
}

async function fetchProductionById(cowId){
    try {
        const idVaca = parseInt(cowId);
        const token = localStorage.getItem('token');
        const cnir = localStorage.getItem('userCnir');
        const response = await fetch(`http://localhost:8080/api/producao_vaca/${cnir}/${idVaca}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Status da resposta:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do erro:', errorText);
            throw new Error('Erro ao buscar produção da vaca');
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

async function fetchReproductionById(cowId) {
    try{
        const idVaca = parseInt(cowId);
        const token = localStorage.getItem('token');
        const cnir = localStorage.getItem('userCnir');
        const response = await fetch(`http://localhost:8080/api/reproducao/${cnir}/${idVaca}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Status da resposta:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do erro:', errorText);
            throw new Error('Erro ao buscar produção da vaca');
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        return data;

    }catch (error) {
        console.error('Erro:', error);
        return null;
    }
    
}
// Função para mostrar o perfil da vaca
window.showCowProfile = async function(cowId) {
    document.getElementById('cows-content').style.display = 'none';
    document.getElementById('profile-content').style.display = 'block';
    document.getElementById('production-content').style.display = 'none';
    
    await loadCowProfile(cowId);
    
    document.querySelector('.tab-btn[data-tab="general"]').classList.add('active');
    document.getElementById('general-tab').classList.add('active');
};

window.showCowContent = async function(cowId) {
    document.getElementById('cows-content').style.display = 'block';
    document.getElementById('profile-content').style.display = 'none';
    document.getElementById('production-content').style.display = 'none';
    
    await loadReproductionTab(cowId);
    
    document.querySelector('.tab-btn[data-tab="general"]').classList.add('active');
    document.getElementById('general-tab').classList.add('active');
};

window.showCowProduction = async function(cowId) {
    document.getElementById('cows-content').style.display = 'none';
    document.getElementById('profile-content').style.display = 'none';
    document.getElementById('production-content').style.display = 'block';
    
    await loadProductionTab(cowId);
    
    document.querySelector('.tab-btn[data-tab="general"]').classList.add('active');
    document.getElementById('general-tab').classList.add('active');
};
