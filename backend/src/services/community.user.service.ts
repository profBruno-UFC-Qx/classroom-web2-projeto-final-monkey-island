import { injectable, inject } from "inversify";
import { CommunityUserResponseDto } from "../dtos/community_user/response/community.user.response.dto";
import { CommunityUserSearchResponseDto } from "../dtos/community_user/response/community.user.search.dto";
import { TYPES } from "../types/types";
import { ICommunityRepository } from "../repositories/community.repository";
import { IUserCommunityRepository } from "../repositories/user.community.repository";
import { CommunityUser, CommunityUserStatus } from "../entities/community.user";
import { User } from "../entities/User";
import { Community } from "../entities/community";

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

@injectable()
export class CommunityUserService implements ICommunityUserService {
  constructor(
    @inject(TYPES.CommunityUserRepositoryDB)
    private communityUserRepository: IUserCommunityRepository
  ) {}

  async joinInCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityUserResponseDto> {
    let userInCommunity =
      await this.communityUserRepository.findByUserAndCommunity(
        userId,
        communityId
      );

    if (userInCommunity) {
      if (userInCommunity.status === CommunityUserStatus.ACTIVE) {
        throw new Error("user already in this community");
      } else if (userInCommunity.status === CommunityUserStatus.BANNED) {
        throw new Error("You are banned from this community");
      } else if (userInCommunity.status === CommunityUserStatus.SUSPENDED) {
        throw new Error("You are temporarily suspended from this community");
      }
      userInCommunity.status = CommunityUserStatus.ACTIVE;
      userInCommunity.leftAt = null;
    } else {
      userInCommunity = new CommunityUser();
      userInCommunity.user = { id: userId } as User;
      userInCommunity.community = { id: communityId } as Community;
    }
    userInCommunity = await this.communityUserRepository.save(userInCommunity);
    return this.entityToResponseDto(userInCommunity);
  }

  async leftOfCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityUserResponseDto> {
    const communityUser =
      await this.communityUserRepository.findByUserAndCommunity(
        userId,
        communityId
      );

    if (!communityUser) {
      throw new Error("user is not part of this community");
    }

    if (communityUser.status === CommunityUserStatus.INACTIVE) {
      throw new Error("user already left this community");
    } else if (communityUser.status === CommunityUserStatus.BANNED) {
      throw new Error("banned users cannot leave communities");
    } else if (communityUser.status === CommunityUserStatus.SUSPENDED) {
      throw new Error("suspended users cannot leave communities");
    }

    communityUser.status = CommunityUserStatus.INACTIVE;
    communityUser.leftAt = new Date();

    const response = await this.communityUserRepository.save(communityUser);
    return this.entityToResponseDto(response);
  }

  async listCommunitiesOfUser(
    user_id: string,
    page?: number,
    limit?: number
  ): Promise<CommunityUserSearchResponseDto> {}

  private entityToResponseDto(
    communityUser: CommunityUser
  ): CommunityUserResponseDto {
    return {
      user: {
        id: communityUser.user.id,
        name: communityUser.user.name,
        bio: communityUser.user.bio,
      },
      communityData: {
        joinedAt: communityUser.joinedAt,
        bannedAt: communityUser.bannedAt ?? undefined,
        leftAt: communityUser.leftAt ?? undefined,
        suspendedAt: communityUser.suspendedAt ?? undefined,
      },
    };
  }
}
