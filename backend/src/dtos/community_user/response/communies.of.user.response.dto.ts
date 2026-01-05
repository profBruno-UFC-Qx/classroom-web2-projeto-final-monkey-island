import { CommunityResponseDto } from "../../community/response/community.response.dto";
import { CommunityUserResponseDto } from "./community.user.response.dto";

export interface CommunitiesOfUserResponseDto {
  data: CommunityResponseDto[];
  totalItems: number;
  totalPages: number;
}
