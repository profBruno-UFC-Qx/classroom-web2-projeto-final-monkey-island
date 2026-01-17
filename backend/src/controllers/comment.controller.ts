import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ICommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dtos/comment/request/create.comment.dto";

@injectable()
export class CommentController {
  constructor(
    @inject(TYPES.CommentService) private commentService: ICommentService
  ) {}

  async createComment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { postId } = req.params;
      const body: CreateCommentDto = req.body;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const result = await this.commentService.createComment(userId, postId, body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { commentId } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      await this.commentService.deleteComment(userId, commentId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const comments = await this.commentService.getCommentsByPost(postId);
      res.status(200).json(comments);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}