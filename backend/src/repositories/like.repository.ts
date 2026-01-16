import { injectable } from "inversify";

export interface ILikeRepository {
  hasUserLikedPost(userId: string, postId: string): Promise<boolean>;
  addLike(userId: string, postId: string): Promise<void>;
  removeLike(userId: string, postId: string): Promise<void>;
}

@injectable()
export class LikeRepositoryInMemory implements ILikeRepository {
  // Simula o banco de dados: Armazena strings "userId:postId"
  private likesStore: Set<string> = new Set();

  async hasUserLikedPost(userId: string, postId: string): Promise<boolean> {
    const key = `${userId}:${postId}`;
    return this.likesStore.has(key);
  }

  async addLike(userId: string, postId: string): Promise<void> {
    const key = `${userId}:${postId}`;
    this.likesStore.add(key);
    console.log(`[MOCK DB] Like added: ${key}`);
  }

  async removeLike(userId: string, postId: string): Promise<void> {
    const key = `${userId}:${postId}`;
    this.likesStore.delete(key);
    console.log(`[MOCK DB] Like removed: ${key}`);
  }
}