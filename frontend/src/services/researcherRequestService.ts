import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

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

  async createRequest(motivation: string) {
    const response = await api.post('/researcher-request', { motivation });
    return response.data;
  },


  async getMyRequests() {
    const response = await api.get('/researcher-request/me');
    return response.data;
  }
};