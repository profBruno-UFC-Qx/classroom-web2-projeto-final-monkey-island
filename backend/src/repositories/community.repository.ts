import { AppDataSource } from "../config/db.connection";
import { injectable } from "inversify";
import { Community } from "../entities/community";
import { Like } from "typeorm";

export interface ICommunityRepository {
  save(community: Community): Promise<Community>;
  deleteCommunity(communityId: string): Promise<void>;
  getCommunitiesCreatedByUser(userId: string): Promise<Community[]>;
  findAllCommunitiesByNameLike(
    name: string,
    skip: number,
    take: number
  ): Promise<[Community[], number]>;
  getPopularCommunities(
    skip: number,
    take: number
  ): Promise<[Community[], number]>;
}
