import { defineStore } from 'pinia';
import { ref } from 'vue';
import postService from '../services/postService';
import { useAuthStore } from './authStore';
import type { Post } from '../types/post';

export const usePostStore = defineStore('post', () => {
  const authStore = useAuthStore();

  const posts = ref<Post[]>([]);
  const page = ref(1);
  const totalPages = ref(1);
  const isLoading = ref(false);
  const currentContextId = ref<string | null>(null); 
  const itemsPerPage = 10;


  const resetStore = () => {
    posts.value = [];
    page.value = 1;
    totalPages.value = 1;
    currentContextId.value = null;
  };


  const setContext = (communityId: string | null) => {
    if (currentContextId.value !== communityId) {
      resetStore();
      currentContextId.value = communityId;
    }
  };


  const fetchPosts = async (loadMoreAction = false) => {
    if (isLoading.value) return;
    if (!loadMoreAction) {
      page.value = 1;
      posts.value = [];
    }

    isLoading.value = true;

    try {
      let response;

      if (currentContextId.value) {
        response = await postService.recentPostsInCommunity(
          currentContextId.value, 
          page.value, 
          itemsPerPage
        );
      } else {
        if (authStore.isAuthenticated) {
          response = await postService.getUserFeed(page.value, itemsPerPage);
        } else {
          response = await postService.getPublicFeed(page.value, itemsPerPage);
        }
      }

      const data = response?.data ?? [];
      totalPages.value = response?.totalPages ?? 1;

      if (!loadMoreAction) {
        posts.value = data;
      } else {
        const newPosts = data.filter(
          (newP) => !posts.value.some((existingP) => existingP.id === newP.id)
        );
        posts.value.push(...newPosts);
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = () => {
    if (page.value < totalPages.value && !isLoading.value) {
      page.value++;
      fetchPosts(true);
    }
  };

  return {
    posts,
    page,
    totalPages,
    isLoading,
    currentContextId,
    setContext,
    fetchPosts,
    loadMore,
    resetStore
  };
});