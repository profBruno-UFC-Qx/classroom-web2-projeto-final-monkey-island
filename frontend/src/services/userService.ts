import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types/user';

// Criação da instância com URL base
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para adicionar o Token automaticamente em todas as requisições deste service
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export default {
  // Busca o perfil do usuário logado (/users/me)
  async getMyProfile(): Promise<User> {
    const response = await api.get('/users/me');
    
    // Mapeamento para corrigir o typo do backend ('instituition' -> 'institution')
    const backendData = response.data;
    
    return {
      id: backendData.id,
      name: backendData.name,
      email: backendData.email || '', // Backend as vezes não manda email no DTO de perfil público, mas no /me costuma mandar
      role: backendData.role,
      status: backendData.status,
      bio: backendData.bio,
      institution: backendData.instituition // AQUI A MÁGICA: Mapeamos o erro do back para o certo do front
    } as User;
  },

  // Placeholder para a futura funcionalidade de relíquias
  async getMyArtifacts() {
    const response = await api.get('/artifact-collection');
    return response.data;
  }
};