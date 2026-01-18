export interface CommentResponseDto {
  id: string;
  content: string;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  replies: CommentResponseDto[];
}