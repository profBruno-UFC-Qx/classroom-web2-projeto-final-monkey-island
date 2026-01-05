import { ArtifactRarity } from "../../../entities/artifact";

export interface ArtifactUpdateRequestDto {
  name?: string;
  rarity?: ArtifactRarity;
  description?: string;
}
