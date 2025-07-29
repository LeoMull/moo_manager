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
    document.getElementById('cow-lot').textContent = await findCowLot(cow) || 'Não informado';
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
    const reproducao = await fetchReproductionById(cowId);
    const ciclo = await fetchCicloById(cowId);

    if (!reproducao && !ciclo) {
        // Preenche todos com "Não informado"
        [
            'input-cow-repro-status', 'input-cow-birth-type', 'input-cow-birth-count', 'input-cow-next-birth',
            'input-cow-last-birth-date', 'input-cow-attempts', 'input-cow-days-last-birth', 'input-cow-days-last-attempt',
            'input-cow-first-heat', 'input-cow-last-heat', 'input-cow-first-attempt', 'input-cow-last-attempt',
            'input-cow-last-attempt-father', 'input-cow-last-attempt-mother', 'input-cow-last-ied'
        ].forEach(id => document.getElementById(id).textContent = 'Não informado');
        return;
    }

    // ---- Dados gerais da reprodução ----
    if (reproducao) {
        document.getElementById('input-cow-repro-status').textContent = defaultText(reproducao.situacaoRepo);
        document.getElementById('input-cow-birth-type').textContent = defaultText(reproducao.tipoUltParto);
        document.getElementById('input-cow-birth-count').textContent = defaultText(reproducao.numPartos);
        document.getElementById('input-cow-next-birth').textContent = defaultText(reproducao.prevParto ? formatDate(reproducao.prevParto) : null, true);
        document.getElementById('input-cow-last-birth-date').textContent = defaultText(reproducao.dataUltParto ? formatDate(reproducao.dataUltParto) : null, true);
        document.getElementById('input-cow-attempts').textContent = defaultText(reproducao.numTentativas);
    }

    // ---- Dados do ciclo atual ----
    if (ciclo) {
        document.getElementById('input-cow-days-last-birth').textContent = defaultText(ciclo.diasDesdeUltimoParto);
        document.getElementById('input-cow-days-last-attempt').textContent = defaultText(ciclo.diasDesdeUltimaTentativa);
        document.getElementById('input-cow-first-heat').textContent = defaultText(ciclo.dataPrimeiroCio ? formatDate(ciclo.dataPrimeiroCio) : null, true);
        document.getElementById('input-cow-last-heat').textContent = defaultText(ciclo.dataUltimoCio ? formatDate(ciclo.dataUltimoCio) : null, true);
        document.getElementById('input-cow-first-attempt').textContent = defaultText(ciclo.dataPrimeiraTentativa ? formatDate(ciclo.dataPrimeiraTentativa) : null, true);
        document.getElementById('input-cow-last-attempt').textContent = defaultText(ciclo.dataUltimaTentativa ? formatDate(ciclo.dataUltimaTentativa) : null, true);
        document.getElementById('input-cow-last-attempt-father').textContent = ciclo.idPaiUltimaTentativa ? `#${padId(ciclo.idPaiUltimaTentativa)}` : 'Não informado';
        document.getElementById('input-cow-last-attempt-mother').textContent = ciclo.idMaeUltimaTentativa ? `#${padId(ciclo.idMaeUltimaTentativa)}` : 'Não informado';
        document.getElementById('input-cow-last-ied').textContent = defaultText(ciclo.iedUltimoParto);
    }
}


function padId(id) {
    return id.toString().padStart(3, '0');
}

async function loadProductionTab(cowId) {
    const cow = await fetchProductionById(cowId);

    if (!cow || !cow) {
        console.log("Estou no nullo");
        document.getElementById('cow-drying-forecast').textContent = '00/00/0000';
        document.getElementById('cow-last-drying').textContent = '00/00/0000';
        document.getElementById('cow-lactation-count').textContent = 'Não informado';
        document.getElementById('cow-last-milk-count').textContent = '0.00';
        document.getElementById('cow-last-milk-date').textContent = '00/00/0000';
        return;
    }


    document.getElementById('cow-drying-forecast').textContent = cow.dataSecagem ? cow.dataSecagem : '00/00/0000';
    document.getElementById('cow-last-drying').textContent =     cow.dataUltimaSecagem ? formatDate(cow.dataUltimaSecagem) : '00/00/0000';
    document.getElementById('cow-lactation-count').textContent = cow.qtdLactacoes ? cow.qtdLactacoes : '0';
    document.getElementById('cow-last-milk-count').textContent = cow.ultimaCtgLeite ? parseFloat(cow.ultimaCtgLeite).toFixed(2) : '0.00';
    document.getElementById('cow-last-milk-date').textContent =  cow.dataUltimaCtgLeite ? formatDate(cow.dataUltimaCtgLeite) : '00/00/0000';
}


async function fetchProductionById(cowId){
    try {
        const idVaca = parseInt(cowId);
        const token = localStorage.getItem('token');

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

        const response = await fetch(`http://localhost:8080/api/ciclo/${idVaca}`, {
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

async function findCowLot(cow) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch("http://localhost:8080/api/lotes", { headers: { "Authorization": `Bearer ${token}` } });

        if (!response.ok) throw new Error("Erro ao carregar filtros");

        const data = await response.json();

        const filtrosOrdenados = Array.isArray(data) 
            ? data.sort((a, b) => a.id.prioridade - b.id.prioridade) 
            : [data];

        for (const filtro of filtrosOrdenados) {
             if(compararFiltro(cow, filtro)) return filtro.rotulo;

        }
        return null;
      } catch (err) {
          alert("Erro: " + err.message);
      }
}

function compararFiltro(cow, filtro) {
    const { campo, operador, valor } = filtro;
    const cowValue = cow[campo];
    console.log(`Comparando campo: ${campo}, operador: ${operador}, valor: ${valor}, cowValue: ${cowValue}`);

    if (cowValue == null) return false; // se o campo não existe ou é nulo, já falha


    let v1 = cowValue;
    let v2 = valor;

    // Tenta converter para número
    const num1 = parseFloat(v1);
    const num2 = parseFloat(v2);
    if (!isNaN(num1) && !isNaN(num2)) {
        v1 = num1;
        v2 = num2;
    }
    // Se não for número, tenta converter para datas
    else if (!isNaN(Date.parse(v1)) && !isNaN(Date.parse(v2))) {
        v1 = new Date(v1);
        v2 = new Date(v2);
    }
    // Caso contrário, mantém como string (comparação case-insensitive)
    else {
        v1 = String(v1).toLowerCase();
        v2 = String(v2).toLowerCase();
    }

    switch (operador) {
        case '=':  return v1 == v2;
        case '!=': return v1 != v2;
        case '>':  return v1 > v2;
        case '<':  return v1 < v2;
        case '>=': return v1 >= v2;
        case '<=': return v1 <= v2;
        default:   return false;
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


