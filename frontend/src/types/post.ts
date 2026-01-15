import type { PaginatedResponse } from './common';

export type PostStatus = "DRAFT" | "PUBLISHED" | "DELETED";

export interface PostMedia {
  mediaId: string;
  image: string;
  order: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: PostStatus;

  communityId: string;
  communityName?: string;
  authorId: string;
  authorName?: string;

  likeCount: number;
  commentCount: number;

  medias?: PostMedia[];
}

export type FeedResponse = PaginatedResponse<Post>;