<template>
  <div class="profile-feed-section mt-5">
    
    <div class="d-flex justify-content-center align-items-center mb-4 border-bottom border-secondary pb-3">
      <h5 class="text-uppercase fw-bold text-secondary m-0">
        <i class="bi bi-file-earmark-text-fill text-warning me-2"></i>
        Meus Registros
      </h5>
    </div>

    <div class="feed-content">
      
      <div v-if="loading && posts.length === 0" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted font-monospace small">Acessando arquivos...</p>
      </div>

      <div v-else-if="posts.length === 0 && !loading" class="text-center py-5 opacity-50">
        <i class="bi bi-folder-x fs-1 text-secondary"></i>
        <h5 class="mt-3 text-uppercase fw-bold text-secondary">
          Nenhum registro encontrado
        </h5>
        <p class="small text-muted">
          Publique suas descobertas nas comunidades para vê-las aqui.
        </p>
      </div>

      <div v-else>
        <div class="row justify-content-center">
          <div class="col-12" v-for="post in posts" :key="post.id">
            <PostCard :post="post" />
          </div>
        </div>

        <div v-if="page < totalPages" class="text-center mt-4 mb-5">
          <button 
            @click="loadMore" 
            class="btn btn-outline-dark rounded-pill px-5 py-2 fw-bold text-uppercase tracking-wide"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Buscando...' : 'Carregar Mais Arquivos' }}
          </button>
        </div>
        
        <div v-else-if="posts.length > 0" class="text-center mt-4 mb-5 text-muted font-monospace small">
          --- FIM DO ARQUIVO ---
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PostCard from '@/components/feed/PostCard.vue';
import postService from '@/services/postService';
import type { Post } from '@/types/post';

// Estado simplificado (apenas posts)
const posts = ref<Post[]>([]);
const loading = ref(false);

// Controle de Paginação
const page = ref(1);
const totalPages = ref(1);

/**
 * Carrega o feed apenas dos posts do usuário.
 * @param reset Se true, limpa a lista atual e volta para a página 1.
 */
const loadFeed = async (reset = false) => {
  if (loading.value) return;
  
  loading.value = true;

  if (reset) {
    page.value = 1;
    posts.value = [];
  }
  
  try {
    // Chama apenas o serviço de "Meus Posts"
    const response = await postService.getMyPosts(page.value);
    
    const newPosts = response.data || [];

    if (reset) {
      posts.value = newPosts;
    } else {
      // Evita duplicatas na paginação
      const uniqueNewPosts = newPosts.filter(
        (np) => !posts.value.some((ep) => ep.id === np.id)
      );
      posts.value.push(...uniqueNewPosts);
    }

    totalPages.value = response.totalPages;

  } catch (error) {
    console.error("Erro ao carregar feed do perfil:", error);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (page.value < totalPages.value) {
    page.value++;
    loadFeed(false);
  }
};

onMounted(() => {
  loadFeed(true);
});
</script>

<style scoped>
.tracking-wide {
  letter-spacing: 1px;
}
</style>