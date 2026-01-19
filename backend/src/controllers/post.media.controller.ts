import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";

import { IPostMediaService } from "../services/post.media.service";

@injectable()
export class PostMediaController {
  constructor(
    @inject(TYPES.PostMediaService)
    private postMediaService: IPostMediaService
  ) {}

  async addMediasInPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;
      const files = req.files as Express.Multer.File[];

      if (files.length === 0) {
        res.status(400).send({ message: "no file uploaded" });
        return;
      }

      const response = await this.postMediaService.addMediasInPost(
        postId,
        files
      );

      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findMediasInPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;

      const response = await this.postMediaService.findMediasInPost(postId);

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteMediaInPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;
      const postMediaId = req.params.mediaId;

      await this.postMediaService.deleteMediaInPost(postId, postMediaId);

      res.status(204).end();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
