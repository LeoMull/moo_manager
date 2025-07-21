// Função para carregar perfil da vaca
async function loadCowProfile(cowId) {
    const cow = await fetchCowById(cowId);

    if (!cow) {
        alert('Vaca não encontrada');
        return;
    }
    
    document.getElementById('cow-name').textContent = cow.nome || `Vaca #${cowId}`;
    document.getElementById('cow-id').textContent = `ID: #${cowId}`;
    
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

// Função para mostrar o perfil da vaca
window.showCowProfile = async function(cowId) {
    document.getElementById('cows-content').style.display = 'none';
    document.getElementById('profile-content').style.display = 'block';
    document.getElementById('production-content').style.display = 'none';
    
    await loadCowProfile(cowId);
    
    document.querySelector('.tab-btn[data-tab="general"]').classList.add('active');
    document.getElementById('general-tab').classList.add('active');
};