import { ArtifactRarity } from "../entities/artifact";

export interface IArtifactCollectionService {
  addArtifactInCollection(user_id: string, artifact_id: string): Promise<void>;
  getAllArtifactsByRarity(rarity: ArtifactRarity): Promise<>;
}
