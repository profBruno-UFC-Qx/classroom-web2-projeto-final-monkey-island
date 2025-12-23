import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IResearcherRequestService } from "../services/researcher.request.service";
import { RequestToBeResearcherDto } from "../dtos/researcher_request/request/RequestToBeResearcherDto";

@injectable()
export class ResearcherRequestController {
  constructor(
    @inject(TYPES.ResearcherRequestService)
    private researcherRequestService: IResearcherRequestService
  ) {}

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const dto: RequestToBeResearcherDto = req.body;

      const response = await this.researcherRequestService.create(
        userId as string,
        dto
      );

      return res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findByUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const response = await this.researcherRequestService.findByUser(
        userId as string
      );

      return res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findPending(_req: Request, res: Response) {
    try {
      const response = await this.researcherRequestService.findPending();
      return res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const { requestId } = req.params;

      const response = await this.researcherRequestService.approve(requestId);

      return res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async reject(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const response = await this.researcherRequestService.reject(requestId);
      return res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
