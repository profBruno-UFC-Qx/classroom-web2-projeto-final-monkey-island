import { defineStore } from 'pinia';
import { ref } from 'vue';
import communityService from '../services/communityService';
import type { Community } from '../types/community';

export const useCommunityStore = defineStore('community', () => {
  const communities = ref<Community[]>([]);
  const selectedCommunity = ref<Community | null>(null); // Usado para o modal e para a View
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchPopularCommunities = async () => {
    loading.value = true;
    try {
      const response = await communityService.getPopularCommunities();
      communities.value = response.data;
    } catch (err) {
      console.error("Erro ao buscar comunidades populares:", err);
    } finally {
      loading.value = false;
    }
  };

  const searchCommunities = async (query: string) => {
    loading.value = true;
    try {
      if (!query.trim()) {
        await fetchPopularCommunities();
        return;
      }
      const response = await communityService.searchCommunitiesByName(query, 1, 20);
      communities.value = response.data || [];
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      loading.value = false;
    }
  };

  // NOVA ACTION: Busca comunidade específica
  const fetchActiveCommunity = async (id: string) => {
    loading.value = true;
    selectedCommunity.value = null; 
    try {
      const res = await communityService.getCommunityById(id);
      selectedCommunity.value = res;
    } catch (err) {
      console.error("Erro ao buscar comunidade:", err);
      error.value = "Não foi possível carregar a comunidade.";
    } finally {
      loading.value = false;
    }
  };

  const selectCommunity = (community: Community) => {
    selectedCommunity.value = community;
  };

  const clearSelection = () => {
    selectedCommunity.value = null;
  };

  return {
    communities,
    selectedCommunity,
    loading,
    error,
    fetchPopularCommunities,
    searchCommunities,
    fetchActiveCommunity,
    selectCommunity,
    clearSelection
  };
});