const BASE_URL = 'http://localhost:3000';


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

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);


  if (response.status === 401) {

    console.warn('Sessão expirada');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Erro na requisição: ${response.status}`);
  }

  if (response.status === 204) return null as T;
  
  return response.json();
};

export const api = {
  get: <R>(endpoint: string) => 
    request<R>(endpoint, { method: 'GET' }),
  

  post: <B, R = any>(endpoint: string, body: B) => 
    request<R>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    }),
  
  put: <B, R = any>(endpoint: string, body: B) => 
    request<R>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }),
  
  delete: <R = any>(endpoint: string) => 
    request<R>(endpoint, { method: 'DELETE' }),
  
  getImageUrl: (path: string) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/images/${cleanPath}`;
  }
};