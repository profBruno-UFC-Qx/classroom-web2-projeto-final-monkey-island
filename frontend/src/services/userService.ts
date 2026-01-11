import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types/user';


const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});


api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export default {
  async getMyProfile(): Promise<User> {
    const response = await api.get('/users/me');
    
    const backendData = response.data;
    
    return {
      id: backendData.id,
      name: backendData.name,
      email: backendData.email || '',
      role: backendData.role,
      status: backendData.status,
      bio: backendData.bio,
      institution: backendData.instituition || backendData.institution
    } as User;
  },

  async getMyArtifacts() {
    const response = await api.get('/artifact-collection');
    return response.data;
  }
};