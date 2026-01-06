import { PostStatus } from "../../../entities/post";

export interface PostResponseDto {
  post: {
    title: string;
    content: string;
    createdAt: Date;
    status: PostStatus;
  };
  communityId: string;
  communityName?: string;
  authorId: string;
  authorName?: string;
}
