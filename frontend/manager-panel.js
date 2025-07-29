class ManagerPanel {
  constructor() {
    this.API_BASE_URL = 'http://localhost:8080/api';
    this.token = localStorage.getItem('token');
    this.vacasCache = null;
    this.producoesCache = null;
    this.init();
  }

  async init() {
    if (!this.token) {
      this.redirectToLogin();
      return;
    }

    try {
      await this.loadPropertyData();
      await this.loadCowData();
      await this.loadTodayProduction();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.displayFallbackData();
    }
  }

  async loadPropertyData() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/propriedades/current`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const propertyData = await response.json();
      
      // Garantir que temos pelo menos valores padrão
      const nomePropriedade = propertyData.nome || 'Nome não disponível';
      const cnirPropriedade = propertyData.cnir || this.getCnirFromToken() || 'CNIR não disponível';
      
      this.updatePropertyUI(nomePropriedade, cnirPropriedade);
    } catch (error) {
      console.error('Erro ao carregar dados da propriedade:', error);
      this.displayFallbackPropertyData();
    }
  }

  updatePropertyUI(nome, cnir) {
    const propertyNameElement = document.getElementById('property-name');
    const propertyCnirElement = document.getElementById('property-cnir');
    
    if (propertyNameElement) {
      propertyNameElement.textContent = nome;
    }
    
    if (propertyCnirElement) {
      propertyCnirElement.textContent = cnir;
    }
  }

  async loadCowData() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/vacas`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const cows = await response.json();
      this.vacasCache = cows;
      this.updateCowCounters(cows);
      
    } catch (error) {
      console.error('Erro ao carregar dados das vacas:', error);
      document.getElementById('total-cows').textContent = 'Erro';
      document.getElementById('lactating-cows').textContent = 'Erro';
    }
  }

  updateCowCounters(cows) {
    const totalCows = Array.isArray(cows) ? cows.length : 0;
    document.getElementById('total-cows').textContent = totalCows;

    const lactatingCows = this.countLactatingCows(cows);
    document.getElementById('lactating-cows').textContent = lactatingCows;
  }

  countLactatingCows(cows) {
    if (!Array.isArray(cows)) return 0;
    
    return cows.filter(cow => {
      return cow.categoria === 'Lactante' || 
             (cow.producao && cow.producao.emLactacao);
    }).length;
  }

  async loadTodayProduction() {
    try {
      const today = new Date();
      const todayISO = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      // Primeiro, buscar todas as vacas para ver quais estão em lactação
      const cowsResponse = await fetch(`${this.API_BASE_URL}/vacas`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      if (!cowsResponse.ok) throw new Error('Erro ao buscar vacas');
      const cows = await cowsResponse.json();
      
      // Filtrar apenas vacas em lactação
      const lactatingCows = cows.filter(cow => 
        cow.categoria === 'Lactante' || 
        (cow.producao && cow.producao.emLactacao)
      );
      
      // Buscar produções de hoje para essas vacas
      const productionResponse = await fetch(`${this.API_BASE_URL}/producao_vaca`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      if (!productionResponse.ok) throw new Error('Erro ao buscar produções');
      const productions = await productionResponse.json();
      
      // Filtrar produções de hoje
      const todayProductions = productions.filter(prod => {
        if (!prod.dataUltimaCtgLeite) return false;
        const prodDate = new Date(prod.dataUltimaCtgLeite).toISOString().split('T')[0];
        return prodDate === todayISO;
      });
      
      // Calcular total
      const totalProduction = todayProductions.reduce((sum, prod) => {
        return sum + (prod.ultimaCtgLeite || 0);
      }, 0);
      
      this.updateTodayProductionUI(totalProduction);
    } catch (error) {
      console.error('Erro ao carregar produção de hoje:', error);
      document.getElementById('today-production').textContent = '0 litros';
    }
  }

  updateTodayProductionUI(volume) {
    const formattedVolume = volume.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    document.getElementById('today-production').textContent = `${formattedVolume} litros`;
  }

  getCnirFromToken() {
    try {
      if (!this.token) return null;
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return payload.cnir || payload.sub;
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
      return null;
    }
  }

  displayFallbackData() {
    this.displayFallbackPropertyData();
    document.getElementById('total-cows').textContent = '0';
    document.getElementById('lactating-cows').textContent = '0';
    document.getElementById('today-production').textContent = '0 litros';
  }

  displayFallbackPropertyData() {
    document.getElementById('property-name').textContent = 'Dados não disponíveis';
    document.getElementById('property-cnir').textContent = this.getCnirFromToken() || 'Não informado';
  }

  redirectToLogin() {
    window.location.href = '/login?sessionExpired=true';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ManagerPanel();
});
