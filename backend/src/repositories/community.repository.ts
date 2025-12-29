import { AppDataSource } from "../config/db.connection";
import { injectable } from "inversify";
import { Community } from "../entities/community";
import { Like } from "typeorm";

export interface CommunityWithCount extends Community {
  memberCount?: number;
}

export interface ICommunityRepository {
  save(community: Community): Promise<Community>;
  deleteCommunity(communityId: string): Promise<void>;
  findCommunityByName(name: string): Promise<Community | null>;
  findCommunitiesCreatedByUser(userId: string): Promise<Community[]>;
  findAllCommunitiesByNameLike(
    name: string,
    skip: number,
    take: number
  ): Promise<[Community[], number]>;
  findPopularCommunities(
    skip: number,
    take: number
  ): Promise<[CommunityWithCount[], number]>;
}

@injectable()
export class CommunityRepositoryDB implements ICommunityRepository {
  private get repo() {
    return AppDataSource.getRepository(Community);
  }

  async save(community: Community): Promise<Community> {
    return await this.repo.save(community);
  }

  async deleteCommunity(communityId: string): Promise<void> {
    await this.repo.delete({ id: communityId });
  }

  async findCommunityByName(name: string): Promise<Community | null> {
    return await this.repo.findOne({ where: { name } });
  }

  async findCommunitiesCreatedByUser(userId: string): Promise<Community[]> {
    return await this.repo.find({
      where: { createdBy: { id: userId } },
      order: { createdAt: "DESC" },
    });
  }

  async findPopularCommunities(
    skip: number,
    take: number
  ): Promise<[CommunityWithCount[], number]> {
    const qb = this.repo
      .createQueryBuilder("community")
      .leftJoinAndSelect("community.members", "member")
      .loadRelationCountAndMap("community.memberCount", "community.members")
      .orderBy("community.memberCount", "DESC")
      .skip(skip)
      .take(take);

    const communities = await qb.getMany();
    const total = await this.repo.count();
    return [communities as CommunityWithCount[], total];
  }

  async findAllCommunitiesByNameLike(
    name: string,
    skip: number,
    take: number
  ): Promise<[Community[], number]> {
    return await this.repo.findAndCount({
      where: { name: Like(`%${name}%`) },
      skip,
      take,
    });
  }
}
