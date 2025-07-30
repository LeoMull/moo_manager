// Função auxiliar para valores padrão
const defaultText = (value, isDate = false, isNumber = false) => {
    if (!value) return isDate ? '00/00/0000' : (isNumber ? '0.00' : 'Não informado');
    return value;
};


async function loadCowProfile(cowId) {
    const cow = await fetchCowById(cowId);
    let cowLot = document.getElementById('cow-lot');
    if (!cow) {
        alert('Vaca não encontrada');
        return;
    }
    if (cowLot.textContent === 'Não informado' || cowLot.textContent === '') {
        console.log('Lote não encontrado, buscando...');
        cowLot.textContent = await findCowLot(cowId) || 'Não informado';
    }
    document.getElementById('cow-name').textContent = cow.nome || `Vaca #${cowId}`;
    document.getElementById('cow-id-modal').textContent = `ID: #${cowId}`;
    document.getElementById('cow-sexo').textContent = cow.sexo === 'F' ? 'Fêmea' : 'Macho';

    document.getElementById('cow-lot').textContent = await findCowLot(cowId) || 'Não informado';
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

function daysBetween(date) {
    const today = new Date();
    const past = new Date(date);
    const diffTime = today - past;
    let b = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    return b;
}

function valueOrNA(value, isDate = false) {
    if (value === null || value === undefined) return 'Não informado';
    if (isDate) return value; // assume já formatado
    return value;
}

async function loadReproductionTab(cowId) {
    const reproducao = await fetchReproductionById(cowId);
    const ciclo = await fetchCicloById(cowId);

    if (!reproducao && !ciclo) {
        console.log("Reprodução ou ciclo não encontrados ou nulos");
        document.getElementById('cow-repro-status').textContent = 'Não informado';
        document.getElementById('cow-birth-type').textContent = 'Não informado';
        document.getElementById('cow-birth-count').textContent = '0';
        document.getElementById('cow-next-birth').textContent = '00/00/0000';
        document.getElementById('cow-last-birth-date').textContent = '00/00/0000';
        document.getElementById('cow-attempts').textContent = '0';
        document.getElementById('cow-days-last-birth').textContent = '0';
        document.getElementById('cow-days-last-attempt').textContent = '0';
        document.getElementById('cow-first-heat').textContent = '00/00/0000';
        document.getElementById('cow-last-heat').textContent = '00/00/0000';
        document.getElementById('cow-first-attempt').textContent = '00/00/0000';
        document.getElementById('cow-last-attempt').textContent = '00/00/0000';
        document.getElementById('cow-last-attempt-father').textContent = 'Não informado';
        document.getElementById('cow-last-attempt-mother').textContent = 'Não informado';
        document.getElementById('cow-last-ied').textContent = '0';
        return;
    }

    if (reproducao) {
        document.getElementById('cow-repro-status').textContent = reproducao.situacaoRepo || 'Não informado';
        document.getElementById('cow-birth-type').textContent = reproducao.tipoUltParto || 'Não informado';
        document.getElementById('cow-birth-count').textContent = (reproducao.numPartos != null) ? reproducao.numPartos : '0';
        document.getElementById('cow-next-birth').textContent = reproducao.prevParto ? formatDate(reproducao.prevParto) : '00/00/0000';
        document.getElementById('cow-last-birth-date').textContent = reproducao.dataUltParto ? formatDate(reproducao.dataUltParto) : '00/00/0000';
        document.getElementById('cow-days-last-birth').textContent = reproducao.dataUltParto ? daysBetween(reproducao.dataUltParto) : '0';
        document.getElementById('cow-attempts').textContent = (reproducao.numTentativas != null) ? reproducao.numTentativas : '0';
    }

    if (ciclo) {
        document.getElementById('cow-days-last-attempt').textContent = (ciclo.diasDesdeUltimaTentativa != null) ? ciclo.diasDesdeUltimaTentativa : '0';
        document.getElementById('cow-first-heat').textContent = ciclo.dataPrimeiroCio ? formatDate(ciclo.dataPrimeiroCio) : '00/00/0000';
        document.getElementById('cow-last-heat').textContent = ciclo.dataUltimoCio ? formatDate(ciclo.dataUltimoCio) : '00/00/0000';
        document.getElementById('cow-first-attempt').textContent = ciclo.dataPrimeiraTentativa ? formatDate(ciclo.dataPrimeiraTentativa) : '00/00/0000';
        document.getElementById('cow-last-attempt').textContent = ciclo.dataUltimaTentativa ? formatDate(ciclo.dataUltimaTentativa) : '00/00/0000';
        document.getElementById('cow-last-attempt-father').textContent = (ciclo.idPaiUltimaTentativa != null) ? ciclo.idPaiUltimaTentativa : 'Não informado';
        document.getElementById('cow-last-attempt-mother').textContent = (ciclo.idMaeUltimaTentativa != null) ? ciclo.idMaeUltimaTentativa : 'Não informado';
        document.getElementById('cow-last-ied').textContent = (ciclo.iedUltimoParto != null) ? ciclo.iedUltimoParto : '0';
    }

}

function padId(id) {
    return id.toString().padStart(3, '0');
}

async function loadProductionTab(cowId) {
    const cow = await fetchProductionById(cowId);

    if (!cow) {
        console.log("Produção não encontrada ou nula");
        document.getElementById('cow-drying-forecast').textContent = '00/00/0000';
        document.getElementById('cow-last-drying').textContent = '00/00/0000';
        document.getElementById('cow-lactation-count').textContent = '0';
        document.getElementById('cow-last-milk-count').textContent = '0.00';
        document.getElementById('cow-last-milk-date').textContent = '00/00/0000';
        return;
    }

    document.getElementById('cow-drying-forecast').textContent = cow.dataSecagem ? formatDate(cow.dataSecagem) : '00/00/0000';
    document.getElementById('cow-last-drying').textContent = cow.dataUltimaSecagem ? formatDate(cow.dataUltimaSecagem) : '00/00/0000';
    document.getElementById('cow-lactation-count').textContent = (cow.qtdLactacoes != null) ? cow.qtdLactacoes : '0';
    document.getElementById('cow-last-milk-count').textContent = (cow.ultimaCtgLeite != null) ? parseFloat(cow.ultimaCtgLeite).toFixed(2) : '0.00';
    document.getElementById('cow-last-milk-date').textContent = cow.dataUltimaCtgLeite ? formatDate(cow.dataUltimaCtgLeite) : '00/00/0000';
}


async function fetchProductionById(cowId) {
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
    try {
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

    } catch (error) {
        console.error('Erro:', error);
        return null;
    }

}

async function fetchCicloById(cowId) {
    try {
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

    } catch (error) {
        console.error('Erro:', error);
        return null;
    }

}

async function findCowLot(cowId) {
    const token = localStorage.getItem('token');
    try {
        const filtersResponse = await fetch("http://localhost:8080/api/lotes", { headers: { "Authorization": `Bearer ${token}` } });
        if (!filtersResponse.ok) throw new Error("Erro ao carregar filtros");

        const filtros = await filtersResponse.json();
        const filtrosOrdenados = Array.isArray(filtros)
            ? filtros.sort((a, b) => a.id.prioridade - b.id.prioridade)
            : [filtros];

        const vaca = {
            vaca: await fetchCowById(cowId) || {},
            producao_vaca: await fetchProductionById(cowId) || {},
            reproducao_vaca: await fetchReproductionById(cowId) || {},
            ciclo_vaca: await fetchCicloById(cowId) || {}
        };

        // Tenta comparar em cada conjunto de dados
        for (const filtro of filtrosOrdenados) {
            for (const categoria of Object.values(vaca)) {
                if (compararFiltro(categoria, filtro)) {
                    return filtro.rotulo;
                }
            }
        }
        return null;
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

function compararFiltro(cow, filtro) {
    if (!cow) return false;

    const { campo, operador, valor } = filtro;
    const cowValue = cow[campo];

    console.log(`Comparando campo: ${campo}, operador: ${operador}, valor: ${valor}, cowValue: ${cowValue}`);
    if (cowValue == null || cowValue === '') return false;

    let v1 = cowValue;
    let v2 = valor;

    // Tenta converter para número
    const num1 = parseFloat(v1);
    const num2 = parseFloat(v2);
    if (!isNaN(num1) && !isNaN(num2)) {
        v1 = num1;
        v2 = num2;
    }
    // Se não for número, tenta converter para datas válidas
    else if (!isNaN(Date.parse(v1)) && !isNaN(Date.parse(v2))) {
        v1 = new Date(v1);
        v2 = new Date(v2);
    }
    // Caso contrário, compara como strings
    else {
        v1 = String(v1).toLowerCase();
        v2 = String(v2).toLowerCase();
    }

    switch (operador) {
        case '=': return v1 == v2;
        case '!=': return v1 != v2;
        case '>': return v1 > v2;
        case '<': return v1 < v2;
        case '>=': return v1 >= v2;
        case '<=': return v1 <= v2;
        default: return false;
    }
}



// Função para mostrar o perfil da vaca
window.showCowProfile = async function (cowId) {
    document.getElementById('cows-content').style.display = 'none';
    document.getElementById('profile-content').style.display = 'block';
    document.getElementById('production-content').style.display = 'none';

    await loadCowProfile(cowId);
    await loadReproductionTab(cowId);
    await loadProductionTab(cowId);

    document.querySelector('.tab-btn[data-tab="general"]').classList.add('active');
    document.getElementById('general-tab').classList.add('active');
};


