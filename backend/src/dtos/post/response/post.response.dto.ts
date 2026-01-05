// "post",
// "community.id",
// "community.name",
// "author.id",
// "author.name",

export interface PostResponseDto {
  post: {
    title: string;
    content: string;
    createdAt: Date;
  };
}
