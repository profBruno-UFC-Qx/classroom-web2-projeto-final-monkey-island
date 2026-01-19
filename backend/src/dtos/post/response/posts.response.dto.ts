import { PostResponseDto } from "./post.response.dto";

export interface postsResponseDto {
  data: PostResponseDto[];
  totalItems: number;
  totalPages: number;
}
