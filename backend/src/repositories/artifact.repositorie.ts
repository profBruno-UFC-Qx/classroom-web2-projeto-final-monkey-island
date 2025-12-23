import { AppDataSource } from "../config/db.connection";
import { injectable } from "inversify";
import { Artifact } from "../entities/artifact";

export interface IArtifactRepository {
  save(artifact: Artifact): Promise<Artifact>;
  getArtifactById(artifact_id: string): Promise<Artifact | null>;
  getAllArtifacts(skip: number, take: number): Promise<[Artifact[], number]>;
  artifactExistsById(artifact_id: string): Promise<boolean>;
  deleteArtifact(artifact_id: string): Promise<void>;
}

@injectable()
export class ArtifactRepositoryDB implements IArtifactRepository {
  private get repo() {
    return AppDataSource.getRepository(Artifact);
  }

  async save(artifact: Artifact): Promise<Artifact> {
    return await this.repo.save(artifact);
  }

  async getAllArtifacts(
    skip: number,
    take: number
  ): Promise<[Artifact[], number]> {
    return await this.repo.findAndCount({ skip, take });
  }

  async getArtifactById(artifact_id: string): Promise<Artifact | null> {
    return await this.repo.findOne({ where: { id: artifact_id } });
  }

  async artifactExistsById(artifact_id: string): Promise<boolean> {
    return await this.repo.existsBy({ id: artifact_id });
  }

  async deleteArtifact(artifact_id: string): Promise<void> {
    await this.repo.delete({ id: artifact_id });
  }
}
