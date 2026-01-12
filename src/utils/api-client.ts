import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4566';
const API_ID = import.meta.env.VITE_API_ID || 'aabbccddee';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');


console.log('🔧 API Client Config:');
console.log('  Base URL:', API_BASE_URL);
console.log('  API ID:', API_ID);
console.log('  Environment:', import.meta.env.MODE);

if (!API_BASE_URL) {
  console.error('❌ VITE_API_BASE_URL não configurada');
}

if (!API_ID) {
  console.error('❌ VITE_API_ID não configurada');
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`, //restapis/${API_ID}/stg/_user_request_`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para debug
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros global
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default apiClient;