import { injectable } from "inversify";
import { AppDataSource } from "../config/db.connection";
import { Like } from "../entities/like";
import { Post } from "../entities/post";

// Mantemos a interface aqui
export interface ILikeRepository {
  hasUserLikedPost(userId: string, postId: string): Promise<boolean>;
  addLike(userId: string, postId: string): Promise<void>;
  removeLike(userId: string, postId: string): Promise<void>;
  findLikedPostIdsByUser(userId: string): Promise<string[]>;
}

@injectable()
export class LikeRepositoryDB implements ILikeRepository {
  private get repo() {
    return AppDataSource.getRepository(Like);
  }

  // Não precisamos do get postRepo() se usarmos o transactionalEntityManager, 
  // mas não faz mal deixar aqui caso queira usar fora da transação.
  private get postRepo() {
    return AppDataSource.getRepository(Post);
  }

  async hasUserLikedPost(userId: string, postId: string): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });
    return count > 0;
  }

  async addLike(userId: string, postId: string): Promise<void> {
    // Transaction garante consistência: cria o like E incrementa o contador
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // 1. Cria o registro
      const like = new Like();
      like.user = { id: userId } as any; // Cast simples para evitar query extra de user
      like.post = { id: postId } as any;
      
      await transactionalEntityManager.save(Like, like);

      // 2. Incrementa contador
      await transactionalEntityManager.increment(Post, { id: postId }, "likeCount", 1);
    });
  }

  async removeLike(userId: string, postId: string): Promise<void> {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // 1. Remove o registro
      const result = await transactionalEntityManager.delete(Like, {
        user: { id: userId },
        post: { id: postId },
      });

      // 2. Decrementa contador (apenas se deletou algo)
      if (result.affected && result.affected > 0) {
        await transactionalEntityManager.decrement(Post, { id: postId }, "likeCount", 1);
      }
    });
  }

  async findLikedPostIdsByUser(userId: string): Promise<string[]> {
    const likes = await this.repo.find({
      where: { user: { id: userId } },
      select: { post: { id: true } },
      relations: ["post"],
      order: { createdAt: "DESC" }
    });

    return likes.map((like) => like.post.id);
  }
}