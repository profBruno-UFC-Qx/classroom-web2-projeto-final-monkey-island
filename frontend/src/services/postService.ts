import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { Post, PostMedia } from '../types/post';

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

export interface FeedResponse {
  data: Post[];
  totalItems: number;
  totalPages: number;
}

export default {
  async getPublicFeed(page = 1, limit = 10): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>('/feed/public', {
      params: { page, limit }
    });
    return response.data;
  },


  async getUserFeed(page = 1, limit = 10): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>('/feed', {
      params: { page, limit }
    });
    return response.data;
  },


  async getPostMedias(postId: string): Promise<PostMedia[]> {
    const response = await api.get<{ medias: PostMedia[] }>(`/posts/${postId}/medias`);
    return response.data.medias;
  },

  async likePost(postId: string) {

  }
};