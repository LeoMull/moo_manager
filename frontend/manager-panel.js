// manager-panel.js

class ManagerPanel {
  constructor() {
    this.token = localStorage.getItem('token');
    this.cnir = localStorage.getItem('userCnir');
    this.init();
  }

  async init() {
    // Verifica se estamos na página home
    if (document.getElementById('home-content')) {
      await this.loadPropertyData();
    }
    
    // Adiciona listener para quando o botão home for clicado
    document.getElementById('home-btn')?.addEventListener('click', () => this.loadPropertyData());
  }

  async loadPropertyData() {
    try {
      if (!this.cnir) {
        console.error('CNIR não encontrado no localStorage');
        this.displayFallbackData();
        return;
      }

      const response = await fetch(`http://localhost:8080/api/propriedade/${this.cnir}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados da propriedade');
      }

      const propertyData = await response.json();
      this.updateUI(propertyData);

    } catch (error) {
      console.error('Erro ao carregar dados da propriedade:', error);
      this.displayFallbackData();
    }
  }

  updateUI(propertyData) {
    const welcomeTitle = document.querySelector('.welcome-message h1');
    const welcomeSubtitle = document.querySelector('.welcome-message p');
    
    if (welcomeTitle && welcomeSubtitle) {
      welcomeTitle.textContent = `Propriedade: ${propertyData.nome || 'Não informado'}`;
      welcomeSubtitle.textContent = `CNIR: ${this.cnir}`;
    }
  }

  displayFallbackData() {
    const welcomeTitle = document.querySelector('.welcome-message h1');
    const welcomeSubtitle = document.querySelector('.welcome-message p');
    
    if (welcomeTitle && welcomeSubtitle) {
      welcomeTitle.textContent = 'Propriedade: Não informado';
      welcomeSubtitle.textContent = `CNIR: ${this.cnir || 'Não informado'}`;
    }
  }
}

// Inicializa o ManagerPanel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new ManagerPanel();
});