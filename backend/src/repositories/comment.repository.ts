import { injectable } from "inversify";
import { CommentMemory } from "../entities/comment.memory";

export interface ICommentRepository {
  save(comment: CommentMemory): Promise<CommentMemory>;
  findById(id: string): Promise<CommentMemory | undefined>;
  delete(id: string): Promise<void>;
  findAllByPostId(postId: string): Promise<CommentMemory[]>;
}

@injectable()
export class CommentRepositoryInMemory implements ICommentRepository {
  // Armazenamento em RAM
  private comments: CommentMemory[] = [];

  async save(comment: CommentMemory): Promise<CommentMemory> {
    // Se já existe, atualiza (não usaremos update por enquanto, mas é boa prática)
    const index = this.comments.findIndex((c) => c.id === comment.id);
    if (index >= 0) {
      this.comments[index] = comment;
    } else {
      this.comments.push(comment);
    }
    return comment;
  }

  async findById(id: string): Promise<CommentMemory | undefined> {
    return this.comments.find((c) => c.id === id);
  }

  async delete(id: string): Promise<void> {
    // Filtra removendo o item com o ID especificado
    // Nota: Em uma implementação real recursiva, deveríamos apagar os filhos também.
    // Aqui faremos a remoção simples.
    this.comments = this.comments.filter((c) => c.id !== id && c.parentId !== id);
  }

  async findAllByPostId(postId: string): Promise<CommentMemory[]> {
    return this.comments.filter((c) => c.postId === postId);
  }
}