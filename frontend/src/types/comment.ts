export interface Comment {
  id: string;
  content: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  replies: Comment[];
  author?: {
    id: string;
    name: string;
  };
}

export interface CreateCommentDto {
  content: string;
  parentId?: string;
}