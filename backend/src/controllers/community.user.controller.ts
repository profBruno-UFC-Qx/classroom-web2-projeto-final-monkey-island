import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";

import { ICommunityUserService } from "../services/community.user.service";

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
}
