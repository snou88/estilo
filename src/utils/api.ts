// Configuration API pour les futures intégrations backend
const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://api.estilo.com' 
  : 'http://localhost:8000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Fonctions utilitaires pour les appels API
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Base URL for PHP API endpoints (for XAMPP/localhost)
export const PHP_API_BASE_URL = import.meta.env.MODE === 'production'
  ? 'https://api.estilo.com' // Update if you deploy PHP API
  : 'http://localhost/estilo/';

// Helper to get full PHP API endpoint
export const getPhpApiUrl = (endpoint: string) => `${PHP_API_BASE_URL}${endpoint}`;

// Example: getPhpApiUrl('api/products/read.php')