import { PostMedia } from "../entities/post.media";

export interface IPostMediaRepository {
  save(postMedia: PostMedia): Promise<PostMedia>;
  delete(postMediaId: string): Promise<void>;
  getMediaById(mediaId: string): Promise<PostMedia>;
  getAllMediasByPost(postId: string): Promise<PostMedia[]>;
}
