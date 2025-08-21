// funcionario_functions.js - Funções específicas para funcionário

// Funções específicas para edição pelo funcionário
const funcEditBtn = document.getElementById('func-edit-btn');
const funcSaveBtn = document.getElementById('func-save-btn');
const funcCancelBtn = document.getElementById('func-cancel-btn');

function enableFuncEditMode() {
    // Habilita apenas o campo de observação que o funcionário pode editar
    const span = document.getElementById('cow-observation');
    const input = document.getElementById('input-cow-observation');
    
    if (span && input) {
        input.style.display = 'inline-block';
        span.style.display = 'none';
        
        let valorSpan = span.textContent.trim() === 'Nenhuma' || span.textContent.trim() === 'Não informado' ? '' : span.textContent.trim();
        input.value = valorSpan;
    }

    // Alterna botões
    document.getElementById('func-edit-btn').style.display = 'none';
    document.getElementById('func-save-btn').style.display = 'inline-block';
    document.getElementById('func-cancel-btn').style.display = 'inline-block';
}

function cancelFuncEditMode() {
    // Oculta input e mostra novamente o span do campo editável
    const span = document.getElementById('cow-observation');
    const input = document.getElementById('input-cow-observation');
    
    if (span && input) {
        input.style.display = 'none';
        span.style.display = 'inline-block';
    }

    // Alterna botões
    document.getElementById('func-edit-btn').style.display = 'inline-block';
    document.getElementById('func-save-btn').style.display = 'none';
    document.getElementById('func-cancel-btn').style.display = 'none';
}

async function saveFuncChanges() {
    const token = localStorage.getItem('token');
    const cnir = localStorage.getItem('userCnir');
    let idVaca = document.getElementById('cow-id-modal').textContent.replace('ID: #', '').trim();

    if (!token || !cnir) {
        alert("Erro: token ou CNIR não encontrados no localStorage.");
        return;
    }

    const parseOrNull = (value) => value && value.trim() !== '' ? value.trim() : null;

    // Apenas os dados que o funcionário pode editar (só observação)
    const dadosAtualizados = {
        observacao: parseOrNull(document.getElementById('input-cow-observation').value) || "Nenhuma"
    };

    try {
        const response = await fetch(`http://localhost:8080/api/vacas/${idVaca}/funcionario`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + token 
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            alert('Observação atualizada com sucesso!');
            
            // Atualiza o valor exibido
            document.getElementById('cow-observation').textContent = dadosAtualizados.observacao;
            
            // Volta para o modo de visualização
            cancelFuncEditMode();
        } else {
            const errorText = await response.text();
            alert(`Erro ao atualizar: ${errorText}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Falha ao enviar os dados para o servidor.');
    }
}

// Event listeners para os botões do funcionário
if (funcEditBtn) {
    funcEditBtn.addEventListener('click', enableFuncEditMode);
}

if (funcSaveBtn) {
    funcSaveBtn.addEventListener('click', saveFuncChanges);
}

if (funcCancelBtn) {
    funcCancelBtn.addEventListener('click', cancelFuncEditMode);
}