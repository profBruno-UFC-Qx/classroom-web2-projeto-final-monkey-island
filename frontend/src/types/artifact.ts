import type { PaginatedResponse } from './common';

export type ArtifactRarity = 
  | "fragment"
  | "partial_fossil"
  | "rare"
  | "exceptional_specimen"
  | "unique_specimen";

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: ArtifactRarity;
  image: string; 
}

export interface ArtifactCollectionItem {
  artifact: Artifact;
  quantity: number;
}


export type ArtifactCollectionResponse = PaginatedResponse<ArtifactCollectionItem>;