import api from "@/api/api";
import { useAuthStore } from "../stores/authStore";
import type { Post, PostMedia } from "../types/post";

export interface FeedResponse {
  data: Post[];
  totalItems: number;
  totalPages: number;
}

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

  async getPostMedias(postId: string): Promise<PostMedia[]> {
    const response = await api.get<{ medias: PostMedia[] }>(
      `/posts/${postId}/medias`
    );
    return response.data.medias;
  },

  async getMyPosts(page = 1, limit = 10): Promise<FeedResponse> {
    const authStore = useAuthStore();
    const myUserId = authStore.user?.id;

    const response = await api.get<FeedResponse>("/feed", {
      params: { page, limit: 50 },
    });

    const allPosts = response.data.data || [];
    const myPosts = allPosts.filter((post) => post.authorId === myUserId);

    return {
      ...response.data,
      data: myPosts,
      totalItems: myPosts.length,
    };
  },

  async getLikedPosts(page = 1, limit = 10): Promise<FeedResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [],
          totalItems: 0,
          totalPages: 0,
        });
      }, 300);
    });
  },

  async likePost(postId: string) {
    console.log(`Solicitação de Like para o post: ${postId}`);
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

    if (data.post && data.post.id) {
      return {
        ...data.post,
        authorId: data.authorId,
        communityId: data.communityId,
        authorName: data.authorName,
        communityName: data.communityName,
      } as Post;
    }

    return data;
  },

  async uploadMedia(postId: string, files: File[]): Promise<void> {
    if (!files || files.length === 0) return;

    if (!postId) {
      console.error("Tentativa de upload de mídia sem ID de post válido.");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    await api.post(`/posts/${postId}/medias`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async publishPost(postId: string): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${postId}/publish`);
    return response.data;
  },
};
