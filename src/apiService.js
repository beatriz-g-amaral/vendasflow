import { API_URL } from './apiConfig';

const apiService = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('authToken');
  const empresaId = localStorage.getItem('empresaId');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (empresaId) {
    headers['X-Empresa-Id'] = empresaId;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensagem || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};

export default apiService;
