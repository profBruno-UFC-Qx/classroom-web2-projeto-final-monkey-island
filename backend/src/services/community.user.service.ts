import { injectable, inject } from "inversify";
import { CommunityUserResponseDto } from "../dtos/community_user/response/community.user.response.dto";
import { CommunityUserSearchResponseDto } from "../dtos/community_user/response/community.user.search.dto";
import { TYPES } from "../types/types";
import {
  IUserCommunityRepository,
  UserWithCommunityData,
} from "../repositories/user.community.repository";
import { CommunityUser, CommunityUserStatus } from "../entities/community.user";
import { User } from "../entities/User";
import { Community } from "../entities/community";
import { CommunitiesOfUserResponseDto } from "../dtos/community_user/response/communies.of.user.response.dto";
import { BanRequestDto } from "../dtos/community_user/request/ban.request.dto";
import { suspendRequestDto } from "../dtos/community_user/request/suspend.request.dto";

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
  ): Promise<CommunitiesOfUserResponseDto>;
  listUsersOfCommunity(
    communityId: string,
    page?: number,
    limit?: number
  ): Promise<CommunityUserSearchResponseDto>;
  banUser(
    targetUserId: string,
    communityId: string,
    banRequest: BanRequestDto
  ): Promise<CommunityUserResponseDto>;
  suspendUser(
    targetUserId: string,
    communityId: string,
    suspendRequestDto: suspendRequestDto
  ): Promise<CommunityUserResponseDto>;
  unsuspendUser(
    targetUserId: string,
    communityId: string
  ): Promise<CommunityUserResponseDto>;
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
    console.log(userInCommunity);
    return this.entityToResponseDto(userInCommunity as CommunityUser);
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

    if (communityUser.community.createdBy.id === userId) {
      throw new Error("the community owner cannot leave");
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

  async banUser(
    targetUserId: string,
    communityId: string,
    banRequest: BanRequestDto
  ): Promise<CommunityUserResponseDto> {
    const communityUser =
      await this.communityUserRepository.findByUserAndCommunity(
        targetUserId,
        communityId
      );

    if (!communityUser) {
      throw new Error("user does not exist in this community");
    }

    if (communityUser.community.createdBy.id === targetUserId) {
      throw new Error("the community owner cannot ban themselves");
    }

    if (communityUser.status === CommunityUserStatus.BANNED) {
      throw new Error("user already banned");
    }

    communityUser.bannedAt = new Date();
    communityUser.banReason = banRequest.banReason;
    communityUser.status = CommunityUserStatus.BANNED;

    const responseData = await this.communityUserRepository.save(communityUser);
    return this.entityToResponseDto(responseData);
  }

  async suspendUser(
    targetUserId: string,
    communityId: string,
    suspendRequestDto: suspendRequestDto
  ): Promise<CommunityUserResponseDto> {
    const communityUser =
      await this.communityUserRepository.findByUserAndCommunity(
        targetUserId,
        communityId
      );

    if (!communityUser) {
      throw new Error("user does not exist in this community");
    }

    if (communityUser.community.createdBy.id === targetUserId) {
      throw new Error("the community owner cannot suspend themselves");
    }

    if (communityUser.status === CommunityUserStatus.SUSPENDED) {
      throw new Error("user already suspended");
    }

    if (communityUser.status === CommunityUserStatus.BANNED) {
      throw new Error("user is banned");
    }

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);

    const maxDate = new Date(suspendRequestDto.suspensionEndsAt);
    if (maxDate.getTime() < minDate.getTime()) {
      throw new Error("suspension must be at least 1 day long");
    }

    communityUser.suspendedAt = new Date();
    communityUser.suspensionEndsAt = suspendRequestDto.suspensionEndsAt;
    communityUser.status = CommunityUserStatus.SUSPENDED;

    const responseData = await this.communityUserRepository.save(communityUser);
    return this.entityToResponseDto(responseData);
  }

  async unsuspendUser(
    targetUserId: string,
    communityId: string
  ): Promise<CommunityUserResponseDto> {
    const communityUser =
      await this.communityUserRepository.findByUserAndCommunity(
        targetUserId,
        communityId
      );

    if (!communityUser) {
      throw new Error("user does not exist in this community");
    }

    if (communityUser.community.createdBy.id === targetUserId) {
      throw new Error("the community owner cannot unsuspend themselves");
    }

    if (communityUser.status !== CommunityUserStatus.SUSPENDED) {
      throw new Error("user is not suspended");
    }

    communityUser.suspendedAt = null;
    communityUser.suspensionEndsAt = null;
    communityUser.status = CommunityUserStatus.ACTIVE;

    const responseData = await this.communityUserRepository.save(communityUser);
    return this.entityToResponseDto(responseData);
  }

  async listCommunitiesOfUser(
    user_id: string,
    page?: number,
    limit?: number
  ): Promise<CommunitiesOfUserResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);

    const skip = (currentPage - 1) * currentLimit;

    const [items, total] =
      await this.communityUserRepository.findCommunitiesByUserId(
        user_id,
        skip,
        currentLimit
      );

    return {
      data: items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        createdAt: item.createdAt,
      })),
      totalItems: total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  async listUsersOfCommunity(
    communityId: string,
    page?: number,
    limit?: number
  ): Promise<CommunityUserSearchResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);

    const skip = (currentPage - 1) * currentLimit;

    const [items, total] =
      await this.communityUserRepository.findUsersOfTheCommunity(
        communityId,
        skip,
        currentLimit
      );

    return {
      data: items.map((item) => this.entityToResponseDto(item)),
      totalItems: total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  private entityToResponseDto(
    communityUser: CommunityUser | UserWithCommunityData
  ): CommunityUserResponseDto {
    console.log();
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
