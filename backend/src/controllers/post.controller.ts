import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";

import { IPostService } from "../services/post.service";
import { PostRequestDto } from "../dtos/post/request/post.request.dto";
import { PostUpdateRequestDto } from "../dtos/post/request/post.update.data.dto";

@injectable()
export class PostController {
  constructor(
    @inject(TYPES.PostService)
    private postService: IPostService
  ) {}

  async createDraftPost(req: Request, res: Response): Promise<void> {
    try {
      const authorId = req.user?.id as string;
      const communityId = req.params.communityId;
      const request: PostRequestDto = req.body;

      const response = await this.postService.createDraftPost(
        authorId,
        communityId,
        request
      );

      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async publishPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;

      const response = await this.postService.publishPost(postId);

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findPostById(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;

      const response = await this.postService.findPostById(postId);

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePostData(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;
      const request: PostUpdateRequestDto = req.body;

      const response = await this.postService.updatePostData(postId, request);

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;

      await this.postService.deletePost(postId);

      res.status(204).end();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findPostsByAuthorInCommunity(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const authorId = req.params.authorId;
      const communityId = req.params.communityId;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const response = await this.postService.findPostsByAuthorInCommunity(
        authorId,
        communityId,
        page,
        limit
      );

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findRecentPostsInCommunity(req: Request, res: Response): Promise<void> {
    try {
      const communityId = req.params.communityId;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const response = await this.postService.findRecentPostsInCommunity(
        communityId,
        page,
        limit
      );

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findPublicFeed(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const response = await this.postService.findPublicFeed(page, limit);

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findFeedForUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const response = await this.postService.findFeedForUser(
        userId,
        page,
        limit
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
