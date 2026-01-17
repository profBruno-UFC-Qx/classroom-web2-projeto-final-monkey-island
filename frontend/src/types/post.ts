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
  author?: {
    id: string;
    name: string;
  };
  authorId?: string;
  authorName?: string;
  community?: {
    id: string;
    name: string;
  };
  communityId?: string;
  communityName?: string;
  likeCount: number;
  commentCount?: number;
  userHasLiked?: boolean;
}

export interface LikeToggleResponse {
  liked: boolean;
  newLikeCount: number;
}

export interface PostResponse {
  post: Post;
  authorId?: string;
  communityId?: string;
  authorName?: string;
  communityName?: string;
}

export type FeedResponse = PaginatedResponse<Post>;