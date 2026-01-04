import { injectable } from "inversify";
import { Post } from "../entities/post";
import { AppDataSource } from "../config/db.connection";

export interface IPostRepository {
  save(post: Post): Promise<Post>;

  findRecentPostsInCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<Post[]>;
  findPostById(postId: string): Promise<Post | null>;

  findPostsByAuthorInCommunity(
    authorId: string,
    communityId: string,
    skip: number,
    take: number
  ): Promise<Post[]>;

  incrementLikeCount(postId: string): Promise<void>;
  incrementCommentCount(postId: string): Promise<void>;

  decrementLikeCount(postId: string): Promise<void>;
  decrementCommentCount(postId: string): Promise<void>;

  findPublicFeed(skip: number, take: number): Promise<Post[]>;
  findFeedForUser(userId: string, skip: number, take: number): Promise<Post[]>;
}

@injectable()
export class PostRepositoryDB implements IPostRepository {
  private get repo() {
    return AppDataSource.getRepository(Post);
  }

  async save(post: Post): Promise<Post> {
    return await this.repo.save(post);
  }

  async findRecentPostsInCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<Post[]> {
    return await this.repo
      .createQueryBuilder("post")
      .innerJoin("post.author", "author")
      .innerJoin("post.community", "community")
      .select([
        "post",
        "community.id",
        "community.name",
        "author.id",
        "author.name",
      ])
      .where("community.id = :communityId", { communityId })
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findPostById(postId: string): Promise<Post | null> {
    return await this.repo
      .createQueryBuilder("post")
      .innerJoin("post.author", "author")
      .innerJoin("post.community", "community")
      .select([
        "post",
        "community.id",
        "community.name",
        "author.id",
        "author.name",
      ])
      .where("post.id = :postId", { postId })
      .getOne();
  }

  async findPostsByAuthorInCommunity(
    authorId: string,
    communityId: string,
    skip: number,
    take: number
  ): Promise<Post[]> {
    return await this.repo
      .createQueryBuilder("post")
      .innerJoin("post.author", "author")
      .innerJoin("post.community", "community")
      .select([
        "post",
        "community.id",
        "community.name",
        "author.id",
        "author.name",
      ])
      .where("author.id = :authorId", { authorId })
      .andWhere("community.id = :communityId", { communityId })
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getMany();
  }

  async incrementLikeCount(postId: string): Promise<void> {
    await this.repo.increment({ id: postId }, "likeCount", 1);
  }

  async decrementLikeCount(postId: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({
        likeCount: () => "GREATEST(likeCount - 1, 0)",
      })
      .where("id = :postId", { postId })
      .execute();
  }
}
