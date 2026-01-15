import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import postService from '../services/postService';
import { useAuthStore } from './authStore';
import type { Post } from '../types/post';

export const usePostStore = defineStore('post', () => {
  const authStore = useAuthStore();

  // Estado
  const posts = ref<Post[]>([]);
  const page = ref(1);
  const totalPages = ref(1);
  const isLoading = ref(false);
  const itemsPerPage = 10;

  // Actions
  const fetchFeed = async (reset = false) => {
    if (isLoading.value && !reset) return; 
    
    isLoading.value = true;
    if (reset) {
      page.value = 1;
      posts.value = [];
    }

    try {
      let response;
      if (authStore.isAuthenticated) {
        response = await postService.getUserFeed(page.value, itemsPerPage);
      } else {
        response = await postService.getPublicFeed(page.value, itemsPerPage);
      }

      const data = response?.data ?? [];
      totalPages.value = response?.totalPages ?? 1;

      if (reset) {
        posts.value = data;
      } else {
        const newPosts = data.filter(
          (newP) => !posts.value.some((existingP) => existingP.id === newP.id)
        );
        posts.value.push(...newPosts);
      }
    } catch (error) {
      console.error("Erro ao buscar feed:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = () => {
    if (page.value < totalPages.value && !isLoading.value) {
      page.value++;
      fetchFeed(false);
    }
  };

  const resetFeed = () => {
    fetchFeed(true);
  };

  return {
    posts,
    page,
    totalPages,
    isLoading,
    fetchFeed,
    loadMore,
    resetFeed
  };
});