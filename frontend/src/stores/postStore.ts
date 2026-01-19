import { defineStore } from 'pinia';
import { ref } from 'vue';
import postService from '@/services/postService';
import { useAuthStore } from '@/stores/authStore';
import type { Post } from '@/types/post';

// Interface simples para os itens do ranking
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

  // --- Actions do Feed ---

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
        // Evita duplicatas ao carregar mais
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

  // --- Nova Action: Curtir / Descurtir (Corrigida) ---
  const toggleLike = async (postId: string) => {
    try {
      // 1. Chamada ao backend
      const response = await postService.toggleLike(postId);
      
      // 2. Atualiza o estado local do post específico
      // Procura o item na lista. O ID pode estar em 'p.id' ou em 'p.post.id' dependendo do endpoint
      const postItem = posts.value.find((p: any) => {
        const actualId = p.post?.id || p.id;
        return actualId === postId;
      });

      if (postItem) {
        // Define qual objeto vai receber a atualização (o wrapper ou o objeto direto)
        const target = (postItem as any).post ? (postItem as any).post : postItem;

        // Atualiza os valores reativamente
        target.likeCount = response.newLikeCount;
        target.userHasLiked = response.liked;
      }
    } catch (error) {
      console.error("Erro ao curtir post:", error);
      // Aqui você poderia adicionar uma notificação de erro visual
    }
  };

  // --- Nova Action: Buscar e Calcular Rankings ---
  const fetchRankings = async () => {
    try {
      loadingRankings.value = true;
      
      // Busca uma amostra maior (200 posts) para análise estatística
      const response = await postService.getPublicFeed(1, 200);
      const postsData = response.data || [];
      analyzedCount.value = postsData.length;

      const userMap = new Map<string, RankItem>();
      const commMap = new Map<string, RankItem>();

      postsData.forEach((item: any) => {
        // Normaliza o acesso aos dados, verificando dentro do objeto 'post' (novo formato do back)
        // e também na raiz (formato legado/fallback)
        const p = item.post || {};

        const authorId = item.authorId || p.authorId || p.author?.id;
        const authorName = p.authorName || item.authorName || p.author?.name;

        const communityId = item.communityId || p.communityId || p.community?.id;
        const communityName = p.communityName || item.communityName || p.community?.name;

        // Contabiliza Usuários
        if (authorId && authorName) {
          const curr = userMap.get(authorId) || { id: authorId, name: authorName, count: 0 };
          curr.count++;
          userMap.set(authorId, curr);
        }
        // Contabiliza Comunidades
        if (communityId && communityName) {
          const curr = commMap.get(communityId) || { id: communityId, name: communityName, count: 0 };
          curr.count++;
          commMap.set(communityId, curr);
        }
      });

      // Ordena por contagem (maior para menor) e pega os top 10
      topUsers.value = [...userMap.values()].sort((a, b) => b.count - a.count).slice(0, 10);
      topCommunities.value = [...commMap.values()].sort((a, b) => b.count - a.count).slice(0, 10);

    } catch (error) {
      console.error("Erro ao calcular rankings:", error);
    } finally {
      loadingRankings.value = false;
    }
  };

  return {
    posts,
    page,
    totalPages,
    isLoading,
    currentContextId,
    topUsers,
    topCommunities,
    loadingRankings,
    analyzedCount,
    setContext,
    fetchPosts,
    loadMore,
    resetStore,
    toggleLike,
    fetchRankings  
  };
});