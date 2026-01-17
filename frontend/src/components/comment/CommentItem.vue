<template>
  <div class="comment-wrapper">
    <div class="comment-card mb-2 p-3 border-start border-4 border-warning bg-white shadow-sm position-relative">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <span class="fw-bold text-dark-jungle me-2">
            {{ comment.author?.name || 'Funcionário Desconhecido' }}
          </span>
          <span class="text-muted x-small font-monospace">
            {{ formatDate(comment.createdAt) }}
          </span>
        </div>
        
        <div class="actions">
          <button 
            @click="handleReply"
            class="btn btn-link text-decoration-none p-0 me-3 text-secondary x-small fw-bold text-uppercase"
          >
            <i class="bi bi-reply-fill"></i> Responder
          </button>
          
          <button 
            v-if="canDelete"
            @click="handleDelete"
            class="btn btn-link text-decoration-none p-0 text-danger x-small"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <p class="mb-0 text-secondary" style="font-size: 0.9rem; white-space: pre-wrap;">
        {{ comment.content }}
      </p>
    </div>

    <div v-if="comment.replies && comment.replies.length > 0" class="replies-container ms-4 ps-2 border-start border-secondary-subtle">
      <CommentItem 
        v-for="reply in comment.replies" 
        :key="reply.id" 
        :comment="reply"
        :post-id="postId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Comment } from '../../types/comment';
import { formatDate } from '../../utils/formatters';
import { useCommentStore } from '../../stores/commentStore';
import { useAuthStore } from '../../stores/authStore';

const props = defineProps<{
  comment: Comment;
  postId: string;
}>();

const commentStore = useCommentStore();
const authStore = useAuthStore();

// Verifica se o usuário atual é o dono para poder deletar
const canDelete = computed(() => {
  return authStore.user?.id === props.comment.userId; // Ajuste conforme seu AuthStore
});

const handleReply = () => {
  commentStore.openCommentModal(props.postId, props.comment.id);
};

const handleDelete = () => {
  commentStore.deleteComment(props.comment.id, props.postId);
};
</script>

<style scoped>
.text-dark-jungle { color: #1a2f2b; }
.x-small { font-size: 0.75rem; }
.comment-card { border-radius: 0 4px 4px 0; transition: background-color 0.2s; }
.comment-card:hover { background-color: #fcfcfc; }
</style>