import { inject, injectable } from "inversify";
import { ArtifactRequestDto } from "../dtos/artifact/request/artifact.request";
import { ArtifactUpdateRequestDto } from "../dtos/artifact/request/artifact.update.request.dto";
import { ArtifactResponsetDto } from "../dtos/artifact/response/artifact.response";
import { ArtifactsResponseDto } from "../dtos/artifact/response/artifacts.response.dto";
import { TYPES } from "../types/types";
import { IArtifactRepository } from "../repositories/artifact.repositorie";
import { Artifact } from "../entities/artifact";
import path from "path";
import { rename } from "node:fs/promises";

export interface IArtifactService {
  createArtifact(
    request: ArtifactRequestDto,
    filename: string,
    filepath: string
  ): Promise<ArtifactResponsetDto>;

  choiceRandomArtifact(): Promise<ArtifactRequestDto>;

  getAllArtifacts(limit?: number, page?: number): Promise<ArtifactsResponseDto>;

  getArtifactById(id: string): Promise<ArtifactResponsetDto>;

  deleteArtifact(id: string): Promise<void>;

  updateArtifact(
    id: string,
    updated: ArtifactUpdateRequestDto
  ): Promise<ArtifactResponsetDto>;
}

@injectable()
export class ArtifactService implements IArtifactService {
  constructor(
    @inject(TYPES.ArtifactRepositoryDB)
    private artifactRepository: IArtifactRepository
  ) {}

  async createArtifact(
    request: ArtifactRequestDto,
    filename: string,
    filepath: string
  ): Promise<ArtifactResponsetDto> {
    const artifactExists = await this.artifactRepository.artifactExistsByName(
      request.name
    );

    if (artifactExists) {
      throw new Error("artifact already exists");
    }

    const artifact = this.dtoToEntity(request, filename);
    const responseData = await this.artifactRepository.save(artifact);
    await this.moveTmpToFinal(filename, filepath);
    return this.entityToDto(responseData);
  }

  async getArtifactById(id: string): Promise<ArtifactResponsetDto> {
    const artifact = await this.artifactRepository.getArtifactById(id);

    if (!artifact) {
      throw new Error("artifact not exists");
    }

    return this.entityToDto(artifact);
  }

  async getAllArtifacts(
    limit?: number,
    page?: number
  ): Promise<ArtifactsResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);
    const skip = (currentPage - 1) * currentPage;
    const [entities, totalItems] =
      await this.artifactRepository.getAllArtifacts(skip, currentLimit);

    const data = entities.map((data) => this.entityToDto(data));

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / currentLimit),
    };
  }

  private async moveTmpToFinal(filename: string, filepath: string) {
    const finalPath = path.resolve("public", "artifacts", filename);
    await rename(filepath, finalPath);
  }

  private dtoToEntity(req: ArtifactRequestDto, filename: string): Artifact {
    const artifact = new Artifact();
    artifact.description = req.description || "";
    artifact.rarity = req.rarity;
    artifact.name = req.name;
    artifact.image = `images/artifacts/${filename}`;
    return artifact;
  }

  public entityToDto(artifact: Artifact): ArtifactResponsetDto {
    return {
      id: artifact.id,
      name: artifact.name,
      rarity: artifact.rarity,
      image: artifact.image,
      description: artifact.description,
    };
  }
}
