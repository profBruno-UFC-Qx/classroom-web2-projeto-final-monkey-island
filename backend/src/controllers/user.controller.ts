import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";

import { IUserService } from "../services/user.service";
import { UserRole } from "../entities/User";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService)
    private userService: IUserService
  ) {}

  async getMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      console.log(userId);

      const response = await this.userService.getUserProfileInfo(
        userId as string
      );

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserProfileById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;

      const response = await this.userService.getUserProfileInfo(userId);

      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.userService.getAllUsers();

      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;

      await this.userService.banUser(userId);

      res.status(204).end();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
