export interface CreateCommentDto {
  content: string;
  parentId?: string; // Opcional: se enviado, é uma resposta a outro comentário
}