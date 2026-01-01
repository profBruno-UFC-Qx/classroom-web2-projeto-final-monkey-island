import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";

import { ICommunityService } from "../services/community.service";
import { CommunityRequestDto } from "../dtos/community/request/community.request.dto";
import { CommunityUpdateRequestDto } from "../dtos/community/request/community.update.request.dto";

@injectable()
export class CommunityController {
  constructor(
    @inject(TYPES.CommunityService) private communityService: ICommunityService
  ) {}

  async createCommunity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const request: CommunityRequestDto = req.body;
      const response = await this.communityService.createCommunity(
        userId,
        request
      );
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateCommunityData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const communityId = req.params.id;
      const request: CommunityUpdateRequestDto = req.body;
      const response = await this.communityService.updateCommunityData(
        userId,
        communityId,
        request
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCommunity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id as string;
      const communityId = req.params.id;
      const response = await this.communityService.deleteCommunityById(
        userId,
        communityId
      );
      res.status(204).end();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findCommunityByNameLike(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const response = await this.communityService.findCommunityByNameLike(
        name as string,
        page,
        limit
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findPopularCommunities(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const response = await this.communityService.findPopularCommunities(
        page,
        limit
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
