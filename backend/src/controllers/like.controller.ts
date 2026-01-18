import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ILikeService } from "../services/like.service";

@injectable()
export class LikeController {
  constructor(
    @inject(TYPES.LikeService) private likeService: ILikeService
  ) {}

  async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // Assumindo que o middleware de auth popula isso
      const postId = req.params.postId;

      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      const response = await this.likeService.toggleLike(userId, postId);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}