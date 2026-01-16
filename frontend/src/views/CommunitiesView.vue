<template>
  <div class="home-layout min-vh-100 bg-concrete">
    
    <CommunitiesHero />

    <div class="container pb-5">
      <div class="row g-4">
        
        <div class="col-lg-8">
          
          <CommunitiesControls 
            v-model="searchQuery"
            :can-create="isResearcher"
            @open-create="openCreateModal"
          />

          <CommunitiesList 
            :communities="communityStore.communities"
            :loading="communityStore.loading"
            :error="communityStore.error"
            @retry="communityStore.fetchPopularCommunities"
            @select="communityStore.selectCommunity"
          />
        </div>

        <div class="col-lg-4">
          <CommunityAside
            v-if="communityStore.selectedCommunity"
            :community="communityStore.selectedCommunity"
            @close="communityStore.clearSelection"
          />
        </div>
      </div>
    </div>

    <img src="/dinossauro-rugido.png" alt="Dino Rugindo" class="dino-rugido" />
    <CreateCommunityModal ref="createModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useCommunityStore } from "../stores/communityStore";

// importação dos componentes organizados
import CommunitiesHero from "../components/community/CommunitiesHero.vue";
import CommunitiesControls from "../components/community/CommunitiesControls.vue";
import CommunitiesList from "../components/community/CommunitiesList.vue";
import CommunityAside from "../components/community/CommunityAside.vue";
import CreateCommunityModal from "../components/community/CreateCommunityModal.vue";

const authStore = useAuthStore();
const communityStore = useCommunityStore();

const searchQuery = ref("");
const createModal = ref();

// verifica permissão
const isResearcher = computed(() => authStore.user?.role === "researcher");

const openCreateModal = () => {
  createModal.value?.open();
};

let timeout: number | undefined;

// busca com debounce (espera o usuário parar de digitar)
watch(searchQuery, (newQuery) => {
  clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    communityStore.searchCommunities(newQuery);
  }, 400);
});

// busca inicial ao montar a tela
onMounted(() => {
  communityStore.fetchPopularCommunities();
});
</script>

<style scoped>
/* estilos globais da view */
.bg-concrete {
  background-color: #1a1a1a;
  background-image: radial-gradient(#2c3e50 1px, transparent 1px);
  background-size: 10px 10px;
}

.home-layout {
  position: relative;
  overflow: hidden;
}

.dino-rugido {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 63%;
  z-index: 0;
  pointer-events: none;
  transform: rotate(20deg);
  height: auto;
  opacity: 0.7;
  filter: drop-shadow(0 0 5px white) drop-shadow(0 0 5px white) drop-shadow(0 0 5px white);
}
</style>