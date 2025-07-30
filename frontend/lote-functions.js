document.addEventListener("DOMContentLoaded", () => {
  const lotsContent = document.getElementById("lots-content");

  const container = lotsContent.querySelector("#filters-container");
  const addFilterBtn = lotsContent.querySelector("#add-filter");
  const deleteAllBtn = lotsContent.querySelector("#delete-all");
  const filterForm = lotsContent.querySelector("#filter-form");

  const API_URL = "http://localhost:8080/api/lotes";
  const TOKEN = localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : null;
  const CNIR = localStorage.getItem("userCnir");

  if (!TOKEN || !CNIR) {
      alert("Erro: Usuário não autenticado!");
  }

  const categorias = [
      "sexo", "raca", "dataNasc", "categoria", "precisaAtendimento", "peso", "tipoUltParto",
      "situacaoRepo", "numPartos", "prevParto", "dataUltParto", "dataSecagem", "dataUltimaSecagem",
      "qtdLactacoes", "ultimaCtgLeite", "diaAposUltTent", "primeiroCioCiclo", "ultCioCiclo", "primeiraTentaCiclo"
  ];
  const operadores = ["=", "!=", ">", "<", ">=", "<="];

  function criarFiltro(filtro = null) {
      const wrapper = document.createElement("div");
      wrapper.className = "filter-item ";

      wrapper.innerHTML = `
          <label>Rótulo:</label>
          <input type="text" name="rotulo" value="${filtro?.rotulo || ''}" placeholder="Ex: Filtro de prenhes">
          <label>Categoria:</label>
          <select name="campo">${categorias.map(c => `<option value="${c}" ${filtro?.campo === c ? 'selected' : ''}>${c}</option>`).join("")}</select>
          <label>Operador:</label>
          <select name="operador">${operadores.map(o => `<option value="${o}" ${filtro?.operador === o ? 'selected' : ''}>${o}</option>`).join("")}</select>
          <label>Valor:</label>
          <div class="valor-container"></div>
          <label>Prioridade:</label>
          <input type="number" name="prioridade" value="${filtro?.id?.prioridade || 1}" min="1" style="width:80px;">
          <button type="button" class="remove-filter back-btn">Remover</button>
      `;

      const campoSelect = wrapper.querySelector('select[name="campo"]');
      const valorContainer = wrapper.querySelector(".valor-container");

      function atualizarInputValor(valor = filtro?.valor || '') {
          const campo = campoSelect.value;
          let input;
          if (["dataNasc", "dataUltParto", "dataSecagem", "dataUltimaSecagem", "prevParto", "primeiroCioCiclo", "ultCioCiclo", "primeiraTentaCiclo"].includes(campo)) {
              input = document.createElement("input");
              input.type = "date";
              input.value = valor;
          } else if (campo === "precisaAtendimento") {
              input = document.createElement("select");
              input.innerHTML = `<option value="true" ${valor === "true" ? 'selected' : ''}>Sim</option><option value="false" ${valor === "false" ? 'selected' : ''}>Não</option>`;
          } else if (campo === "categoria") {
              input = document.createElement("select");
              input.innerHTML = `
                <option value="Lactante" ${valor === "Lactante" ? 'selected' : ''}>Lactante</option>
                <option value="Seca" ${valor === "Seca" ? 'selected' : ''}>Seca</option>
                <option value="Novilha" ${valor === "Novilha" ? 'selected' : ''}>Novilha</option>
                <option value="Bezerra" ${valor === "Bezerra" ? 'selected' : ''}>Bezerra</option>
                <option value="Touro" ${valor === "Touro" ? 'selected' : ''}>Touro</option>
                <option value="Descarte" ${valor === "Descarte" ? 'selected' : ''}>Descarte</option>`;
          } else if (campo === "sexo") {
              input = document.createElement("select");
              input.innerHTML = `<option value="M" ${valor === "Macho" ? 'selected' : ''}>Macho</option><option value="F" ${valor === "Femea" ? 'selected' : ''}>Fêmea</option>`;
          } else if (["peso", "numPartos", "qtdLactacoes", "ultimaCtgLeite", "diaAposUltTent"].includes(campo)) {
              input = document.createElement("input");
              input.type = "number";
              input.value = valor;
          } else {
              input = document.createElement("input");
              input.type = "text";
              input.value = valor;
          }
          input.name = "valor";
          valorContainer.innerHTML = "";
          valorContainer.appendChild(input);
      }

      campoSelect.addEventListener("change", () => atualizarInputValor());
      atualizarInputValor();

      wrapper.querySelector(".remove-filter").addEventListener("click", () => wrapper.remove());

      container.appendChild(wrapper);
  }

  addFilterBtn.addEventListener("click", () => criarFiltro());

  filterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!TOKEN) {
          alert("Usuário não autenticado");
          return;
      }

      let filtros = [];
      let valid = true;

      container.querySelectorAll(".filter-item").forEach(item => {
          let rotulo = item.querySelector('input[name="rotulo"]').value.trim();
          let campo = item.querySelector('select[name="campo"]').value;
          let operador = item.querySelector('select[name="operador"]').value;
          let valor = item.querySelector('[name="valor"]').value.trim();
          let prioridade = parseInt(item.querySelector('input[name="prioridade"]').value) || 1;

          if (!rotulo || !campo || !operador || !valor) {
              alert("Preencha todos os campos dos filtros");
              valid = false;
              return;
          }

          filtros.push({
              id: { cnir: CNIR, prioridade: prioridade },
              propriedade: { cnir: CNIR },
              rotulo: rotulo,
              campo: campo,
              operador: operador,
              valor: valor
          });
      });

      if (!valid) return;

      filtros.sort((a, b) => a.id.prioridade - b.id.prioridade);

      try {
          const response = await fetch(`${API_URL}/bulk`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': TOKEN },
              body: JSON.stringify(filtros)
          });
          if (!response.ok) throw new Error("Erro ao salvar filtros");
          alert("Filtros salvos com sucesso!");
      } catch (err) {
          alert("Erro: " + err.message);
      }
  });

  deleteAllBtn.addEventListener("click", async () => {
      if (!confirm("Deseja realmente deletar todos os filtros?")) return;
      try {
          const response = await fetch(API_URL, { method: "DELETE", headers: { "Authorization": TOKEN } });
          if (!response.ok) throw new Error("Erro ao deletar filtros");
          container.innerHTML = "";
          criarFiltro();
          alert("Todos os filtros foram removidos!");
      } catch (err) {
          alert("Erro: " + err.message);
      }
  });

  async function carregarFiltros() {
      try {
          const response = await fetch(API_URL, { headers: { "Authorization": TOKEN } });
          if (!response.ok) throw new Error("Erro ao carregar filtros");
          const data = await response.json();
          container.innerHTML = "";
          if (Array.isArray(data)) {
              data.forEach(f => criarFiltro(f));
          } else if (data) {
              criarFiltro(data);
          } else {
              criarFiltro();
          }
      } catch (err) {
          alert("Erro: " + err.message);
          criarFiltro();
      }
  }

  carregarFiltros();
});
