// api.ts

// Always use HTTPS
// const PHP_API_BASE_URL = "https://estilo.ct.ws/";
const PHP_API_BASE_URL = "http://localhost/estilo/";

// And your helper
export const getPhpApiUrl = (endpoint: string) =>
  `${PHP_API_BASE_URL}${endpoint}`;
