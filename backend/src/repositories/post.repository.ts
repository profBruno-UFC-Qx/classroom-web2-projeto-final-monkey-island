import { injectable } from "inversify";
import { Post, PostStatus } from "../entities/post";
import { AppDataSource } from "../config/db.connection";
import { CommunityUserStatus } from "../entities/community.user";

export interface IPostRepository {
  save(post: Post): Promise<Post>;

  findRecentPostsInCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]>;
  
  findPostById(postId: string): Promise<Post | null>;
  postExistsById(postId: string): Promise<boolean>;

  findPostsByAuthorInCommunity(
    authorId: string,
    communityId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]>;

  // Método essencial para o Feed do Perfil (Meus Posts)
  findAllByUserId(
    userId: string, 
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

  async postExistsById(postId: string): Promise<boolean> {
    return await this.repo.existsBy({ id: postId });
  }

  async findRecentPostsInCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]> {
    return await this.repo
      .createQueryBuilder("post")
      // leftJoinAndSelect garante que o objeto venha completo (com nome, avatar, etc)
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.medias", "medias") // Importante para as imagens aparecerem
      .where("community.id = :communityId", { communityId })
      .andWhere("post.status = :postStatus", {
        postStatus: PostStatus.PUBLISHED,
      })
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findPostById(postId: string): Promise<Post | null> {
    return await this.repo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.medias", "medias")
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
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.medias", "medias")
      .where("author.id = :authorId", { authorId })
      .andWhere("community.id = :communityId", { communityId })
      .andWhere("post.status = :postStatus", {
        postStatus: PostStatus.PUBLISHED,
      })
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findAllByUserId(
    userId: string,
    skip: number,
    take: number
  ): Promise<[Post[], number]> {
    return await this.repo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.medias", "medias")
      .where("author.id = :userId", { userId })
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
        likeCount: () =>
          "CASE WHEN likeCount > 0 THEN likeCount - 1 ELSE 0 END",
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
        commentCount: () =>
          "CASE WHEN commentCount > 0 THEN commentCount - 1 ELSE 0 END",
      })
      .where("id = :postId", { postId })
      .execute();
  }

  async findPublicFeed(skip: number, take: number): Promise<[Post[], number]> {
    return await this.repo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.medias", "medias")
      .where("post.status = :postStatus", { postStatus: PostStatus.PUBLISHED })
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
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.medias", "medias")
      // Join interno apenas para filtrar posts das comunidades que sigo
      .innerJoin("community.members", "member")
      .where("member.user.id = :userId", { userId })
      .andWhere("member.status = :memberStatus", {
        memberStatus: CommunityUserStatus.ACTIVE,
      })
      .andWhere("post.status = :postStatus", {
        postStatus: PostStatus.PUBLISHED,
      })
      .orderBy("post.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }
}