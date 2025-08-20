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
    const idVaca = document.getElementById("insemination-cow-id").value.trim();
    const pai = document.getElementById("insemination-sire").value.trim();
    const doadora = document.getElementById("insemination-donor").value.trim();
    const dataInseminacao = document.getElementById("insemination-date").value;
    const procedimento = document.getElementById("insemination-procedure").value.trim();

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

        await updateCowCycle(idVaca, pai, doadora, dataInseminacao);
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Falha ao enviar os dados para o servidor.");
    }
}

async function updateCowCycle(idVaca, pai, doadora, dataInseminacao) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Erro: token não encontrado no localStorage.");
        return;
    }

    // normaliza inteiros e datas
    const paiInt = Number.isNaN(parseInt(pai)) ? null : parseInt(pai);
    const doadoraInt = Number.isNaN(parseInt(doadora)) ? null : parseInt(doadora);
    const dataISO = dataInseminacao?.length > 10 
        ? dataInseminacao.slice(0, 10) 
        : dataInseminacao;

    try {
        // tenta buscar o ciclo existente
        const getResponse = await fetch(`http://localhost:8080/api/ciclo/${idVaca}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        let cicloData;

        if (getResponse.status === 404) {
            // não existe → cria um novo ciclo
            cicloData = {
                diaAposUltTent: null,
                primeiroCioCiclo: dataISO,
                ultCioCiclo: dataISO,
                primeiraTentaCiclo: dataISO,
                ultTentativa: dataISO,
                paiUltTentativa: paiInt,
                doadoraUltTentativa: doadoraInt
            };
        } else if (getResponse.ok) {
            // existe → atualiza só alguns campos
            const cicloExistente = await getResponse.json();
            cicloData = {
                diaAposUltTent: cicloExistente.diaAposUltTent,
                primeiroCioCiclo: cicloExistente.primeiroCioCiclo,
                ultCioCiclo: dataISO,
                primeiraTentaCiclo: cicloExistente.primeiraTentaCiclo,
                ultTentativa: dataISO,
                paiUltTentativa: paiInt,
                doadoraUltTentativa: doadoraInt
            };
        } else {
            throw new Error(`Erro ao buscar ciclo: ${getResponse.status}`);
        }

        // PUT sempre (o controller já decide se cria ou atualiza)
        const putResponse = await fetch(`http://localhost:8080/api/ciclo/${idVaca}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(cicloData)
        });

        if (!putResponse.ok) {
            const errorText = await putResponse.text();
            throw new Error(`Erro ao atualizar/criar ciclo: ${errorText}`);
        }

        console.log("Ciclo atualizado/criado com sucesso!");
        
    } catch (error) {
        console.error(error);
        alert(error.message);
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

async function deleteAppointment(appointmentId, cowId) {
   const token = localStorage.getItem("token");
   const response = await fetch(`http://localhost:8080/api/atendimentos/${cowId}/${appointmentId}`, {
       method: "DELETE",
       headers: {
           "Authorization": "Bearer " + token,
           "Content-Type": "application/json"
       }
   });

   if (response.ok) {
       alert("Atendimento excluído com sucesso!");
       showCowAppointments(cowId);
   } else {
       const errorText = await response.text();
       alert(`Erro ao excluir atendimento: ${errorText}`);
   }
}

async function deleteInsemination(appointmentId, cowId) {
   const token = localStorage.getItem("token");
   const response = await fetch(`http://localhost:8080/api/inseminacoes/${cowId}/${appointmentId}`, {
       method: "DELETE",
       headers: {
           "Authorization": "Bearer " + token,
           "Content-Type": "application/json"
       }
   });

   if (response.ok) {
       alert("Atendimento excluído com sucesso!");
       showCowAppointments(cowId);
   } else {
       const errorText = await response.text();
       alert(`Erro ao excluir inseminação: ${errorText}`);
   }
}
async function fetchCowAppointments(cowId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/atendimentos/vaca/${cowId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar atendimentos: " + response.status);
    }

    return await response.json();
}
async function fetchCowInsemination(cowId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/inseminacoes/vaca/${cowId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar atendimentos: " + response.status);
    }

    return await response.json();
}

async function showCowAppointments(cowId) {
    const appointmentDiv = document.getElementById("appointments-content");
    const header = document.getElementById("cow-id-appointment-header");
    header.innerHTML = `<h1>Atendimentos da Vaca ${cowId}</h1>`;
    try {
        // Buscar consultas e inseminações em paralelo
        const [consultas, inseminacoes] = await Promise.all([
            fetchCowAppointments(cowId),
            fetchCowInsemination(cowId)
        ]);

        // ----- LISTAR CONSULTAS -----
        const consultasList = document.getElementById('cow-appointments-list');
        consultasList.innerHTML = '';

        if (consultas.length > 0) {
            consultas.forEach(c => {
                const item = document.createElement('div');
                item.className = 'appointment-item';
                item.innerHTML = `
                    <div class="appointment-info">
                        <div class="appointment-field">
                            <strong>Data</strong>
                            <span>${new Date(c.dataAtendimento).toLocaleDateString()}</span>
                        </div>
                        <div class="appointment-field">
                            <strong>Diagnóstico</strong>
                            <span>${c.diagnostico || '-'}</span>
                        </div>
                        <div class="appointment-field">
                            <strong>Medicamento</strong>
                            <span>${c.medicamento || '-'}</span>
                        </div>
                        <div class="appointment-field">
                            <strong>Procedimento</strong>
                            <span>${c.procedimento || '-'}</span>
                        </div>
                        <div class="appointment-footer">
                            <button class="back-btn" onclick="deleteAppointment(${c.id.idAtendimento}, ${c.id.vacaId.idVaca})">
                                Excluir
                            </button>
                        </div>
                    </div>
                `;
                consultasList.appendChild(item);
            });
        } else {
            consultasList.innerHTML = `<p>Nenhum atendimento encontrado.</p>`;
        }

        // ----- LISTAR INSEMINAÇÕES -----
        const inseminacoesList = document.getElementById('cow-inseminations-list');
        inseminacoesList.innerHTML = '';
        
        if (inseminacoes.length > 0) {
            inseminacoes.forEach(i => {
                const item = document.createElement('div');
                item.className = 'appointment-item';
                item.innerHTML = `
                    <div class="appointment-info">
                        <div class="appointment-field">
                            <strong>Data</strong>
                            <span>${new Date(i.dataInseminacao).toLocaleDateString()}</span>
                        </div>
                        <div class="appointment-field">
                            <strong>Pai</strong>
                            <span>${i.pai || '-'}</span>
                        </div>
                        <div class="appointment-field">
                            <strong>Doadora</strong>
                            <span>${i.doadora || '-'}</span>
                        </div>
                        <div class="appointment-field">
                            <strong>Procedimento</strong>
                            <span>${i.procedimento || '-'}</span>
                        </div>
                        <div class="appointment-footer">
                            <button class="back-btn" onclick="deleteInsemination(${i.id.idAtendimento}, ${i.id.vacaId.idVaca})">
                                Excluir
                            </button>
                        </div>
                    </div>
                `;
                inseminacoesList.appendChild(item);
            });
        } else {
            inseminacoesList.innerHTML = `<p>Nenhuma inseminação encontrada.</p>`;
        }

        // Exibir a seção
        showSection(appointmentDiv);

    } catch (error) {
        console.error("Erro ao carregar atendimentos/inseminaçōes:", error);
    }
}
