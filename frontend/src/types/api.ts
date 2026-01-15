// Configuração base (pode vir de .env no futuro: import.meta.env.VITE_API_URL)
const BASE_URL = 'http://localhost:3000';

// Helper para pegar headers padrão
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Wrapper genérico para fetch
const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  // Garante que o endpoint comece com /
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Tratamento global de erros (ex: token expirado)
  if (response.status === 401) {
    // Opcional: Redirecionar para login ou limpar storage
    console.warn('Sessão expirada');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Erro na requisição: ${response.status}`);
  }

  // Retorna null se não tiver conteúdo (204 No Content), senão faz o parse
  if (response.status === 204) return null as T;
  
  return response.json();
};

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, body: any) => request<T>(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(body) 
  }),
  
  put: <T>(endpoint: string, body: any) => request<T>(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(body) 
  }),
  
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
  
  // Helper para montar URLs de imagens
  getImageUrl: (path: string) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/images/${cleanPath}`;
  }
};