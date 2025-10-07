const AUTH_API_URL = 'https://functions.poehali.dev/21b0ffa1-87d6-4c8c-bff5-f9458d088cff';
const TOKEN_KEY = 'cloudstore_token';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register',
        name,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(AUTH_API_URL, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }

    const data = await response.json();
    return data.user;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
