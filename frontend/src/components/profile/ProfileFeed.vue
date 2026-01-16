<template>
  <div class="profile-feed-section mt-5">
    
    <div class="d-flex justify-content-center gap-4 mb-4 border-bottom border-secondary pb-3">
      
      <button 
        @click="switchTab('posts')" 
        class="btn btn-icon-tab position-relative"
        :class="{ 'active': activeTab === 'posts' }"
        title="Meus Registros"
      >
        <i class="bi bi-file-earmark-text-fill fs-3"></i>
        <span v-if="activeTab === 'posts'" class="active-indicator"></span>
      </button>

      <button 
        @click="switchTab('likes')" 
        class="btn btn-icon-tab position-relative"
        :class="{ 'active': activeTab === 'likes' }"
        title="Registros Favoritados"
      >
        <i class="bi bi-heart-fill fs-3"></i>
        <span v-if="activeTab === 'likes'" class="active-indicator"></span>
      </button>

    </div>

    <div class="feed-content">
      
      <div v-if="loading && posts.length === 0" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted font-monospace small">Carregando dados...</p>
      </div>

      <div v-else-if="posts.length === 0 && !loading" class="text-center py-5 opacity-50">
        <i class="bi fs-1 text-secondary" :class="activeTab === 'posts' ? 'bi-file-earmark-x' : 'bi-heart-break'"></i>
        <h5 class="mt-3 text-uppercase fw-bold text-secondary">
          {{ activeTab === 'posts' ? 'Nenhum registro encontrado' : 'Nenhuma curtida registrada' }}
        </h5>
        <p class="small text-muted">
          {{ activeTab === 'posts' ? 'Publique suas descobertas nas comunidades.' : 'O sistema de curtidas ainda não foi indexado.' }}
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
            {{ loading ? 'Buscando...' : 'Carregar Mais' }}
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

const activeTab = ref<'posts' | 'likes'>('posts');
const posts = ref<Post[]>([]);
const loading = ref(false);

// Controle de Paginação
const page = ref(1);
const totalPages = ref(1);

/**
 * Carrega o feed.
 * @param reset Se true, limpa a lista atual e volta para a página 1.
 */
const loadFeed = async (reset = false) => {
  if (loading.value) return; // Evita chamadas duplicadas
  
  loading.value = true;

  if (reset) {
    page.value = 1;
    posts.value = [];
  }
  
  try {
    let response;
    
    // Chama o serviço passando a página atual
    if (activeTab.value === 'posts') {
      response = await postService.getMyPosts(page.value);
    } else {
      response = await postService.getLikedPosts(page.value);
    }
    
    const newPosts = response.data || [];

    if (reset) {
      posts.value = newPosts;
    } else {
      // Adiciona novos posts evitando duplicatas (segurança extra)
      const uniqueNewPosts = newPosts.filter(
        (np) => !posts.value.some((ep) => ep.id === np.id)
      );
      posts.value.push(...uniqueNewPosts);
    }

    // Atualiza o total de páginas vindo do backend
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
    loadFeed(false); // false = append mode
  }
};

const switchTab = (tab: 'posts' | 'likes') => {
  if (activeTab.value !== tab) {
    activeTab.value = tab;
    loadFeed(true); // true = reset mode
  }
};

onMounted(() => {
  loadFeed(true);
});
</script>

<style scoped>
.btn-icon-tab {
  background: transparent;
  border: none;
  color: #6c757d;
  padding: 10px 20px;
  transition: all 0.3s ease;
  position: relative;
}

.btn-icon-tab:hover {
  color: #adb5bd;
  transform: translateY(-2px);
}

.btn-icon-tab.active {
  color: #ffb400;
}

.active-indicator {
  position: absolute;
  bottom: -17px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 3px;
  background-color: #ffb400;
  box-shadow: 0 -2px 10px rgba(255, 180, 0, 0.5);
}

.tracking-wide {
  letter-spacing: 1px;
}
</style>