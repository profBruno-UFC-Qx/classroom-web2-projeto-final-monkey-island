import { inject, injectable } from "inversify";
import { PostRequestDto } from "../dtos/post/request/post.request.dto";
import { PostUpdateRequestDto } from "../dtos/post/request/post.update.data.dto";
import { PostResponseDto } from "../dtos/post/response/post.response.dto";
import { postsResponseDto } from "../dtos/post/response/posts.response.dto";
import { TYPES } from "../types/types";
import { IPostRepository } from "../repositories/post.repository";
import { Post, PostStatus } from "../entities/post";
import { User } from "../entities/User";
import { Community } from "../entities/community";
import { applyPartialUpdate } from "../util/merge-function";

export interface IPostService {
  createDraftPost(
    authorId: string,
    communityId: string,
    postRequest: PostRequestDto
  ): Promise<PostResponseDto>;

  publishPost(postid: string, authorId: string): Promise<PostResponseDto>;

  findPostById(postId: string): Promise<PostResponseDto>;

  updatePostData(
    postId: string,
    authorId: string,
    request: PostUpdateRequestDto
  ): Promise<PostResponseDto>;

  deletePost(postId: string, authorId: string): Promise<void>;
  findPostsByAuthorInCommunity(
    authorId: string,
    communityId: string,
    page?: number,
    limit?: number
  ): Promise<postsResponseDto>;

  findRecentPostsInCommunity(
    communityId: string,
    page?: number,
    limit?: number
  ): Promise<postsResponseDto>;

  findPublicFeed(page?: number, limit?: number): Promise<postsResponseDto>;
  findFeedForUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<postsResponseDto>;

  incrementLikeCount(postId: string): Promise<void>;
  incrementCommentCount(postId: string): Promise<void>;

  decrementLikeCount(postId: string): Promise<void>;
  decrementCommentCount(postId: string): Promise<void>;
}

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.PostRepositoryDB) private postRepository: IPostRepository
  ) {}

  async createDraftPost(
    authorId: string,
    communityId: string,
    postRequest: PostRequestDto
  ): Promise<PostResponseDto> {
    const post = new Post();
    post.author = { id: authorId } as User;
    post.community = { id: communityId } as Community;
    post.status = PostStatus.DRAFT;
    post.title = postRequest.title;
    post.content = postRequest.content;
    const savedPost = await this.postRepository.save(post);
    return this.entityToResponse(savedPost);
  }

  async publishPost(
    postid: string,
    authorId: string
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findPostById(postid);

    if (!post) {
      throw new Error("post not exists");
    }

    if (post.author.id !== authorId) {
      throw new Error(
        "the action can only be carried out by the owner of the post"
      );
    }

    post.status = PostStatus.PUBLISHED;
    const updatedPost = await this.postRepository.save(post);
    return this.entityToResponse(updatedPost);
  }

  async findPostById(postId: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findPostById(postId);
    if (!post) {
      throw new Error("post not exists");
    }
    return this.entityToResponse(post);
  }

  async deletePost(postid: string, authorId: string): Promise<void> {
    const post = await this.postRepository.findPostById(postid);

    if (!post) {
      throw new Error("post not exists");
    }

    if (post.author.id !== authorId) {
      throw new Error(
        "the action can only be carried out by the owner of the post"
      );
    }

    post.status = PostStatus.DELETED;
    await this.postRepository.save(post);
  }

  async updatePostData(
    postId: string,
    authorId: string,
    request: PostUpdateRequestDto
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error("post not exists");
    }

    if (post.author.id !== authorId) {
      throw new Error(
        "the action can only be carried out by the owner of the post"
      );
    }
    const target = applyPartialUpdate(post, request);
    const updatedPost = await this.postRepository.save(target);
    return this.entityToResponse(updatedPost);
  }

  async incrementLikeCount(postId: string): Promise<void> {
    const post = await this.postRepository.postExistsById(postId);

    if (!post) {
      throw new Error("post not exists");
    }
    await this.postRepository.incrementLikeCount(postId);
  }

  async incrementCommentCount(postId: string): Promise<void> {
    const post = await this.postRepository.postExistsById(postId);

    if (!post) {
      throw new Error("post not exists");
    }

    await this.postRepository.incrementCommentCount(postId);
  }

  async decrementLikeCount(postId: string): Promise<void> {
    const post = await this.postRepository.postExistsById(postId);

    if (!post) {
      throw new Error("post not exists");
    }

    await this.postRepository.decrementLikeCount(postId);
  }

  async decrementCommentCount(postId: string): Promise<void> {
    const post = await this.postRepository.postExistsById(postId);

    if (!post) {
      throw new Error("post not exists");
    }

    await this.postRepository.decrementCommentCount(postId);
  }

  async findPostsByAuthorInCommunity(
    authorId: string,
    communityId: string,
    page?: number,
    limit?: number
  ): Promise<postsResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);

    const skip = (currentPage - 1) * currentLimit;

    const [items, total] =
      await this.postRepository.findPostsByAuthorInCommunity(
        authorId,
        communityId,
        skip,
        currentLimit
      );

    return {
      data: items.map((item) => this.entityToResponse(item)),
      totalItems: total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  async findRecentPostsInCommunity(
    communityId: string,
    page?: number,
    limit?: number
  ): Promise<postsResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);

    const skip = (currentPage - 1) * currentLimit;

    const [items, total] = await this.postRepository.findRecentPostsInCommunity(
      communityId,
      skip,
      currentLimit
    );

    return {
      data: items.map((item) => this.entityToResponse(item)),
      totalItems: total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  async findPublicFeed(
    page?: number,
    limit?: number
  ): Promise<postsResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);

    const skip = (currentPage - 1) * currentLimit;

    const [items, total] = await this.postRepository.findPublicFeed(
      skip,
      currentLimit
    );

    return {
      data: items.map((item) => this.entityToResponse(item)),
      totalItems: total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  async findFeedForUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<postsResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);
    const skip = (currentPage - 1) * currentLimit;

    let [items, total] = await this.postRepository.findFeedForUser(
      userId,
      skip,
      currentLimit
    );

    if (items.length === 0 && currentPage === 1) {
      return this.findPublicFeed(page, limit);
    }

    return {
      data: items.map((item) => this.entityToResponse(item)),
      totalItems: total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  private entityToResponse(post: Post): PostResponseDto {
    return {
      post: {
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        status: post.status,
      },
      communityId: post.community.id,
      communityName: post.community.name ?? undefined,
      authorId: post.author.id,
      authorName: post.author.name ?? undefined,
    };
  }
}
