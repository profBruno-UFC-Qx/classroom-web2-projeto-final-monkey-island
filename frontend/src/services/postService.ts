import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { Post, PostMedia } from '../types/post';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para adicionar o token JWT em todas as requisições
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
  /**
   * Busca o feed público (posts de todas as comunidades)
   */
  async getPublicFeed(page = 1, limit = 10): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>('/feed/public', {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * Busca o feed do usuário (posts das comunidades que ele participa)
   */
  async getUserFeed(page = 1, limit = 10): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>('/feed', {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * Busca as mídias (fotos) de um post específico
   */
  async getPostMedias(postId: string): Promise<PostMedia[]> {
    const response = await api.get<{ medias: PostMedia[] }>(`/posts/${postId}/medias`);
    return response.data.medias;
  },

  /**
   * Busca os posts criados pelo próprio usuário para exibição no perfil.
   * Nota: Filtra o feed localmente enquanto a rota /posts/me não é implementada.
   */
  async getMyPosts(page = 1, limit = 10): Promise<FeedResponse> {
    const authStore = useAuthStore();
    const myUserId = authStore.user?.id;

    const response = await api.get<FeedResponse>('/feed', {
      params: { page, limit: 50 } 
    });

    const allPosts = response.data.data || [];
    const myPosts = allPosts.filter(post => post.authorId === myUserId);

    return {
      ...response.data,
      data: myPosts,
      totalItems: myPosts.length 
    };
  },

  /**
   * Placeholder para o sistema de curtidas.
   */
  async getLikedPosts(page = 1, limit = 10): Promise<FeedResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [],
          totalItems: 0,
          totalPages: 0
        });
      }, 300);
    });
  },

  /**
   * Método para curtir um post (futuro)
   */
  async likePost(postId: string) {
    console.log(`Solicitação de Like para o post: ${postId}`);
    // Implementar quando a rota PATCH/POST /posts/:id/like existir
  },

  // --------------------------------------------------------------------------
  // NOVOS MÉTODOS PARA CRIAÇÃO DE POSTS (FLUXO SEQUENCIAL)
  // --------------------------------------------------------------------------

  /**
   * 1. Cria o rascunho do post (apenas texto).
   * Rota: POST /community/:communityId/posts
   */
  async createDraft(communityId: string, content: string): Promise<Post> {
    const response = await api.post<Post>(`/community/${communityId}/posts`, {
      content
      // Se o backend exigir um título futuramente, adicione aqui: title: 'Novo Relatório'
    });
    return response.data;
  },

  /**
   * 2. Realiza o upload das imagens para um post existente.
   * Rota: POST /posts/:postId/medias
   */
  async uploadMedia(postId: string, files: File[]): Promise<void> {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    
    // O backend espera o campo 'files' (conforme configurado no Multer)
    files.forEach((file) => {
      formData.append('files', file);
    });

    // O Axios detecta automaticamente o FormData e ajusta o Content-Type para multipart/form-data,
    // mas é uma boa prática explicitar ou deixar o browser gerenciar o boundary.
    await api.post(`/posts/${postId}/medias`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * 3. Publica o post (torna visível para outros usuários).
   * Rota: PATCH /posts/:postId/publish
   */
  async publishPost(postId: string): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${postId}/publish`);
    return response.data;
  }
};