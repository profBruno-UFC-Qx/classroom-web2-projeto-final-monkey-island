import axios from 'axios';
import type { LoginCredentials, AuthResponse } from '../types/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

export default {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Rota correta baseada no seu authRoutes do Express
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data; // O backend já retorna { jwt: '...' }
  }
};