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
import { th } from "zod/locales";

export interface IPostService {
  createDraftPost(
    authorId: string,
    communityId: string,
    postRequest: PostRequestDto
  ): Promise<PostResponseDto>;

  publishPost(authorId: string, postid: string): Promise<PostResponseDto>;

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
    skip: number,
    take: number
  ): Promise<postsResponseDto>;

  findRecentPostsInCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<postsResponseDto>;

  findPublicFeed(skip: number, take: number): Promise<postsResponseDto>;
  findFeedForUser(
    userId: string,
    skip: number,
    take: number
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
    authorId: string,
    postid: string
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
