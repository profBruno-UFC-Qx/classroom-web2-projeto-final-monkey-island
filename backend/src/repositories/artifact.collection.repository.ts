import { AppDataSource } from "../config/db.connection";
import { injectable } from "inversify";
import { ArtifactCollection } from "../entities/artifact.collection";
import { ArtifactRarity } from "../entities/artifact";
import { Artifact } from "../entities/artifact";
import { Like } from "typeorm";

export interface IArtifactCollectionRepository {
  save(artifactCollection: ArtifactCollection): Promise<void>;

  findAllArtifactsOfCollectionByUserId(
    user_id: string,
    skip: number,
    take: number
  ): Promise<[{ artifact: Artifact; quantity: number }[], number]>;

  ExistsByUserIdAndArtifactId(
    user_id: string,
    artifact_id: string
  ): Promise<boolean>;

  findAllArtifactsByUserIdAndRarity(
    user_id: string,
    rarity: ArtifactRarity,
    skip: number,
    take: number
  ): Promise<[{ artifact: Artifact; quantity: number }[], number]>;

  findAllArtifactsByUserIdAndNameLike(
    user_id: string,
    name: string,
    skip: number,
    take: number
  ): Promise<[{ artifact: Artifact; quantity: number }[], number]>;
}

@injectable()
export class ArtifactCollectionRepositoryDB
  implements IArtifactCollectionRepository
{
  private get repo() {
    return AppDataSource.getRepository(ArtifactCollection);
  }

  async save(artifactCollection: ArtifactCollection): Promise<void> {
    await this.repo.save(artifactCollection);
  }

  async ExistsByUserIdAndArtifactId(
    user_id: string,
    artifact_id: string
  ): Promise<boolean> {
    return await this.repo.exists({
      where: { user: { id: user_id }, artifact: { id: artifact_id } },
    });
  }

  private mapCollection(items: ArtifactCollection[]) {
    return items.map((item) => ({
      artifact: item.artifact,
      quantity: item.quantity,
    }));
  }

  async findAllArtifactsOfCollectionByUserId(
    user_id: string,
    skip: number,
    take: number
  ): Promise<[{ artifact: Artifact; quantity: number }[], number]> {
    const [items, total] = await this.repo.findAndCount({
      where: {
        user: { id: user_id },
      },
      relations: ["artifact"],
      skip,
      take,
    });

    const mapped = this.mapCollection(items);

    return [mapped, total];
  }

  async findAllArtifactsByUserIdAndRarity(
    user_id: string,
    rarity: ArtifactRarity,
    skip: number,
    take: number
  ): Promise<[{ artifact: Artifact; quantity: number }[], number]> {
    const [items, total] = await this.repo.findAndCount({
      where: {
        user: { id: user_id },
        artifact: { rarity },
      },
      relations: ["artifact"],
      skip,
      take,
    });

    const mapped = this.mapCollection(items);

    return [mapped, total];
  }

  async findAllArtifactsByUserIdAndNameLike(
    user_id: string,
    name: string,
    skip: number,
    take: number
  ): Promise<[{ artifact: Artifact; quantity: number }[], number]> {
    const [items, total] = await this.repo.findAndCount({
      where: {
        user: { id: user_id },
        artifact: {
          name: Like(`%${name}%`),
        },
      },
      relations: ["artifact"],
      skip,
      take,
    });

    const mapped = this.mapCollection(items);

    return [mapped, total];
  }
}
