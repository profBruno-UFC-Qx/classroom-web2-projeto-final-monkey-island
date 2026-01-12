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
  },

  // --------------------------------------------------------------------------
  // NOVOS MÉTODOS PARA CRIAÇÃO DE POSTS (FLUXO SEQUENCIAL)
  // --------------------------------------------------------------------------

  /**
   * 1. Cria o rascunho do post.
   * CORREÇÃO: Mapeia a resposta aninhada do backend para um objeto plano que contenha o ID na raiz.
   */
  async createDraft(communityId: string, title: string, content: string): Promise<Post> {
    // Usamos 'any' na tipagem do get/post aqui para facilitar a manipulação do DTO aninhado que vem do backend
    const response = await api.post<any>(`/community/${communityId}/posts`, {
      title,
      content
    });

    // O Backend retorna: { post: { id: "...", ... }, authorId: "...", ... }
    // Precisamos retornar um objeto onde .id esteja acessível diretamente.
    const data = response.data;

    // Se a resposta vier no formato aninhado (DTO do backend), achatamos ela:
    if (data.post && data.post.id) {
      return {
        ...data.post,              // id, title, content, status, createdAt
        authorId: data.authorId,
        communityId: data.communityId,
        authorName: data.authorName,
        communityName: data.communityName
      } as Post;
    }

    // Caso contrário (se o backend mudar), retorna como está
    return data;
  },

  /**
   * 2. Realiza o upload das imagens para um post existente.
   */
  async uploadMedia(postId: string, files: File[]): Promise<void> {
    if (!files || files.length === 0) return;

    // Verificação de segurança para evitar o erro 403 por ID undefined
    if (!postId) {
        console.error("Tentativa de upload de mídia sem ID de post válido.");
        return;
    }

    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    await api.post(`/posts/${postId}/medias`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * 3. Publica o post (torna visível para outros usuários).
   */
  async publishPost(postId: string): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${postId}/publish`);
    return response.data;
  }
};