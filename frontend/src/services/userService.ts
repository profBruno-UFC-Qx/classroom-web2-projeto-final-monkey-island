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
    const data = response.data;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      bio: data.bio,
      institution: data.instituition || data.institution 
    } as User;
  }
};