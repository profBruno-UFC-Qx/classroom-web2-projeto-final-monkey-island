export interface PostResponseDto {
  post: {
    title: string;
    content: string;
    createdAt: Date;
  };
  communityId: string;
  communityName: string;
  authorId: string;
  authorName: string;
}
