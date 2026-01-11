
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { CommunityResponse } from '../types/community';

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
  async getMyCommunities(page = 1, limit = 20): Promise<CommunityResponse> {
    const response = await api.get<CommunityResponse>('/community/profile/my-communities', {
      params: { page, limit }
    });
    return response.data;
  }
};