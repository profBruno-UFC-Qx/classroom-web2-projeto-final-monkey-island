
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { ArtifactCollectionResponse, ArtifactRarity } from '../types/artifact';


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

  async getMyCollection(page = 1, limit = 20): Promise<ArtifactCollectionResponse> {
    const response = await api.get<ArtifactCollectionResponse>('/artifact-collection', {
      params: { page, limit }
    });
    return response.data;
  },


  async searchArtifacts(name: string, page = 1, limit = 20): Promise<ArtifactCollectionResponse> {
    const response = await api.get<ArtifactCollectionResponse>('/artifact-collection/search', {
      params: { name, page, limit }
    });
    return response.data;
  },


  async filterByRarity(rarity: string, page = 1, limit = 20): Promise<ArtifactCollectionResponse> {
    const response = await api.get<ArtifactCollectionResponse>('/artifact-collection/by-rarity', {
      params: { rarity, page, limit }
    });
    return response.data;
  }
};