import api from "@/api/api";
import { useAuthStore } from "@/stores/authStore";
import type { Post, PostMedia, FeedResponse, LikeToggleResponse, PostResponse } from "@/types/post";

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

    const response = await api.get<FeedResponse>("/feed", {
      params: { page, limit: 50 },
    });

    const allPosts = response.data.data || [];
    const myPosts = allPosts.filter((post) => {
      const authorId = post.author?.id || post.authorId;
      return authorId === myUserId;
    });

    return {
      ...response.data,
      data: myPosts,
      totalItems: myPosts.length,
    };
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