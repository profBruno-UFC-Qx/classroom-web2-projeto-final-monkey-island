import { injectable } from "inversify";
import { PostMedia } from "../entities/post.media";
import { AppDataSource } from "../config/db.connection";

export interface IPostMediaRepository {
  save(postMedia: PostMedia): Promise<PostMedia>;
  delete(postMediaId: string): Promise<void>;
  getMediaById(mediaId: string): Promise<PostMedia>;
  getAllMediasByPost(postId: string): Promise<PostMedia[]>;
}

@injectable()
export class PostMediaRepositoryDB implements IPostMediaRepository {
  private get repo() {
    return AppDataSource.getRepository(PostMedia);
  }

  async save(postMedia: PostMedia): Promise<PostMedia> {
    return await this.repo.save(postMedia);
  }

  async delete(postMediaId: string): Promise<void> {
    await this.repo.delete({ id: postMediaId });
  }
}
