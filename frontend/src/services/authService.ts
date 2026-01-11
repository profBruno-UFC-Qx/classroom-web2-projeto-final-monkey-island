import axios from 'axios';
import type { LoginCredentials, AuthResponse } from '../types/auth';
import type { RegisterCredentials } from '../types/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

export default {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {

    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data; 
  },
  async register(credentials: RegisterCredentials): Promise<void> {
    await api.post('/auth/register-user', credentials);
  }
};