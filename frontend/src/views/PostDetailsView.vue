<template>
  <div class="container py-4">
    <div class="mb-3">
      <button @click="goBack" class="btn btn-outline-secondary btn-sm text-uppercase fw-bold">
        <i class="bi bi-arrow-left"></i> Voltar ao Feed
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted font-monospace">ACCESSING ARCHIVES...</p>
    </div>

    <div v-else>
      <div v-if="post" class="mb-5">
        <PostCard :post="post" :is-detail-view="true" />
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4 border-bottom border-dark pb-2">
        <h4 class="text-uppercase fw-black text-dark-jungle mb-0">
          <i class="bi bi-chat-square-dots-fill text-warning me-2"></i>
          Registros & Observações
        </h4>
        <button 
          @click="openRootCommentModal" 
          class="btn btn-dark btn-sm text-warning text-uppercase fw-bold"
        >
          <i class="bi bi-plus-lg"></i> Adicionar Registro
        </button>
      </div>

      <div class="comments-section">
        <div v-if="commentStore.comments.length === 0" class="alert alert-light text-center border-dashed">
          <span class="text-muted fst-italic">Nenhum registro encontrado para este arquivo.</span>
        </div>

        <div v-else class="d-flex flex-column gap-3">
          <CommentItem 
            v-for="comment in commentStore.comments" 
            :key="comment.id" 
            :comment="comment"
            :post-id="postId"
          />
        </div>
      </div>
    </div>

    <CreateCommentModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '../stores/postStore';
import { useCommentStore } from '../stores/commentStore';
import PostCard from '../components/feed/PostCard.vue';
import CommentItem from '../components/comment/CommentItem.vue';
import CreateCommentModal from '../components/comment/CreateCommentModal.vue';
import postService from '../services/postService'; // Para buscar 1 post especifico

const route = useRoute();
const router = useRouter();
const postStore = usePostStore(); // Para ações gerais
const commentStore = useCommentStore();

const postId = computed(() => route.params.id as string);
const post = ref<any>(null);
const isLoading = ref(true);

onMounted(async () => {
  if (!postId.value) return;

  try {
    // 1. Busca detalhes do post
    const postData = await postService.getPostById(postId.value);
    post.value = postData; // Ajuste conforme o retorno exato do seu DTO

    // 2. Busca comentários
    await commentStore.fetchComments(postId.value);
  } catch (error) {
    console.error("Erro ao carregar detalhes", error);
    alert("Post não encontrado ou acesso negado.");
    router.push('/feed');
  } finally {
    isLoading.value = false;
  }
});

const openRootCommentModal = () => {
  commentStore.openCommentModal(postId.value, null);
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.text-dark-jungle { color: #1a2f2b; }
.fw-black { font-weight: 900; }
.border-dashed { border: 1px dashed #ccc; }
</style>