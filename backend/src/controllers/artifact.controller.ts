import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { Request, Response } from "express";
import { IArtifactService } from "../services/artifact.service";
import { ArtifactRequestDto } from "../dtos/artifact/request/artifact.request";
import { ArtifactUpdateRequestDto } from "../dtos/artifact/request/artifact.update.request.dto";

@injectable()
export class ArtifactController {
  constructor(
    @inject(TYPES.ArtifactService) private artifactService: IArtifactService
  ) {}

  async createArtifact(req: Request, res: Response): Promise<void> {
    try {
      const request: ArtifactRequestDto = req.body;
      const file = req.file;

      if (!file) {
        res.status(400).json({ msg: "file needs to be submitted" });
      }
      const response = await this.artifactService.createArtifact(
        request,
        file?.filename as string,
        file?.path as string
      );
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllArtifacts(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const response = await this.artifactService.getAllArtifacts(limit, page);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteArtifact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await this.artifactService.deleteArtifact(id);
      res.status(204);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getArtifactById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const response = await this.artifactService.getArtifactById(id);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateArtifact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const request: ArtifactUpdateRequestDto = req.body;
      const response = await this.artifactService.updateArtifact(id, request);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
