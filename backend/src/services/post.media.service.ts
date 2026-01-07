import { PostMediaResponseDto } from "../dtos/post_media/response/post.media.response.dto";

export interface IPostMediaService {
  addingMediasInPost(
    postId: string,
    files: Express.Multer.File[]
  ): Promise<PostMediaResponseDto>;
  deleteMediaInPost(postId: string, postMediaId: string): Promise<void>;
  findMediasInPost(postId: string): Promise<PostMediaResponseDto>;
}
