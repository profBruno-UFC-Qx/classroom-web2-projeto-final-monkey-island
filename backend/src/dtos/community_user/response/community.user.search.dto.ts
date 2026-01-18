import { CommunityUserResponseDto } from "./community.user.response.dto";

export interface CommunityUserSearchResponseDto {
  data: CommunityUserResponseDto[];
  totalItems: number;
  totalPages: number;
}
