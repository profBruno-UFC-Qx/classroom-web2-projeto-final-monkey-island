export class CommentMemory {
  id: string;
  userId: string;
  postId: string;
  parentId: string | null; // Para aninhamento (respostas)
  content: string;
  createdAt: Date;
  replies: CommentMemory[]; // Para exibir aninhado

  constructor() {
    this.replies = [];
  }
}