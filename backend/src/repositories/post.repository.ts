import { injectable } from "inversify";
import { Post } from "../entities/post";
import { AppDataSource } from "../config/db.connection";

export interface IPostRepository {
  save(post: Post): Promise<Post>;

  findRecentPostsInCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]>;
  findPostById(postId: string): Promise<Post | null>;

  findPostsByAuthorInCommunity(
    authorId: string,
    communityId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]>;

  incrementLikeCount(postId: string): Promise<void>;
  incrementCommentCount(postId: string): Promise<void>;

  decrementLikeCount(postId: string): Promise<void>;
  decrementCommentCount(postId: string): Promise<void>;

  findPublicFeed(skip: number, take: number): Promise<[Post[], number]>;
  findFeedForUser(
    userId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]>;
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
  ): Promise<[Post[], number]> {
    return await this.repo
      .createQueryBuilder("post")
      .distinct(true)
      .innerJoin("post.author", "author")
      .innerJoin("post.community", "community")
      .leftJoin("post.medias", "medias")
      .select([
        "post",
        "community.id",
        "community.name",
        "author.id",
        "author.name",
        "medias",
      ])
      .where("community.id = :communityId", { communityId })
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findPostById(postId: string): Promise<Post | null> {
    return await this.repo
      .createQueryBuilder("post")
      .distinct(true)
      .innerJoin("post.author", "author")
      .innerJoin("post.community", "community")
      .leftJoin("post.medias", "medias")
      .select([
        "post",
        "community.id",
        "community.name",
        "author.id",
        "author.name",
        "medias",
      ])
      .where("post.id = :postId", { postId })
      .getOne();
  }

  async findPostsByAuthorInCommunity(
    authorId: string,
    communityId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]> {
    return await this.repo
      .createQueryBuilder("post")
      .distinct(true)
      .innerJoin("post.author", "author")
      .innerJoin("post.community", "community")
      .leftJoin("post.medias", "medias")
      .select([
        "post",
        "community.id",
        "community.name",
        "author.id",
        "author.name",
        "medias",
      ])
      .where("author.id = :authorId", { authorId })
      .andWhere("community.id = :communityId", { communityId })
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();
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

  async incrementCommentCount(postId: string): Promise<void> {
    await this.repo.increment({ id: postId }, "commentCount", 1);
  }

  async decrementCommentCount(postId: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({
        commentCount: () => "GREATEST(commentCount - 1, 0)",
      })
      .where("id = :postId", { postId })
      .execute();
  }

  async findPublicFeed(skip: number, take: number): Promise<[Post[], number]> {
    return await this.repo
      .createQueryBuilder("post")
      .distinct(true)
      .innerJoin("post.author", "author")
      .innerJoin("post.community", "community")
      .leftJoin("post.medias", "medias")
      .select([
        "post",
        "community.id",
        "community.name",
        "author.id",
        "author.name",
        "medias",
      ])
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findFeedForUser(
    userId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]> {
    return await this.repo
      .createQueryBuilder("post")
      .distinct(true)
      .innerJoin("post.author", "author")
      .innerJoin("post.community", "community")
      .innerJoin("community.members", "member")
      .leftJoin("post.medias", "medias")
      .select([
        "post",
        "community.id",
        "community.name",
        "author.id",
        "author.name",
        "medias",
      ])
      .where("member.user.id = :userId", { userId })
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }
}
