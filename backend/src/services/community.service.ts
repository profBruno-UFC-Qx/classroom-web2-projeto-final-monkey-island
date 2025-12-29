import { CommunityRequestDto } from "../dtos/community/request/community.request.dto";
import { CommunityUpdateRequestDto } from "../dtos/community/request/community.update.request.dto";
import { CommunityResponseDto } from "../dtos/community/response/community.response.dto";
import { CommunitySearchResponseDto } from "../dtos/community/response/community.search.response.dto";

export interface ICommunityService {
  createCommunity(
    userId: string,
    request: CommunityRequestDto
  ): Promise<CommunityResponseDto>;

  updateCommunityData(
    userId: string,
    request: CommunityUpdateRequestDto
  ): Promise<CommunityResponseDto>;

  deleteCommunityById(userId: string, communityId: string): Promise<void>;

  findCommunityByNameLike(
    name: string,
    page?: number,
    limit?: number
  ): Promise<CommunitySearchResponseDto>;

  findPopularCommunities(
    page?: number,
    limit?: number
  ): Promise<CommunitySearchResponseDto>;
}
