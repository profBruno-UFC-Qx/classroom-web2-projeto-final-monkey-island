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
  author: {
    id: string;
    name: string;
  };
  community: {
    id: string;
    name: string;
  };
  likeCount: number;
  userHasLiked?: boolean;
}

export interface LikeToggleResponse {
  liked: boolean;
  newLikeCount: number;
}

export type FeedResponse = PaginatedResponse<Post>;