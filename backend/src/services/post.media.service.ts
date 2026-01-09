import { inject, injectable } from "inversify";
import { PostMediaResponseDto } from "../dtos/post_media/response/post.media.response.dto";
import { TYPES } from "../types/types";
import { IPostMediaRepository } from "../repositories/post.media.repository";
import { PostMedia } from "../entities/post.media";
import { Post } from "../entities/post";
import path from "path";
import { rename, unlink } from "node:fs/promises";
import fs from "node:fs";

export interface IPostMediaService {
  addMediasInPost(
    postId: string,
    files: Express.Multer.File[]
  ): Promise<PostMediaResponseDto>;
  deleteMediaInPost(postId: string, postMediaId: string): Promise<void>;
  findMediasInPost(postId: string): Promise<PostMediaResponseDto>;
}

@injectable()
export class PostMediaService implements IPostMediaService {
  constructor(
    @inject(TYPES.PostMediaRepositoryDB)
    private postMediaRepository: IPostMediaRepository
  ) {}

  async addMediasInPost(
    postId: string,
    files: Express.Multer.File[]
  ): Promise<PostMediaResponseDto> {
    const alreadyPosts =
      await this.postMediaRepository.findAllMediasByPostId(postId);

    if (alreadyPosts.length + files.length > 5) {
      throw new Error("the post exceeds the maximum limit of 5 media items");
    }

    const response: PostMediaResponseDto = { medias: [] };
    const lastOrder =
      alreadyPosts.length > 0 ? alreadyPosts[alreadyPosts.length - 1].order : 0;

    for (const [index, file] of files.entries()) {
      const mappedFile = {
        filename: file.filename,
        order: index + 1,
        path: file.path,
      };

      const postMedia = new PostMedia();
      postMedia.post = { id: postId } as Post;
      postMedia.order = mappedFile.order + lastOrder;
      postMedia.url = `media_posts/${mappedFile.filename}`;

      const data = await this.postMediaRepository.save(postMedia);
      response.medias.push(this.entityToDto(data));

      await this.moveTmpToFinal(mappedFile.filename, mappedFile.path);
    }

    return response;
  }

  async findMediasInPost(postId: string): Promise<PostMediaResponseDto> {
    const alreadyPosts =
      await this.postMediaRepository.findAllMediasByPostId(postId);

    const response: PostMediaResponseDto = { medias: [] };

    alreadyPosts.forEach((postMedia) =>
      response.medias.push(this.entityToDto(postMedia))
    );
    return response;
  }

  async deleteMediaInPost(postId: string, postMediaId: string): Promise<void> {
    const medias = await this.postMediaRepository.findAllMediasByPostId(postId);

    const targetIndex = medias.findIndex((media) => media.id === postMediaId);

    if (targetIndex === -1) {
      throw new Error("media not exists");
    }

    const targetMedia = medias[targetIndex];
    const filepath = path.resolve("public", targetMedia.url);

    await this.postMediaRepository.delete(targetMedia.id);

    try {
      await unlink(filepath);
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        console.error("Failed to delete post media file:", err);
      }
    }

    for (let i = targetIndex + 1; i < medias.length; i++) {
      medias[i].order = (medias[i].order as number) - 1;
      await this.postMediaRepository.save(medias[i]);
    }
  }

  private entityToDto(postMedia: PostMedia) {
    return {
      mediaId: postMedia.id,
      image: postMedia.url,
      order: postMedia.order,
    };
  }

  private async moveTmpToFinal(filename: string, filepath: string) {
    const finalDir = path.resolve("public", "media_posts");

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const finalPath = path.resolve(finalDir, filename);
    await rename(filepath, finalPath);
  }
}
