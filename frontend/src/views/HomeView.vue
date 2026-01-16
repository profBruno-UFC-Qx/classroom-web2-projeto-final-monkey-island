<template>
  <div class="home-layout min-vh-100 bg-light position-relative">
    
    <ArtifactManager />

    <HomeHero />

    <div class="container pb-5 pt-4">
      <div class="row g-4">
        
        <div class="col-lg-8">
          
          <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
            <i class="bi bi-rss fs-3 text-primary me-3"></i>
            <h4 class="fw-bold text-uppercase m-0 text-dark">
              Feed Principal
            </h4>
          </div>

          <FeedStatusCard @open-create="isCreateModalOpen = true" />

          <div v-if="postStore.isLoading && postStore.posts.length === 0" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted small">atualizando feed...</p>
          </div>

          <div v-else class="d-flex flex-column gap-4">
            
            <div v-if="postStore.posts.length === 0 && !postStore.isLoading" class="text-center py-5 opacity-75 border rounded bg-white">
              <i class="bi bi-chat-square-text fs-1 text-secondary"></i>
              <p class="mt-2 text-muted">nenhuma publicação encontrada.</p>
            </div>

            <transition-group name="list" tag="div" class="d-flex flex-column gap-4">
              <PostCard v-for="post in postStore.posts" :key="post.id" :post="post" />
            </transition-group>

            <div v-if="postStore.page < postStore.totalPages" class="text-center mt-4 mb-5">
              <button 
                @click="postStore.loadMore" 
                class="btn btn-outline-primary rounded-pill px-5 py-2 fw-bold" 
                :disabled="postStore.isLoading"
              >
                <span v-if="postStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ postStore.isLoading ? "carregando..." : "ver mais antigos" }}
              </button>
            </div>
            
            <div v-else-if="postStore.posts.length > 0" class="text-center mt-4 mb-5 text-muted small">
              você chegou ao fim do feed
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <GameWidget />
          <ParkStatusWidget />
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
import { useAuthStore } from "@/stores/authStore";
import { usePostStore } from "@/stores/postStore";

// importação dos componentes visuais
import HomeHero from "@/components/layout/HomeHero.vue";
import ArtifactManager from "@/components/game/ArtifactManager.vue";
import FeedStatusCard from "@/components/feed/FeedStatusCard.vue";
import GameWidget from "@/components/game/GameWidget.vue";
import ParkStatusWidget from "@/components/layout/ParkStatusWidget.vue";
import AuthAlertModal from "@/components/auth/AuthAlertModal.vue";
import CreatePostModal from "@/components/feed/CreatePostModal.vue";
import PostCard from "@/components/feed/PostCard.vue";

// inicializa as stores
const authStore = useAuthStore();
const postStore = usePostStore();

const isCreateModalOpen = ref(false);

// verifica se o usuário tem permissão para postar
const canCreatePost = computed(() => authStore.isAuthenticated && authStore.user?.role === "researcher");

// recarrega a lista do zero quando um post novo é criado
const handlePostCreated = async () => {
  isCreateModalOpen.value = false;
  await postStore.fetchPosts(false);
};

// ao abrir a tela
onMounted(() => {
  // limpa filtros de comunidade para mostrar o feed geral
  postStore.setContext(null);

  // busca posts apenas se a lista estiver vazia
  if (postStore.posts.length === 0) {
    postStore.fetchPosts(false);
  }
});

// se o usuário logar ou deslogar, atualiza o feed
watch(() => authStore.isAuthenticated, () => postStore.fetchPosts(false));
</script>

<style scoped>
/* animação suave para entrada e saída de posts */
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>