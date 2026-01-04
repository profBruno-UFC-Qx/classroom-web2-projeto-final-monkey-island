import { Post } from "../entities/post";

export interface IPostRepository {
  save(post: Post): Promise<Post>;
  findRecentPostsInAllCommunities(skip: number, take: number): Promise<Post[]>;
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
