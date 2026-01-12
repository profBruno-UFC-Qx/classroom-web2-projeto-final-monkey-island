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
   * Nota: Como no backend atual a rota de autor exige um communityId, 
   * usamos o /feed filtrado ou preparamos para uma futura rota /posts/me.
   */
  async getMyPosts(page = 1, limit = 10): Promise<FeedResponse> {
    // 1. Obtém a store de autenticação para pegar o ID do usuário logado
    const authStore = useAuthStore();
    const myUserId = authStore.user?.id;

    // 2. Busca o feed (que retorna tudo)
    // Nota: Aumentamos o limit para tentar trazer mais posts do usuário de uma vez
    // já que a paginação do backend é aplicada antes do nosso filtro.
    const response = await api.get<FeedResponse>('/feed', {
      params: { page, limit: 50 } 
    });

    // 3. Filtra apenas os posts onde o autor é o usuário logado
    const allPosts = response.data.data || [];
    const myPosts = allPosts.filter(post => post.authorId === myUserId);

    // 4. Retorna a estrutura esperada (FeedResponse) com os dados filtrados
    return {
      ...response.data,
      data: myPosts,
      // Opcional: Ajustar totalItems se quiser refletir apenas a contagem filtrada na tela, 
      // mas o valor real do servidor será diferente.
      totalItems: myPosts.length 
    };
  },

  /**
   * Placeholder para o sistema de curtidas.
   * Retorna um feed vazio conforme solicitado, aguardando implementação no backend.
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
  }
};