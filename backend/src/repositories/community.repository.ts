import { AppDataSource } from "../config/db.connection";
import { injectable } from "inversify";
import { Community } from "../entities/community";
import { Like } from "typeorm";

export interface ICommunityRepository {
  save(community: Community): Promise<void>;
  deleteCommunity(communityId: string): Promise<void>;
  getAllCommunitiesByUserId(userId: string): Promise<Community[]>;
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
