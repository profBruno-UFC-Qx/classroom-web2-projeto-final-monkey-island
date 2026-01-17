import api from "@/api/api";
import { useAuthStore } from "@/stores/authStore";
import type { Post, PostMedia, FeedResponse,LikeToggleResponse } from "@/types/post";
export default {
  async getPublicFeed(page = 1, limit = 10): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>("/feed/public", {
      params: { page, limit },
    });
    return response.data;
  },

  async getUserFeed(page = 1, limit = 10): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>("/feed", {
      params: { page, limit },
    });
    return response.data;
  },

  async recentPostsInCommunity(
    communityId: string,
    page = 1,
    limit = 10
  ): Promise<FeedResponse> {
    const response = await api.get<FeedResponse>(
      `/community/${communityId}/posts`,
      { params: { page, limit } }
    );
    return response.data;
  },

  async getPostMedias(postId: string): Promise<PostMedia[]> {
    const response = await api.get<{ medias: PostMedia[] }>(
      `/posts/${postId}/medias`
    );
    return response.data.medias;
  },

  async getMyPosts(page = 1, limit = 10): Promise<FeedResponse> {
    const authStore = useAuthStore();
    const myUserId = authStore.user?.id;

    if (!myUserId) {
       return { data: [], totalItems: 0, totalPages: 0 };
    }

    // Alerta de Performance: Filtragem no Client-Side
    // Idealmente, solicitar ao backend um endpoint GET /users/me/posts
    const response = await api.get<FeedResponse>("/feed", {
      params: { page, limit: 50 }, // Aumentado limite para tentar pegar mais posts do usuário
    });

    const allPosts = response.data.data || [];
    const myPosts = allPosts.filter((post) => post.authorId === myUserId);

    return {
      ...response.data,
      data: myPosts,
      totalItems: myPosts.length,
    };
  },

  async likePost(postId: string): Promise<void> {
     // TODO: Integrar com backend
    console.log(`Like simulado no post: ${postId}`);
    // await api.post(`/posts/${postId}/like`);
  },

  async createDraft(
    communityId: string,
    title: string,
    content: string
  ): Promise<Post> {
    const response = await api.post<any>(`/community/${communityId}/posts`, {
      title,
      content,
    });

    const data = response.data;

    // Normalização defensiva
    if (data.post && data.post.id) {
      return {
        ...data.post,
        authorId: data.authorId,
        communityId: data.communityId,
        authorName: data.authorName,
        communityName: data.communityName,
      } as Post;
    }
    
    // Fallback se a estrutura já vier correta
    return data as Post;
  },

  async uploadMedia(postId: string, files: File[]): Promise<void> {
    if (!files?.length || !postId) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    await api.post(`/posts/${postId}/medias`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async publishPost(postId: string): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${postId}/publish`);
    return response.data;
  },
  async toggleLike(postId: string): Promise<LikeToggleResponse> {
    const { data } = await api.post<LikeToggleResponse>(`/posts/${postId}/like`);
    return data;
  },
  async getPostById(postId: string): Promise<PostResponse> {
    const { data } = await api.get<PostResponse>(`/posts/${postId}`);
    return data;
  },
};