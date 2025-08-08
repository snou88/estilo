// api.ts

// Always use HTTPS
// const PHP_API_BASE_URL = "https://estilo.ct.ws/";
const PHP_API_BASE_URL = "https://estilo.byethost17.com/";

// And your helper
export const getPhpApiUrl = (endpoint: string) =>
  `${PHP_API_BASE_URL}${endpoint}`;

export const getAdminPhpApiUrl = (endpoint: string) =>
  `${PHP_API_BASE_URL}${endpoint}${localStorage.getItem('admin_token') ? `?token=${localStorage.getItem('admin_token')}` : ''}`;