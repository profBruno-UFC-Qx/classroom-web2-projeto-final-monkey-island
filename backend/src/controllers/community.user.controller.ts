import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";

import { ICommunityUserService } from "../services/community.user.service";
import { BanRequestDto } from "../dtos/community_user/request/ban.request.dto";
import { suspendRequestDto } from "../dtos/community_user/request/suspend.request.dto";

@injectable()
export class CommunityUserController {
  constructor(
    @inject(TYPES.CommunityUserService)
    private communityUserService: ICommunityUserService
  ) {}

  async joinInCommunity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const communityId = req.params.id;
      const response = await this.communityUserService.joinInCommunity(
        userId,
        communityId
      );
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async leftOfCommunity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const communityId = req.params.id;
      const response = await this.communityUserService.leftOfCommunity(
        userId,
        communityId
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async listCommunitiesOfUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const response = await this.communityUserService.listCommunitiesOfUser(
        userId,
        page,
        limit
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async listUsersOfCommunity(req: Request, res: Response): Promise<void> {
    try {
      const communityId = req.params.id;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const response = await this.communityUserService.listUsersOfCommunity(
        communityId,
        page,
        limit
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const targetUserId = req.params.targetUserId;
      const communityId = req.params.communityId;
      const banRequest: BanRequestDto = req.body;

      const response = await this.communityUserService.banUser(
        targetUserId,
        communityId,
        banRequest
      );
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async suspendUser(req: Request, res: Response): Promise<void> {
    try {
      const targetUserId = req.params.targetUserId;
      const communityId = req.params.communityId;
      const suspendRequest: suspendRequestDto = req.body;

      const response = await this.communityUserService.suspendUser(
        targetUserId,
        communityId,
        suspendRequest
      );
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
