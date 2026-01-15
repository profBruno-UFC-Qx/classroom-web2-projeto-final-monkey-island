<template>
  <div class="home-layout min-vh-100 bg-concrete position-relative">
    <ArtifactManager />
    <div class="danger-stripe shadow-sm"><div class="container-fluid py-1"></div></div>
    <HomeHero />

    <div class="container pb-5">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="d-flex align-items-center mb-4 pb-2 border-bottom border-dark-subtle">
            <i class="bi bi-broadcast fs-3 text-danger me-3 animate-pulse"></i>
            <h4 class="fw-black text-uppercase m-0 text-dark-jungle tracking-wide">
              Relatórios de Campo
            </h4>
          </div>

          <FeedStatusCard @open-create="isCreateModalOpen = true" />

          <div v-if="postStore.isLoading && postStore.posts.length === 0" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
            <p class="mt-2 text-muted font-monospace small">Sincronizando feed de dados...</p>
          </div>

          <div v-else class="d-flex flex-column gap-4">
            <div v-if="postStore.posts.length === 0 && !postStore.isLoading" class="text-center py-5 opacity-50 border border-secondary border-dashed rounded-1">
              <i class="bi bi-broadcast-pin fs-1 text-secondary"></i>
              <p class="mt-2 text-uppercase fw-bold text-secondary font-monospace">Nenhum registro encontrado.</p>
            </div>

            <transition-group name="list" tag="div" class="d-flex flex-column gap-4">
              <PostCard v-for="post in postStore.posts" :key="post.id" :post="post" />
            </transition-group>

            <div v-if="postStore.page < postStore.totalPages" class="text-center mt-4 mb-5">
              <button @click="postStore.loadMore" class="btn btn-outline-dark rounded-pill px-5 py-2 fw-bold text-uppercase" :disabled="postStore.isLoading">
                <span v-if="postStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ postStore.isLoading ? "Processando..." : "Carregar Mais" }}
              </button>
            </div>
            
            <div v-else-if="postStore.posts.length > 0" class="text-center mt-4 mb-5 text-muted font-monospace small">
              --- FIM DOS REGISTROS ---
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <GameWidget />
          <ParkStatusWidget />
          <div class="text-center opacity-50 mt-4">
            <i class="bi bi-x-diamond-fill fs-1 text-secondary"></i>
            <p class="x-small text-uppercase fw-bold text-secondary mt-1">InGen Technologies</p>
          </div>
        </div>
      </div>
    </div>

    <AuthAlertModal />
    <CreatePostModal
      v-if="canCreatePost"
      :is-open="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @post-created="handlePostCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useAuthStore } from "../stores/authStore";
import { usePostStore } from "../stores/postStore"; // Nova Store

// Componentes
import HomeHero from "../components/layout/HomeHero.vue";
import ArtifactManager from "../components/widgets/ArtifactManager.vue";
import FeedStatusCard from "../components/feed/FeedStatusCard.vue";
import GameWidget from "../components/widgets/GameWidget.vue";
import ParkStatusWidget from "../components/widgets/ParkStatusWidget.vue";
import AuthAlertModal from "../components/modals/AuthAlertModal.vue";
import CreatePostModal from "../components/modals/CreatePostModal.vue";
import PostCard from "../components/feed/PostCard.vue";

const authStore = useAuthStore();
const postStore = usePostStore();
const isCreateModalOpen = ref(false);

const canCreatePost = computed(() => authStore.isAuthenticated && authStore.user?.role === "researcher");

// Ao criar post, recarrega o feed
const handlePostCreated = async () => {
  isCreateModalOpen.value = false;
  await postStore.fetchFeed(true);
};

// Inicialização
onMounted(() => {
  // Carrega apenas se estiver vazio, para preservar estado ao navegar
  if (postStore.posts.length === 0) {
    postStore.fetchFeed(true);
  }
});

// Se o estado de auth mudar (login/logout), recarrega o feed
watch(() => authStore.isAuthenticated, () => postStore.fetchFeed(true));
</script>

<style scoped>
/* Mantive seus estilos inalterados */
.bg-concrete { background-color: #dcdcdc; background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E"); }
.danger-stripe { background: repeating-linear-gradient(45deg, #ffc107, #ffc107 20px, #1a1a1a 20px, #1a1a1a 40px); border-bottom: 2px solid #000; height: 20px; }
.text-dark-jungle { color: #1a2f2b; }
.fw-black { font-weight: 900; }
.tracking-wide { letter-spacing: 1px; }
.animate-pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(30px); }
.border-dashed { border-style: dashed !important; }
.x-small { font-size: 0.7rem; letter-spacing: 1px; }
</style>