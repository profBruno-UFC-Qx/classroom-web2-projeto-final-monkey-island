import { ArtifactRarity } from "../../../entities/artifact";

export interface ArtifactResponsetDto {
  id: string;
  name: string;
  rarity: ArtifactRarity;
  description: string;
  image: string;
}
