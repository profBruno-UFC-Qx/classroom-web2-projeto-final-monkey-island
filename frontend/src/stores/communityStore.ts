import { defineStore } from 'pinia';
import { ref } from 'vue';
import communityService from '../services/communityService';
import type { Community } from '../types/community';

export const useCommunityStore = defineStore('community', () => {
  const communities = ref<Community[]>([]);
  const selectedCommunity = ref<Community | null>(null);
  const loading = ref(false);
  

  const fetchPopularCommunities = async () => {
    loading.value = true;
    try {
      const response = await communityService.getPopularCommunities();
      communities.value = response.data;
    } catch (error) {
      console.error("Erro ao buscar comunidades populares:", error);
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
      
      if (!response.data || response.data.length === 0) {
         communities.value = [];
      } else {
        communities.value = response.data;
      }
    } catch (error) {
      console.error("Erro na busca:", error);
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
    fetchPopularCommunities,
    searchCommunities,
    selectCommunity,
    clearSelection
  };
});