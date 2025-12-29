import { AppDataSource } from "../config/db.connection";
import { injectable } from "inversify";
import { Community } from "../entities/community";
import { Like } from "typeorm";

export interface ICommunityRepository {
  save(community: Community): Promise<Community>;
  deleteCommunity(communityId: string): Promise<void>;
  findCommunitiesCreatedByUser(userId: string): Promise<Community[]>;
  findAllCommunitiesByNameLike(
    name: string,
    skip: number,
    take: number
  ): Promise<[Community[], number]>;
  findPopularCommunities(
    skip: number,
    take: number
  ): Promise<[Community[], number]>;
}

export class CommunityRepositoryDB implements ICommunityRepository {
  private get repo() {
    return AppDataSource.getRepository(Community);
  }

  async save(community: Community): Promise<Community> {
    return this.repo.save(community);
  }

  async deleteCommunity(communityId: string): Promise<void> {
    this.repo.delete({ id: communityId });
  }

  async findCommunitiesCreatedByUser(userId: string): Promise<Community[]> {
    return this.repo.find({
      where: { createdBy: { id: userId } },
      order: { createdAt: "DESC" },
    });
  }
}
