import { ArtifactRarity } from "../../../entities/artifact";

export interface ArtifactRequestDto {
  name: string;
  rarity: ArtifactRarity;
  description?: string;
}
