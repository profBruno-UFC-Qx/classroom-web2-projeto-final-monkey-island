import api from '../api/api';
import type { Comment, CreateCommentDto } from '../types/comment';

export default {
  async getCommentsByPost(postId: string): Promise<Comment[]> {
    const { data } = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return data;
  },

  async createComment(postId: string, payload: CreateCommentDto): Promise<Comment> {
    const { data } = await api.post<Comment>(`/posts/${postId}/comments`, payload);
    return data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  }
};