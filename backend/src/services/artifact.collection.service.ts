import { Artifact, ArtifactRarity } from "../entities/artifact";
import { ArtifactCollectionResponseDto } from "../dtos/artifact_collection/response/artifact.collection.response.dto";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";
import { IArtifactCollectionRepository } from "../repositories/artifact.collection.repository";
import { ArtifactResponsetDto } from "../dtos/artifact/response/artifact.response";

export interface IArtifactCollectionService {
  addArtifactInCollection(user_id: string, artifact_id: string): Promise<void>;

  getAllArtifactsByUser(
    user_id: string,
    page: number,
    limit: number
  ): Promise<ArtifactCollectionResponseDto>;

  getAllArtifactsByUserAndRarity(
    user_id: string,
    rarity: ArtifactRarity,
    page: number,
    limit: number
  ): Promise<ArtifactCollectionResponseDto>;
}

@injectable()
export class ArtifactCollectionService implements IArtifactCollectionService {
  constructor(
    @inject(TYPES.ArtifactCollectionRepositoryDB)
    private readonly artifactCollectionRepository: IArtifactCollectionRepository
  ) {}

  async addArtifactInCollection(
    user_id: string,
    artifact_id: string
  ): Promise<void> {}

  async getAllArtifactsByUser(
    user_id: string,
    page: number,
    limit: number
  ): Promise<ArtifactCollectionResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);

    const skip = (currentPage - 1) * currentLimit;

    const [items, total] =
      await this.artifactCollectionRepository.findAllArtifactsOfCollectionByUserId(
        user_id,
        skip,
        currentLimit
      );

    return {
      data: items.map((item) => ({
        artifact: this.mapArtifact(item.artifact),
        quantity: item.quantity,
      })),
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllArtifactsByUserAndRarity(
    user_id: string,
    rarity: ArtifactRarity,
    page: number,
    limit: number
  ): Promise<ArtifactCollectionResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);
    const skip = (currentPage - 1) * currentLimit;

    const [items, total] =
      await this.artifactCollectionRepository.findAllArtifactsByUserIdAndRarity(
        user_id,
        rarity,
        skip,
        currentLimit
      );

    return {
      data: items.map((item) => ({
        artifact: this.mapArtifact(item.artifact),
        quantity: item.quantity,
      })),
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  private mapArtifact(artifact: Artifact): ArtifactResponsetDto {
    return {
      id: artifact.id,
      name: artifact.name,
      description: artifact.description,
      rarity: artifact.rarity,
      image: artifact.image,
    };
  }
}
