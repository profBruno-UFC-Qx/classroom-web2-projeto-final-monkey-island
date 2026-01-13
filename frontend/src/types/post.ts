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
  status: "DRAFT" | "PUBLISHED" | "DELETED";

  communityId: string;
  communityName?: string;
  authorId: string;
  authorName?: string;

  likeCount: number;
  commentCount: number;

  medias?: PostMedia[];
}
