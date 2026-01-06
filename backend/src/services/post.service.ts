import { PostRequestDto } from "../dtos/post/request/post.request.dto";
import { PostUpdateRequestDto } from "../dtos/post/request/post.update.data.dto";
import { PostResponseDto } from "../dtos/post/response/post.response.dto";
import { postsResponseDto } from "../dtos/post/response/posts.response.dto";

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
