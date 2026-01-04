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
}
