import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IArtifactCollectionService } from "../services/artifact.collection.service";
import { ArtifactRarity } from "../entities/artifact";

@injectable()
export class ArtifactCollectionController {
  constructor(
    @inject(TYPES.ArtifactCollectionService)
    private readonly artifactCollectionService: IArtifactCollectionService
  ) {}
  async addArtifactInCollection(req: Request, res: Response) {
    try {
      const { userId, artifactId } = req.params;

      await this.artifactCollectionService.addArtifactInCollection(
        userId,
        artifactId
      );

      return res.status(201).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllArtifactsByUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await this.artifactCollectionService.getAllArtifactsByUser(
        userId as string,
        page,
        limit
      );

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllArtifactsByUserAndRarity(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { rarity } = req.params;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result =
        await this.artifactCollectionService.getAllArtifactsByUserAndRarity(
          userId as string,
          rarity as ArtifactRarity,
          page,
          limit
        );

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllArtifactsByUserAndNameLike(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name } = req.query;

      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result =
        await this.artifactCollectionService.getAllArtifactsByUserAndNameLike(
          userId as string,
          String(name ?? ""),
          page,
          limit
        );

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
