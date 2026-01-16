import { defineStore } from 'pinia';
import { ref } from 'vue';
import postService from '@/services/postService';
import { useAuthStore } from '@/stores/authStore';
import type { Post } from '@/types/post';

// interface simples para os itens do ranking
export interface RankItem {
  id: string;
  name: string;
  count: number;
}

export const usePostStore = defineStore('post', () => {
  const authStore = useAuthStore();

  // --- Estados do Feed (Existentes) ---
  const posts = ref<Post[]>([]);
  const page = ref(1);
  const totalPages = ref(1);
  const isLoading = ref(false);
  const currentContextId = ref<string | null>(null);
  const itemsPerPage = 10;

  // --- Novos Estados para o Ranking ---
  const topUsers = ref<RankItem[]>([]);
  const topCommunities = ref<RankItem[]>([]);
  const loadingRankings = ref(false);
  const analyzedCount = ref(0);

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

  // --- Nova Ação: Buscar e Calcular Rankings ---
  const fetchRankings = async () => {
    try {
      loadingRankings.value = true;
      
      // Busca uma amostra maior (200 posts) para análise estatística
      const response = await postService.getPublicFeed(1, 200);
      const postsData = response.data || [];
      analyzedCount.value = postsData.length;

      const userMap = new Map<string, RankItem>();
      const commMap = new Map<string, RankItem>();

      postsData.forEach(post => {
        // Contabiliza Usuários
        if (post.authorId && post.authorName) {
          const curr = userMap.get(post.authorId) || { id: post.authorId, name: post.authorName, count: 0 };
          curr.count++;
          userMap.set(post.authorId, curr);
        }
        // Contabiliza Comunidades
        if (post.communityId && post.communityName) {
          const curr = commMap.get(post.communityId) || { id: post.communityId, name: post.communityName, count: 0 };
          curr.count++;
          commMap.set(post.communityId, curr);
        }
      });

      // Ordena e pega os top 10
      topUsers.value = [...userMap.values()].sort((a, b) => b.count - a.count).slice(0, 10);
      topCommunities.value = [...commMap.values()].sort((a, b) => b.count - a.count).slice(0, 10);

    } catch (error) {
      console.error("Erro ao calcular rankings:", error);
    } finally {
      loadingRankings.value = false;
    }
  };

  return {
    // Feed
    posts,
    page,
    totalPages,
    isLoading,
    currentContextId,
    setContext,
    fetchPosts,
    loadMore,
    resetStore,
    
    // Rankings (Novos)
    topUsers,
    topCommunities,
    loadingRankings,
    analyzedCount,
    fetchRankings
  };
});