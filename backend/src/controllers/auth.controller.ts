import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IAuthService } from "../services/auth.service";
import { Request, Response } from "express";
import { RegisterRequestDto } from "../dtos/auth/request/register.request.dto";
import { LoginRequestDto } from "../dtos/auth/request/login.request.dto";

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const request: RegisterRequestDto = req.body;
      await this.authService.registerUser(request);
      res.status(201).json({ msg: "user successfully registered" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async registerAdmin(req: Request, res: Response): Promise<void> {
    try {
      const request: RegisterRequestDto = req.body;
      await this.authService.registerAdmin(request);
      res.status(201).json({ msg: "user successfully registered" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const request: LoginRequestDto = req.body;
      const response = await this.authService.login(request);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
