class ManagerPanel {
  constructor() {
    this.token = localStorage.getItem('token');
    this.cnir = localStorage.getItem('userCnir');
    this.init();
  }

  async init() {
    if (document.getElementById('home-content')) {
      await this.loadPropertyData();
      await this.loadQuickStats();
    }
    
    document.getElementById('home-btn')?.addEventListener('click', async () => {
      await this.loadPropertyData();
      await this.loadQuickStats();
    });
  }

  async loadPropertyData() {
    try {
      if (!this.cnir) {
        console.error('CNIR não encontrado no localStorage');
        this.displayFallbackData();
        return;
      }

      const response = await fetch(`http://localhost:8080/api/propriedades/current`, {
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

  async loadQuickStats() {
    try {
      if (!this.cnir) {
        console.error('CNIR não encontrado no localStorage');
        this.displayFallbackStats();
        return;
      }

      const statsResponse = await fetch(`http://localhost:8080/api/propriedades/current/stats`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      });

      if (!statsResponse.ok) {
        throw new Error('Erro ao carregar estatísticas da propriedade');
      }

      const statsData = await statsResponse.json();
      this.updateStatsUI(statsData);

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      this.displayFallbackStats();
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

  updateStatsUI(statsData) {
    const totalCowsElement = document.getElementById('total-cows');
    const lactatingCowsElement = document.getElementById('lactating-cows');
    const todayProductionElement = document.getElementById('today-production');

    if (totalCowsElement) {
      totalCowsElement.textContent = statsData.totalCows || '0';
    }
    
    if (lactatingCowsElement) {
      lactatingCowsElement.textContent = statsData.lactatingCows || '0';
    }
    
    if (todayProductionElement) {
      todayProductionElement.textContent = `${statsData.todayProduction || '0'} litros`;
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

  displayFallbackStats() {
    const totalCowsElement = document.getElementById('total-cows');
    const lactatingCowsElement = document.getElementById('lactating-cows');
    const todayProductionElement = document.getElementById('today-production');

    if (totalCowsElement) totalCowsElement.textContent = '0';
    if (lactatingCowsElement) lactatingCowsElement.textContent = '0';
    if (todayProductionElement) todayProductionElement.textContent = '0 litros';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  new ManagerPanel();
});
