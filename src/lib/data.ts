import { authAPI } from './auth';

const DATA_API_URL = 'https://functions.poehali.dev/34121e91-6d34-485d-a7a6-cabc03134f0e';

export interface DataRecord {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export const dataAPI = {
  getAll: async (): Promise<DataRecord[]> => {
    const token = authAPI.getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(DATA_API_URL, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch data');
    }

    const result = await response.json();
    return result.data;
  },

  getById: async (id: number): Promise<DataRecord> => {
    const token = authAPI.getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${DATA_API_URL}?id=${id}`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch data');
    }

    return await response.json();
  },

  create: async (key: string, value: string): Promise<DataRecord> => {
    const token = authAPI.getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(DATA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
      body: JSON.stringify({ key, value }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create data');
    }

    return await response.json();
  },

  update: async (id: number, value: string): Promise<DataRecord> => {
    const token = authAPI.getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(DATA_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
      body: JSON.stringify({ id, value }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update data');
    }

    return await response.json();
  },

  delete: async (id: number): Promise<void> => {
    const token = authAPI.getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${DATA_API_URL}?id=${id}`, {
      method: 'DELETE',
      headers: {
        'X-Auth-Token': token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete data');
    }
  },
};
