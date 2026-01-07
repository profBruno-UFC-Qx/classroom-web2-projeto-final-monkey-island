import { inject, injectable } from "inversify";
import { ArtifactRequestDto } from "../dtos/artifact/request/artifact.request";
import { ArtifactUpdateRequestDto } from "../dtos/artifact/request/artifact.update.request.dto";
import { ArtifactResponsetDto } from "../dtos/artifact/response/artifact.response";
import { ArtifactsResponseDto } from "../dtos/artifact/response/artifacts.response.dto";
import { TYPES } from "../types/types";
import { IArtifactRepository } from "../repositories/artifact.repositorie";
import { Artifact, ArtifactRarity } from "../entities/artifact";
import path from "path";
import { rename, unlink } from "node:fs/promises";
import { applyPartialUpdate } from "../util/merge-function";

export interface IArtifactService {
  createArtifact(
    request: ArtifactRequestDto,
    filename: string,
    filepath: string
  ): Promise<ArtifactResponsetDto>;

  choiceRandomArtifact(): Promise<ArtifactResponsetDto>;

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

  async updateArtifact(
    id: string,
    updated: ArtifactUpdateRequestDto
  ): Promise<ArtifactResponsetDto> {
    const artifact = await this.artifactRepository.getArtifactById(id);
    if (!artifact) {
      throw new Error("artifact not exists");
    }
    applyPartialUpdate(artifact, updated);
    const responseData = await this.artifactRepository.save(artifact);
    return this.entityToDto(responseData);
  }

  async deleteArtifact(id: string): Promise<void> {
    const artifact = await this.artifactRepository.getArtifactById(id);

    if (!artifact) {
      throw new Error("artifact not exists");
    }

    const filepath = path.resolve("public", artifact.image);
    await this.artifactRepository.deleteArtifact(id);
    try {
      await unlink(filepath);
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        console.error("Failed to delete artifact file:", err);
      }
    }
  }

  private getRandomInt(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getSelectedRarity() {
    const probabilities: Record<ArtifactRarity, number> = {
      [ArtifactRarity.FRAGMENT]: 30,
      [ArtifactRarity.PARTIAL_FOSSIL]: 30,
      [ArtifactRarity.RARE_FOSSIL]: 25,
      [ArtifactRarity.EXCEPTIONAL_SPECIMEN]: 10,
      [ArtifactRarity.UNIQUE_SPECIMEN]: 5,
    };

    let randomNumber = this.getRandomInt();
    let choice: ArtifactRarity | null = null;

    for (const key in probabilities) {
      randomNumber -= probabilities[key as ArtifactRarity];
      if (randomNumber <= 0) {
        choice = key as ArtifactRarity;
        break;
      }
    }
    if (!choice) {
      throw new Error("rarity not selected");
    }
    return choice;
  }

  async choiceRandomArtifact(): Promise<ArtifactResponsetDto> {
    const selectedRarity = this.getSelectedRarity();
    const listOfArtifacts =
      await this.artifactRepository.getArtifactsByRarity(selectedRarity);

    if (listOfArtifacts.length === 0) {
      throw new Error(`No artifacts found for rarity ${selectedRarity}`);
    }

    return this.entityToDto(
      listOfArtifacts[this.getRandomInt(0, listOfArtifacts.length - 1)]
    );
  }

  async getAllArtifacts(
    limit?: number,
    page?: number
  ): Promise<ArtifactsResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);
    const skip = (currentPage - 1) * currentLimit;
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
    artifact.image = `artifacts/${filename}`;
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
