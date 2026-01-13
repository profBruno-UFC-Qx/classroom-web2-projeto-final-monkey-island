export enum ArtifactRarity {
  FRAGMENT = "fragment",
  PARTIAL_FOSSIL = "partial_fossil",
  RARE_FOSSIL = "rare",
  EXCEPTIONAL_SPECIMEN = "exceptional_specimen",
  UNIQUE_SPECIMEN = "unique_specimen",
}


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


export interface ArtifactCollectionResponse {
  data: ArtifactCollectionItem[];
  totalItems: number;
  totalPages: number;
}