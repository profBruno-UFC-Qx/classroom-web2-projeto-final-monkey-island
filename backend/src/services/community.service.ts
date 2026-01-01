import { inject, injectable } from "inversify";
import { CommunityRequestDto } from "../dtos/community/request/community.request.dto";
import { CommunityUpdateRequestDto } from "../dtos/community/request/community.update.request.dto";
import { CommunityResponseDto } from "../dtos/community/response/community.response.dto";
import { CommunitySearchResponseDto } from "../dtos/community/response/community.search.response.dto";
import { TYPES } from "../types/types";
import {
  CommunityWithCount,
  ICommunityRepository,
} from "../repositories/community.repository";
import { Community } from "../entities/community";
import { User } from "../entities/User";

import { applyPartialUpdate } from "../util/merge-function";
import { ICommunityUserService } from "./community.user.service";

export interface ICommunityService {
  createCommunity(
    userId: string,
    request: CommunityRequestDto
  ): Promise<CommunityResponseDto>;

  updateCommunityData(
    userId: string,
    communityId: string,
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

@injectable()
export class CommunityService implements ICommunityService {
  constructor(
    @inject(TYPES.CommunityRepositoryDB)
    private communityRepository: ICommunityRepository,
    @inject(TYPES.CommunityUserService)
    private communityUserService: ICommunityUserService
  ) {}

  async createCommunity(
    userId: string,
    request: CommunityRequestDto
  ): Promise<CommunityResponseDto> {
    const communityExists = await this.communityRepository.findCommunityByName(
      request.name
    );
    if (communityExists) {
      throw new Error(`community with name ${request.name} already exists!`);
    }
    const community = this.DtoToEntity({ id: userId } as User, request);
    const responseData = await this.communityRepository.save(community);
    await this.communityUserService.joinInCommunity(userId, responseData.id);
    return this.entityToResponseDto(responseData);
  }

  async updateCommunityData(
    userId: string,
    communityID: string,
    request: CommunityUpdateRequestDto
  ): Promise<CommunityResponseDto> {
    const community =
      await this.communityRepository.findCommunityById(communityID);

    if (!community) {
      throw new Error("community not exists");
    }

    if (community.createdBy.id !== userId) {
      throw new Error("You do not have permission to perform this action");
    }

    const target = applyPartialUpdate(community, request);

    const responseData = await this.communityRepository.save(target);

    return this.entityToResponseDto(responseData);
  }

  async deleteCommunityById(
    userId: string,
    communityId: string
  ): Promise<void> {
    const community =
      await this.communityRepository.findCommunityById(communityId);

    if (!community) {
      throw new Error("community not exists");
    }
    if (community.createdBy.id !== userId) {
      throw new Error("You do not have permission to perform this action");
    }
    await this.communityRepository.deleteCommunity(communityId);
  }

  async findCommunityByNameLike(
    name: string,
    page?: number,
    limit?: number
  ): Promise<CommunitySearchResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);

    const skip = (currentPage - 1) * currentLimit;

    const [items, total] =
      await this.communityRepository.findAllCommunitiesByNameLike(
        name,
        skip,
        currentLimit
      );

    return {
      data: items.map((item) => this.entityToResponseDto(item)),
      totalItems: total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  async findPopularCommunities(
    page?: number,
    limit?: number
  ): Promise<CommunitySearchResponseDto> {
    const currentPage = Math.max(page ?? 1, 1);
    const currentLimit = Math.min(limit ?? 10, 20);

    const skip = (currentPage - 1) * currentLimit;

    const [items, total] =
      await this.communityRepository.findPopularCommunities(skip, currentLimit);

    return {
      data: items.map((item) => this.entityToResponseDto(item)),
      totalItems: total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  private DtoToEntity(user: User, request: CommunityRequestDto): Community {
    const community = new Community();
    community.createdBy = user;
    community.name = request.name;
    community.description = request.description ?? "";
    return community;
  }

  private entityToResponseDto(
    community: CommunityWithCount | Community
  ): CommunityResponseDto {
    let response: CommunityResponseDto = {
      id: community.id,
      name: community.name,
      description: community.description,
      createdAt: community.createdAt,
    };

    if ("memberCount" in community && community.memberCount !== undefined) {
      response = { ...response, memberCount: community.memberCount };
    }

    return response;
  }
}
