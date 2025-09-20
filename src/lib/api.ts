const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(email: string, password: string, displayName?: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  }

  async logout() {
    localStorage.removeItem('authToken');
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Bet methods
  async getBets() {
    return this.request('/bets');
  }

  async getBet(id: string) {
    return this.request(`/bets/${id}`);
  }

  async createBet(betData: {
    title: string;
    description?: string;
    category: string;
    endDate: string;
  }) {
    return this.request('/bets', {
      method: 'POST',
      body: JSON.stringify(betData),
    });
  }

  async placeBet(betId: string, position: 'yes' | 'no', amount: string) {
    return this.request(`/bets/${betId}/place`, {
      method: 'POST',
      body: JSON.stringify({ position, amount }),
    });
  }

  async getUserBets(betId: string) {
    return this.request(`/bets/${betId}/user-bets`);
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData: {
    displayName?: string;
    avatarUrl?: string;
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserBetsHistory() {
    return this.request('/users/bets');
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async addFunds(amount: string) {
    return this.request('/users/add-funds', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }
}

export const api = new ApiClient();