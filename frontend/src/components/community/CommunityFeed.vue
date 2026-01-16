<template>
  <div>
    <div v-if="isLoading && posts.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted small">carregando discussões...</p>
    </div>

    <div v-else class="d-flex flex-column gap-4">
      <div v-if="posts.length === 0 && !isLoading" class="text-center py-5 bg-white border rounded">
        <i class="bi bi-chat-square-dots fs-1 text-muted"></i>
        <p class="mt-2 text-muted fw-bold">ainda não há publicações aqui.</p>
      </div>

      <transition-group name="list" tag="div" class="d-flex flex-column gap-4">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </transition-group>

      <div v-if="page < totalPages" class="text-center mt-4 mb-5">
        <button 
          @click="$emit('load-more')" 
          class="btn btn-outline-dark rounded-pill px-5 py-2 fw-bold" 
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? "processando..." : "ver mais antigos" }}
        </button>
      </div>

      <div v-else-if="posts.length > 0" class="text-center mt-4 mb-5 text-muted small">
        todas as publicações foram exibidas.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from "../feed/PostCard.vue";

// recebe os dados da store via props do pai
defineProps<{
  posts: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
}>();

// emite pedido para carregar mais posts
defineEmits(['load-more']);
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>