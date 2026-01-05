import { ArtifactResponsetDto } from "../../artifact/response/artifact.response";

export interface ArtifactCollectionResponseDto {
  data: { artifact: ArtifactResponsetDto; quantity: number }[];
  totalItems: number;
  totalPages: number;
}
