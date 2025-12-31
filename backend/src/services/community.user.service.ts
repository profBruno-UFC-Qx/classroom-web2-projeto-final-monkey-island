import { CommunityUserResponseDto } from "../dtos/community_user/response/community.user.response.dto";
import { CommunityUserSearchResponseDto } from "../dtos/community_user/response/community.user.search.dto";

export interface ICommunityUserService {
  joinInCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityUserResponseDto>;
  leftOfCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityUserResponseDto>;
  listCommunitiesOfUser(
    user_id: string,
    page?: number,
    limit?: number
  ): Promise<CommunityUserSearchResponseDto>;
  listUsersOfCommunity(
    communityId: string,
    page?: number,
    limit?: number
  ): Promise<CommunityUserSearchResponseDto>;
  banUser(userId: string): Promise<CommunityUserResponseDto>;
  suspendUser(userId: string): Promise<CommunityUserResponseDto>;
  unsuspendUser(userId: string): Promise<CommunityUserResponseDto>;
}
