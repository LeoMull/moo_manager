const editBtn = document.getElementById('edit-btn');
const saveBtnVaca = document.getElementById('save-btn-vaca');
const cancelBtn = document.getElementById('cancel-btn');
const deleteBtn = document.getElementById('delete-btn');


function enableEditMode() {
    document.querySelectorAll('#profile-content .detail-item').forEach(item => {
        const span = item.querySelector('.detail-value');
        const input = item.querySelector('input, select');
        if (span && input) {
            input.style.display = 'inline-block';
            span.style.display = 'none';
            let valorSpan = span.textContent.trim() === 'Não informado' ? '' : span.textContent.trim();

            if (input.tagName === 'SELECT') {
                // Tenta achar a opção pelo texto ou value
                const option = Array.from(input.options).find(opt =>
                    opt.value == valorSpan || opt.text.trim() == valorSpan
                );
                input.value = option ? option.value : '';
            } 
            else if (input.tagName === 'INPUT') {
                if (input.type === 'date' && valorSpan) {
                    // Converte de dd/mm/yyyy para yyyy-mm-dd
                    const partes = valorSpan.split('/');
                    if (partes.length === 3) {
                        valorSpan = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                    }
                }
                input.value = valorSpan;
            }
        }
    });

    // Alterna botões
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('save-btn-vaca').style.display = 'inline-block';
    document.getElementById('delete-btn').style.display = 'inline-block';
    document.getElementById('cancel-btn').style.display = 'inline-block';
}
editBtn.addEventListener('click', enableEditMode);

function cancelEditMode() {
    // Oculta inputs e mostra novamente os spans
    document.querySelectorAll('#profile-content .detail-item').forEach(item => {
        const span = item.querySelector('.detail-value');
        const input = item.querySelector('input, select');
        if (span && input) {
            input.style.display = 'none';
            span.style.display = 'inline-block';
        }
    });

    // Alterna botões
    document.getElementById('edit-btn').style.display = 'inline-block';
    document.getElementById('save-btn-vaca').style.display = 'none';
    document.getElementById('delete-btn').style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';
}
cancelBtn.addEventListener('click', cancelEditMode);

/*
saveBtnVaca.addEventListener('click', () => {
    // Construir objeto com dados atualizados
    let token = localStorage.getItem('token');
    let idVaca = document.getElementById('cow-id-modal').textContent.replace('ID: #', '').trim();

    const parseOrNull = (value) => {
        const trimmed = value.trim();
        return trimmed === '' ? null : trimmed;
    };

    const parseFloatOrNull = (value) => {
        const n = parseFloat(value);
        return isNaN(n) ? null : n;
    };

    const parseIntOrNull = (value) => {
        const n = parseInt(value);
        return isNaN(n) ? null : n;
    };

    const dadosAtualizados = {
        sexo: parseOrNull(document.getElementById('input-cow-sexo').value),
        raca: parseOrNull(document.getElementById('input-cow-breed').value),
        dataNasc: parseOrNull(document.getElementById('input-cow-birth').value), // formato "yyyy-MM-dd"
        categoria: parseOrNull(document.getElementById('input-cow-category').value),
        lote: parseOrNull(document.getElementById('input-cow-lot').value),
        precisaAtendimento: document.getElementById('input-cow-needs-care').value === 'true',
        observacao: parseOrNull(document.getElementById('input-cow-observation').value),
        peso: parseFloatOrNull(document.getElementById('input-cow-weight').value),
        dataUltimaPesagem: parseOrNull(document.getElementById('input-cow-last-weighing').value),
        idMae: parseIntOrNull(document.getElementById('input-cow-id-mother').value),
        nomeMae: parseOrNull(document.getElementById('input-cow-mother').value),
        idPai: parseIntOrNull(document.getElementById('input-cow-id-father').value),
        nomePai: parseOrNull(document.getElementById('input-cow-father').value)
    };

    fetch(`http://localhost:8080/api/vacas/${idVaca}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar dados: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {

        cancelEditMode();
        alert('Dados salvos com sucesso!');
    })
    .catch(error => {
        alert('Erro: ' + error.message);
    });
});
*/
saveBtnVaca.addEventListener('click', async () => {
    let token = localStorage.getItem('token');
    let idVaca = document.getElementById('cow-id-modal').textContent.replace('ID: #', '').trim();

    const parseOrNull = (value) => value && value.trim() !== '' ? value.trim() : null;
    const parseFloatOrNull = (value) => isNaN(parseFloat(value)) ? null : parseFloat(value);
    const parseIntOrNull = (value) => isNaN(parseInt(value)) ? null : parseInt(value);

    // --- Dados da vaca ---
    const dadosAtualizados = {
        sexo: parseOrNull(document.getElementById('input-cow-sexo').value),
        raca: parseOrNull(document.getElementById('input-cow-breed').value),
        dataNasc: parseOrNull(document.getElementById('input-cow-birth').value),
        categoria: parseOrNull(document.getElementById('input-cow-category').value),
        lote: parseOrNull(document.getElementById('input-cow-lot').value),
        precisaAtendimento: document.getElementById('input-cow-needs-care').value === 'true',
        observacao: parseOrNull(document.getElementById('input-cow-observation').value),
        peso: parseFloatOrNull(document.getElementById('input-cow-weight').value),
        dataUltimaPesagem: parseOrNull(document.getElementById('input-cow-last-weighing').value),
        idMae: parseIntOrNull(document.getElementById('input-cow-id-mother').value),
        nomeMae: parseOrNull(document.getElementById('input-cow-mother').value),
        idPai: parseIntOrNull(document.getElementById('input-cow-id-father').value),
        nomePai: parseOrNull(document.getElementById('input-cow-father').value)
    };

    // --- Dados de produção ---
    const dadosProducao = {
        dataSecagem: parseOrNull(document.getElementById('input-cow-drying-forecast').value),
        dataUltimaSecagem: parseOrNull(document.getElementById('input-cow-last-drying').value),
        qtdLactacoes: parseIntOrNull(document.getElementById('input-cow-lactation-count').value) || 0,
        ultimaCtgLeite: parseFloatOrNull(document.getElementById('input-cow-last-milk-count').value) || 0,
        dataUltimaCtgLeite: parseOrNull(document.getElementById('input-cow-last-milk-date').value)
    };

    // --- Dados de reprodução ---
    const dadosReproducao = {
        situacaoRepo: parseOrNull(document.getElementById('input-cow-repro-status').value),
        tipoUltParto: parseOrNull(document.getElementById('input-cow-birth-type').value),
        numPartos: parseIntOrNull(document.getElementById('input-cow-birth-count').value),
        prevParto: parseOrNull(document.getElementById('input-cow-next-birth').value),
        dataUltParto: parseOrNull(document.getElementById('input-cow-last-birth-date').value),
        numTentativas: parseIntOrNull(document.getElementById('input-cow-attempts').value)    
    };

    const dadosCiclo = {
        
        diasDesdeUltimoParto: parseIntOrNull(document.getElementById('input-cow-days-last-birth').value),
        diasDesdeUltimaTentativa: parseIntOrNull(document.getElementById('input-cow-days-last-attempt').value),
        dataUltimoCio: parseOrNull(document.getElementById('input-cow-last-heat').value),
        dataUltimaTentativa: parseOrNull(document.getElementById('input-cow-last-attempt').value),
        dataPrimeiraTentativa: parseOrNull(document.getElementById('input-cow-first-attempt').value),
        dataPrimeiroCio: parseOrNull(document.getElementById('input-cow-first-heat').value),
        
        paiUltTentativa: parseIntOrNull(document.getElementById('input-cow-last-attempt-father').value),
        doadoraUltTentativa: parseIntOrNull(document.getElementById('input-cow-last-attempt-mother').value),
        
        iedUltimoParto: parseIntOrNull(document.getElementById('input-cow-last-ied').value)
    };
    console.log('dadosAtualizados:', dadosAtualizados);
    console.log('dadosProducao:', dadosProducao);
    console.log('dadosReproducao:', dadosReproducao);
    console.log('dadosCiclo:', dadosCiclo);
    try {
        // Atualiza vaca
        await fetch(`http://localhost:8080/api/vacas/${idVaca}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(dadosAtualizados)
        }).then(r => { if (!r.ok) throw new Error("Erro ao salvar vaca"); });

        // Atualiza produção
        await fetch(`http://localhost:8080/api/producao_vaca/${idVaca}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(dadosProducao)
        }).then(r => { if (!r.ok) throw new Error("Erro ao salvar produção"); });

        // Atualiza reprodução
        await fetch(`http://localhost:8080/api/reproducao/${idVaca}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(dadosReproducao)
        }).then(r => { if (!r.ok) throw new Error("Erro ao salvar reprodução"); });

        // Atualiza ciclo
        await fetch(`http://localhost:8080/api/ciclo/${idVaca}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(dadosCiclo)
        }).then(r => { if (!r.ok) throw new Error("Erro ao salvar ciclo"); });

        cancelEditMode();
        alert("Todos os dados foram salvos com sucesso!");
    } catch (err) {
        alert("Erro: " + err.message);
    }
});

deleteBtn.addEventListener('click', () => {
    const idVaca = document.getElementById('cow-id-modal').textContent.replace('ID: #', '').trim();
    const token = localStorage.getItem('token');

    if (confirm('Tem certeza que deseja excluir esta vaca?')) {
        fetch(`http://localhost:8080/api/vacas/${idVaca}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir vaca: ' + response.statusText);
            }
            alert('Vaca excluída com sucesso!');
            window.location.reload();
        })
        .catch(error => {
            alert('Erro: ' + error.message);
        });
    }
});

function saveProducao() {
    const token = localStorage.getItem('token');
    const idVaca = document.getElementById('cow-id-modal').textContent.replace('ID: #', '').trim();
    const cnir = localStorage.getItem('userCnir');

    const dadosProducao = {
        dataSecagem: document.getElementById('input-cow-drying-forecast').value || null,
        dataUltimaSecagem: document.getElementById('input-cow-last-drying').value || null,
        qtdLactacoes: parseInt(document.getElementById('input-cow-lactation-count').value) || 0,
        ultimaCtgLeite: parseFloat(document.getElementById('input-cow-last-milk-count').value) || 0,
        dataUltimaCtgLeite: document.getElementById('input-cow-last-milk-date').value || null
    };

    fetch(`http://localhost:8080/api/producao_vaca/${idVaca}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dadosProducao)
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar produção");
        return res.json();
    })
    .then(() => {
        // Atualiza os spans com os novos valores
        document.getElementById('cow-drying-forecast').textContent = dadosProducao.dataSecagem;
        document.getElementById('cow-last-drying').textContent = dadosProducao.dataUltimaSecagem;
        document.getElementById('cow-lactation-count').textContent = dadosProducao.qtdLactacoes;
        document.getElementById('cow-last-milk-count').textContent = dadosProducao.ultimaCtgLeite;
        document.getElementById('cow-last-milk-date').textContent = dadosProducao.dataUltimaCtgLeite;

        // Ajusta os botões visíveis
        saveBtnVaca.style.display = 'none';
        cancelBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';

        alert("Produção atualizada!");
    })
    .catch(err => alert(err.message));
}

function saveReproducao(){
    const token = localStorage.getItem('token');
    const idVaca = document.getElementById('cow-id-modal').textContent.replace('ID: #', '').trim();
    const cnir = localStorage.getItem('userCnir');

    // Objeto para atualização da entidade Reproducao
    const dadosReproducao = {
        situacaoRepo: document.getElementById('input-cow-repro-status').value.trim(),
        tipoUltParto: document.getElementById('input-cow-birth-type').value.trim(),
        numPartos: parseInt(document.getElementById('input-cow-birth-count').value),
        prevParto: document.getElementById('input-cow-next-birth').value,
        dataUltParto: document.getElementById('input-cow-last-birth-date').value,
        numTentativas: parseInt(document.getElementById('input-cow-attempts').value)    
    };

    // Objeto para atualização da entidade Ciclo
    const dadosCiclo = {
        diasDesdeUltimoParto: parseInt(document.getElementById('input-cow-days-last-birth').value),
        diasDesdeUltimaTentativa: parseInt(document.getElementById('input-cow-days-last-attempt').value),
        dataUltimoCio: document.getElementById('input-cow-last-heat').value,
        dataUltimaTentativa: document.getElementById('input-cow-last-attempt').value,
        dataPrimeiraTentativa: document.getElementById('input-cow-first-attempt').value,
        dataPrimeiroCio: document.getElementById('input-cow-first-heat').value,
        idPaiUltimaTentativa: parseInt(document.getElementById('input-cow-last-attempt-father').value),
        idMaeUltimaTentativa: parseInt(document.getElementById('input-cow-last-attempt-mother').value),
        iedUltimoParto: parseInt(document.getElementById('input-cow-last-ied').value)
    };

    // Requisição para atualizar reprodução
    fetch(`http://localhost:8080/api/reproducao/${idVaca}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dadosReproducao)
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar reprodução");
        return res.json();
    })
    .then(() => {
        // Requisição para atualizar ciclo
        return fetch(`http://localhost:8080/api/ciclo/${idVaca}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(dadosCiclo)
        });
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar ciclo");
        return res.json();
    })
    .then(()=>{
        cancelEditMode();
    })
    .catch(err => alert(err.message));
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const selectedTab = btn.dataset.tab;
        const cowId = document.getElementById('cow-id-modal').textContent.replace('ID: #', '').trim();

        // Esconde todas as abas
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
            tab.classList.remove('active');
        });

        // Remove classe ativa de todos os botões
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

        // Mostra a aba selecionada e ativa o botão correspondente
        btn.classList.add('active');
        document.getElementById(`${selectedTab}-tab`).style.display = 'block';
        document.getElementById(`${selectedTab}-tab`).classList.add('active');

        // Carrega os dados se necessário
        if (selectedTab === 'general') {
            await loadCowProfile(cowId);
        } else if (selectedTab === 'reproduction') {
            await loadReproductionTab(cowId);
        } else if (selectedTab === 'production') {
            await loadProductionTab(cowId);
        }
    });
});