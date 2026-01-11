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
      
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted font-monospace small">Carregando dados...</p>
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-5 opacity-50">
        <i class="bi fs-1 text-secondary" :class="activeTab === 'posts' ? 'bi-file-earmark-x' : 'bi-heart-break'"></i>
        <h5 class="mt-3 text-uppercase fw-bold text-secondary">
          {{ activeTab === 'posts' ? 'Nenhum registro encontrado' : 'Nenhuma curtida registrada' }}
        </h5>
        <p class="small text-muted">
          {{ activeTab === 'posts' ? 'Publique suas descobertas nas comunidades.' : 'O sistema de curtidas ainda não foi indexado.' }}
        </p>
      </div>

      <div v-else class="row justify-content-center">
        <div class="col-12" v-for="post in posts" :key="post.id">
          <PostCard :post="post" />
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import PostCard from '../feed/PostCard.vue'; // Certifique-se que o caminho está correto
import postService from '../../services/postService';
import type { Post } from '../../types/post';

const activeTab = ref<'posts' | 'likes'>('posts');
const posts = ref<Post[]>([]);
const loading = ref(false);

const loadFeed = async () => {
  loading.value = true;
  posts.value = []; // Limpa lista atual
  
  try {
    let response;
    if (activeTab.value === 'posts') {
      response = await postService.getMyPosts();
    } else {
      response = await postService.getLikedPosts();
    }
    posts.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar feed do perfil:", error);
  } finally {
    loading.value = false;
  }
};

const switchTab = (tab: 'posts' | 'likes') => {
  if (activeTab.value !== tab) {
    activeTab.value = tab;
    loadFeed();
  }
};

onMounted(() => {
  loadFeed();
});
</script>

<style scoped>
.btn-icon-tab {
  background: transparent;
  border: none;
  color: #6c757d; /* Cinza */
  padding: 10px 20px;
  transition: all 0.3s ease;
  position: relative;
}

.btn-icon-tab:hover {
  color: #adb5bd;
  transform: translateY(-2px);
}

.btn-icon-tab.active {
  color: #ffb400; /* Amarelo InGen */
}

/* Indicador (traço embaixo do ícone) */
.active-indicator {
  position: absolute;
  bottom: -17px; /* Alinha com a borda do container pai */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 3px;
  background-color: #ffb400;
  box-shadow: 0 -2px 10px rgba(255, 180, 0, 0.5);
}

/* Ajuste específico para a aba de Likes (pode ser vermelho se preferir) */
.btn-icon-tab.active i.bi-heart-fill {
  /* Se quiser diferenciar a cor da curtida: color: #dc3545; */
}
</style>