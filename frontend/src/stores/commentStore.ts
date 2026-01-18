import { defineStore } from 'pinia';
import { ref } from 'vue';
import commentService from '../services/commentService';
import type { Comment, CreateCommentDto } from '../types/comment';

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([]);
  const isLoading = ref(false);
  
  const isModalOpen = ref(false);
  const targetPostId = ref<string | null>(null);
  const targetParentId = ref<string | null>(null);

  const openCommentModal = (postId: string, parentId: string | null = null) => {
    targetPostId.value = postId;
    targetParentId.value = parentId;
    isModalOpen.value = true;
  };

  const closeCommentModal = () => {
    isModalOpen.value = false;
    targetPostId.value = null;
    targetParentId.value = null;
  };

  const fetchComments = async (postId: string) => {
    isLoading.value = true;
    try {
      comments.value = await commentService.getCommentsByPost(postId);
    } catch (error) {
      console.error('Erro ao buscar comentários', error);
    } finally {
      isLoading.value = false;
    }
  };

  const addComment = async (content: string) => {
    if (!targetPostId.value) return;

    try {
      const payload: CreateCommentDto = {
        content,
        parentId: targetParentId.value || undefined
      };

      await commentService.createComment(targetPostId.value, payload);
      
      await fetchComments(targetPostId.value);
      closeCommentModal();
    } catch (error) {
      console.error('Erro ao criar comentário', error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string, postId: string) => {
    if(!confirm("Confirma a exclusão deste registro?")) return;
    try {
      await commentService.deleteComment(commentId);
      await fetchComments(postId);
    } catch (error) {
      console.error('Erro ao deletar', error);
    }
  };

  return {
    comments,
    isLoading,
    isModalOpen,
    targetParentId,
    openCommentModal,
    closeCommentModal,
    fetchComments,
    addComment,
    deleteComment
  };
});