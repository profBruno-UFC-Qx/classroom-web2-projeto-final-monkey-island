import { ArtifactResponsetDto } from "./artifact.response";

export interface ArtifactsResponseDto {
  data: ArtifactResponsetDto[];
  totalItems: number;
  totalPages: number;
}
