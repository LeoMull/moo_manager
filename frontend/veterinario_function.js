// veterinario_functions.js

async function registrarInseminacao(event) {
    event.preventDefault(); // Evita recarregar a página

    const token = localStorage.getItem("token");
    const cnir = localStorage.getItem("userCnir");

    if (!token || !cnir) {
        alert("Erro: token ou CNIR não encontrados no localStorage.");
        return;
    }

    // Captura dos campos do formulário
    const idVaca = document.getElementById("id-vaca").value.trim();
    const pai = document.getElementById("pai").value.trim();
    const doadora = document.getElementById("doadora").value.trim();
    const dataInseminacao = document.getElementById("data-inseminacao").value;
    const procedimento = document.getElementById("procedimento").value.trim();

    // Monta o objeto no formato da classe
    const inseminacaoData = {
        pai: pai,
        doadora: doadora,
        dataInseminacao: dataInseminacao,
        procedimento: procedimento
    };

    try {
        const response = await fetch(`http://localhost:8080/api/inseminacoes/${idVaca}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(inseminacaoData)
        });

        if (response.ok) {
            alert("Inseminação registrada com sucesso!");
            document.getElementById("insemination-form").reset();
        } else {
            const errorText = await response.text();
            alert(`Erro ao registrar inseminação: ${errorText}`);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Falha ao enviar os dados para o servidor.");
    }
}

// Adiciona o evento ao formulário
document.getElementById("insemination-form").addEventListener("submit", registrarInseminacao);



async function registrarAtendimento(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const cnir = localStorage.getItem("userCnir");

    if (!token || !cnir) {
        alert("Erro: token ou CNIR não encontrados no localStorage.");
        return;
    }

    const idVaca = document.getElementById("appointment-cow-id").value.trim();
    const dataAtendimento = document.getElementById("appointment-date").value;
    const medicamento = document.getElementById("appointment-medicamento").value.trim();
    const diagnostico = document.getElementById("appointment-diagnostico").value.trim();
    const procedimento = document.getElementById("appointment-procedimento").value.trim();

    const atendimentoData = {
        medicamento: medicamento,
        diagnostico: diagnostico,
        procedimento: procedimento,
        dataAtendimento: dataAtendimento
    };

    try {


        const response = await fetch(`http://localhost:8080/api/atendimentos/${idVaca}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(atendimentoData)
        });

        if (response.ok) {
            alert("Atendimento registrado com sucesso!");
            document.getElementById("appointment-form").reset();
        } else {
            const errorText = await response.text();
            alert(`Erro ao registrar atendimento: ${errorText}`);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Falha ao enviar os dados para o servidor.");
    }
}

document.getElementById("appointment-form").addEventListener("submit", registrarAtendimento);
