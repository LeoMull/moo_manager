// Função auxiliar para valores padrão
const defaultText = (value, isDate = false, isNumber = false) => {
    if (!value) return isDate ? '00/00/0000' : (isNumber ? '0.00' : 'Não informado');
    return value;
};


async function loadCowProfile(cowId) {
    const cow = await fetchCowById(cowId);

    if (!cow) {
        alert('Vaca não encontrada');
        return;
    }  
    document.getElementById('cow-name').textContent = cow.nome || `Vaca #${cowId}`;
    document.getElementById('cow-id-modal').textContent = `ID: #${cowId}`;
    document.getElementById('cow-sexo').textContent = cow.sexo === 'F' ? 'Fêmea' : 'Macho';
    document.getElementById('cow-lot').textContent = cow.lote || 'Não informado';
    document.getElementById('cow-needs-care').textContent = cow.precisaAtendimento ? 'Sim' : 'Não';
    document.getElementById('cow-weight').textContent = cow.peso ? `${cow.peso} kg` : 'Não informado';
    document.getElementById('cow-last-weighing').textContent = cow.dataUltimaPesagem ? formatDate(cow.dataUltimaPesagem) : 'Nunca';
    document.getElementById('cow-breed').textContent = cow.raca || 'Não informada';
    document.getElementById('cow-birth').textContent = cow.dataNasc ? formatDate(cow.dataNasc) : 'Não informada';
    document.getElementById('cow-category').textContent = cow.categoria || 'Não categorizada';
    document.getElementById('cow-mother').textContent = cow.nomeMae ? `${cow.nomeMae}` : 'Não informada';
    document.getElementById('cow-father').textContent = cow.nomePai ? `${cow.nomePai}` : 'Não informado';
    document.getElementById('id-cow-mother').textContent = cow.idMae ? `#${padId(cow.idMae)}` : 'Não informado';
    document.getElementById('id-cow-father').textContent = cow.idPai ? `#${padId(cow.idPai)}` : 'Não informado';

}

async function loadReproductionTab(cowId) {
    const cow = {
        reproducao: await fetchReproductionById(cowId),
        ciclo: await fetchCicloById(cowId)
    }
    if (!cow.reproducao || !cow.ciclo) {
        if(!cow.reproducao) {
            document.getElementById('cow-repro-status').textContent = 'Não informado';
            document.getElementById('cow-birth-type').textContent = 'Não informado';
            document.getElementById('cow-days-last-birth').textContent = 'Não informado';
            document.getElementById('cow-birth-count').textContent = 'Não informado';
            document.getElementById('cow-next-birth').textContent = 'Não informado';
            document.getElementById('cow-last-ied').textContent = 'Não informado';
            document.getElementById('cow-last-birth-date').textContent = 'Não informado';
        }
        if(!cow.ciclo) {
            document.getElementById('cow-attempts').textContent = 'Não informado';
            document.getElementById('cow-days-last-attempt').textContent = 'Não informado';
            document.getElementById('cow-first-heat').textContent = 'Não informado';
            document.getElementById('cow-last-heat').textContent = 'Não informado';
            document.getElementById('cow-first-attempt').textContent = 'Não informado';
            document.getElementById('cow-last-attempt').textContent = 'Não informado';
            document.getElementById('cow-last-attempt-father').textContent = 'Não informado';
            document.getElementById('cow-last-attempt-mother').textContent = 'Não informado';
        }

        return;
    }

    // Dados gerais da reprodução
    document.getElementById('cow-repro-status').textContent = defaultText(cow.reproducao.situacaoRepo);
    document.getElementById('cow-birth-type').textContent = defaultText(cow.reproducao.tipoUltParto);
    document.getElementById('cow-days-last-birth').textContent = defaultText(cow.reproducao.diasDesdeUltimoParto);
    document.getElementById('cow-birth-count').textContent = defaultText(cow.reproducao.numPartos);
    document.getElementById('cow-next-birth').textContent = defaultText(cow.reproducao.prevParto ? formatDate(cow.reproducao.prevParto) : null, true);
    document.getElementById('cow-last-ied').textContent = defaultText(cow.reproducao.iedUltimoParto ? formatDate(cow.reproducao.iedUltimoParto) : null, true);
    document.getElementById('cow-last-birth-date').textContent = defaultText(cow.reproducao.dataUltParto ? formatDate(cow.reproducao.dataUltParto) : null, true);

    // Dados do ciclo atual
    document.getElementById('cow-attempts').textContent = defaultText(cow.ciclo.numTentativas);
    document.getElementById('cow-days-last-attempt').textContent = defaultText(cow.ciclo.diasDesdeUltimaTentativa);
    document.getElementById('cow-first-heat').textContent = defaultText(cow.ciclo.dataPrimeiroCio ? formatDate(cow.ciclo.dataPrimeiroCio) : null, true);
    document.getElementById('cow-last-heat').textContent = defaultText(cow.ciclo.dataUltimoCio ? formatDate(cow.ciclo.dataUltimoCio) : null, true);
    document.getElementById('cow-first-attempt').textContent = defaultText(cow.ciclo.dataPrimeiraTentativa ? formatDate(cow.ciclo.dataPrimeiraTentativa) : null, true);
    document.getElementById('cow-last-attempt').textContent = defaultText(cow.ciclo.dataUltimaTentativa ? formatDate(cow.ciclo.dataUltimaTentativa) : null, true);
    document.getElementById('cow-last-attempt-father').textContent = cow.ciclo.idPaiUltimaTentativa ? `Touro Forte (#${padId(cow.ciclo.idPaiUltimaTentativa)})` : 'Não informado';
    document.getElementById('cow-last-attempt-mother').textContent = cow.ciclo.idMaeUltimaTentativa ? `Branquinha (#${padId(cow.ciclo.idMaeUltimaTentativa)})` : 'Não informado';
}

function padId(id) {
    return id.toString().padStart(3, '0');
}

async function loadProductionTab(cowId) {
    const cow = await fetchProductionById(cowId);

    if (!cow || !cow.producaoVaca) {
        document.getElementById('cow-drying-forecast').textContent = '00/00/0000';
        document.getElementById('cow-last-drying').textContent = '00/00/0000';
        document.getElementById('cow-lactation-count').textContent = 'Não informado';
        document.getElementById('cow-last-milk-count').textContent = '0.00';
        document.getElementById('cow-last-milk-date').textContent = '00/00/0000';
        return;
    }

    document.getElementById('cow-drying-forecast').textContent = cow.producaoVaca.dataPrevisaoSecagem ? formatDate(cow.producaoVaca.dataPrevisaoSecagem) : '00/00/0000';
    document.getElementById('cow-last-drying').textContent = cow.producaoVaca.dataUltimaSecagem ? formatDate(cow.producaoVaca.dataUltimaSecagem) : '00/00/0000';
    document.getElementById('cow-lactation-count').textContent = defaultText(cow.producaoVaca.qtdLactacoes);
    document.getElementById('cow-last-milk-count').textContent = cow.producaoVaca.ultimaContagemLeite ? parseFloat(cow.producaoVaca.ultimaContagemLeite).toFixed(2) : '0.00';
    document.getElementById('cow-last-milk-date').textContent = cow.producaoVaca.dataUltimaContagem ? formatDate(cow.producaoVaca.dataUltimaContagem) : '00/00/0000';
}


async function fetchProductionById(cowId){
    try {
        const idVaca = parseInt(cowId);
        const token = localStorage.getItem('token');
        const cnir = localStorage.getItem('userCnir');
        const response = await fetch(`http://localhost:8080/api/producao_vaca/${idVaca}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Status da resposta:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do erro:', errorText);
            return null;
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


        const response = await fetch(`http://localhost:8080/api/reproducao/${idVaca}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do erro:', errorText);
            return null;
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        return data;

    }catch (error) {
        console.error('Erro:', error);
        return null;
    }
    
}

async function fetchCicloById(cowId) {
    try{
        const idVaca = parseInt(cowId);
        const token = localStorage.getItem('token');
        const cnir = localStorage.getItem('userCnir');

        const response = await fetch(`http://localhost:8080/api/ciclo/${cnir}/${idVaca}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do erro:', errorText);
            return null;
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
    await loadReproductionTab(cowId);
    await loadProductionTab(cowId);
    
    document.querySelector('.tab-btn[data-tab="general"]').classList.add('active');
    document.getElementById('general-tab').classList.add('active');
};


