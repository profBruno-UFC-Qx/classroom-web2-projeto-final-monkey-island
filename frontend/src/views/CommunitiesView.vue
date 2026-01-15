<template>
  <div class="home-layout min-vh-100 bg-concrete">
    <header class="hero-section py-5 mb-5 shadow-lg position-relative">
      <div class="overlay-grid"></div>
      <div class="container position-relative z-1 text-center">
        <div
          class="d-inline-block border border-warning border-3 p-4 bg-dark-transparent backdrop-blur rounded-1"
        >
          <h1
            class="display-5 fw-black text-warning text-uppercase mb-0 tracking-widest text-shadow"
          >
            <i class="bi bi-diagram-3-fill me-3"></i>Comunidades
          </h1>
          <div class="mt-2">
            <span class="text-light-fossil font-monospace small text-uppercase"
              >Rede de Pesquisadores</span
            >
          </div>
        </div>
      </div>
    </header>

    <div class="container pb-5">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <input
              v-model="searchQuery"
              class="form-control w-50 search-input"
              placeholder="Buscar comunidade..."
            />

            <button
              v-if="isResearcher"
              class="btn btn-dark fw-black btn-terminal"
              @click="openCreateModal"
            >
              <i class="bi bi-plus-circle me-2 text-warning"></i>Criar
              Comunidade
            </button>
          </div>

          <div v-if="communityStore.loading" class="text-center py-5">
            <div class="spinner-border text-warning mb-3" role="status"></div>
            <p class="text-light-fossil font-monospace small blink-text">
              SINCRONIZANDO COMUNIDADES...
            </p>
          </div>

          <div
            v-else-if="communityStore.communities.length === 0"
            class="text-center py-5 opacity-50"
          >
            <i class="bi bi-diagram-2 display-1 text-secondary"></i>
            <h5 class="mt-3 text-uppercase fw-bold text-secondary">
              Nenhuma comunidade
            </h5>
            <p class="small text-muted">
              Não há comunidades correspondentes à sua pesquisa.
            </p>
          </div>

          <div v-else class="communities-list d-flex flex-column gap-3">
            <CommunityCard
              v-for="community in communityStore.communities"
              :key="community.id"
              :community="community"
              @select="communityStore.selectCommunity"
            />
          </div>
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
import { useCommunityStore } from "../stores/communityStore"; // Nova Store

import CommunityAside from "../components/community/CommunityAside.vue";
import CommunityCard from "@/components/community/CommunityCard.vue";
import CreateCommunityModal from "../components/community/CreateCommunityModal.vue";

const authStore = useAuthStore();
const communityStore = useCommunityStore();

const searchQuery = ref("");
const createModal = ref();

const isResearcher = computed(() => authStore.user?.role === "researcher");

const openCreateModal = () => {
  createModal.value?.open();
};

let timeout: number | undefined;

// Watcher para Debounce: Só chama a store após o usuário parar de digitar
watch(searchQuery, (newQuery) => {
  clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    communityStore.searchCommunities(newQuery);
  }, 400);
});

// Inicialização via Store
onMounted(() => {
  communityStore.fetchPopularCommunities();
});
</script>

<style scoped>
.bg-concrete {
  background-color: #1a1a1a;
  background-image: radial-gradient(#2c3e50 1px, transparent 1px);
  background-size: 10px 10px;
}
.fw-black {
  font-weight: 900;
}
.x-small {
  font-size: 0.7rem;
  letter-spacing: 1px;
}
.text-light-fossil {
  color: #e8e2d9;
}
.fossil-card {
  border-radius: 2px;
  border-width: 2px;
}
.community-card {
  transition: all 0.2s ease;
  border-left: 3px solid #ffc107;
}
.community-card:hover {
  transform: translateX(5px);
  border-color: #fff !important;
  background-color: #212529;
}
.btn-terminal {
  transition: all 0.3s;
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
  pointer-events: none;
  opacity: 0.7;
  filter: drop-shadow(0 0 5px white) drop-shadow(0 0 5px white)
    drop-shadow(0 0 5px white);
}

.communities-list {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
}

.communities-list::-webkit-scrollbar {
  width: 8px;
}

.communities-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffc107, #ffea70);
  border-radius: 4px;
  border: 2px solid #1a2f2b;
}

.communities-list::-webkit-scrollbar-track {
  background: rgba(26, 47, 43, 0.8);
  border-radius: 4px;
}

.btn-terminal:hover {
  background-color: #1a1a1a;
  border-color: #ffc107;
  color: #ffc107;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}
.blink-text {
  animation: blink 1.5s infinite;
}

.search-input {
  background-color: rgba(26, 47, 43, 0.8);
  border: 2px solid #ffc107;
  color: #e8e2d9;
  font-family: "Courier New", monospace;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 2px;
  outline: none;
  transition: all 0.3s;
}

.search-input::placeholder {
  color: #e8e2d9;
  opacity: 0.7;
}

.search-input:focus {
  background-color: rgba(26, 47, 43, 1);
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>