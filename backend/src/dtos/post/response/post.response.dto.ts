import { PostStatus } from "../../../entities/post";

export interface PostResponseDto {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    status: PostStatus;
    likeCount: number;
  };
  communityId: string;
  communityName?: string;
  authorId: string;
  authorName?: string;
}
