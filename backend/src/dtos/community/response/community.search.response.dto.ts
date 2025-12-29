import { CommunityResponseDto } from "./community.response.dto";

export interface CommunitySearchResponseDto {
  data: CommunityResponseDto[];
  totalItems: number;
  totalPages: number;
}
