import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { Request, Response } from "express";
import { IArtifactService } from "../services/artifact.service";
import { ArtifactRequestDto } from "../dtos/artifact/request/artifact.request";

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

  async deleteArtifact(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const response = await this.artifactService.deleteArtifact(id);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
