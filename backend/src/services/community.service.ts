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

@injectable()
export class CommunityService implements ICommunityService {
  constructor(
    @inject(TYPES.CommunityRepositoryDB)
    private communityRepository: ICommunityRepository
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
    return this.entityToResponseDto(responseData);
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
