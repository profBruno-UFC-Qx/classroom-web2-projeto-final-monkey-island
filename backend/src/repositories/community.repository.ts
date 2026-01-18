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
  findCommunityById(id: string): Promise<CommunityWithCount | null>;
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

  async findCommunityById(id: string): Promise<CommunityWithCount | null> {
    const qb = this.repo
      .createQueryBuilder("community")
      .addSelect((subQuery) => {
        return subQuery
          .select("COUNT(cu.id)", "memberCount")
          .from("community_user", "cu")
          .where("cu.communityId = community.id")
          .andWhere("cu.status = :status", { status: "ACTIVE" });
      }, "memberCount")
      .where("community.id = :id", { id })
      .leftJoinAndSelect("community.createdBy", "createdBy");

    const community = await qb.getRawAndEntities();

    if (!community.entities[0]) return null;

    return {
      ...community.entities[0],
      memberCount: Number(community.raw[0].memberCount),
    };
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
      .addSelect((subQuery) => {
        return subQuery
          .select("COUNT(cu.id)", "memberCount")
          .from("community_user", "cu")
          .where("cu.communityId = community.id")
          .andWhere("cu.status = :status", { status: "ACTIVE" });
      }, "memberCount")
      .orderBy("memberCount", "DESC")
      .skip(skip)
      .take(take);

    const communities = await qb.getRawAndEntities();

    const total = await this.repo.count();

    const result = communities.entities.map((community, index) => ({
      ...community,
      memberCount: Number(communities.raw[index].memberCount),
    }));

    return [result as CommunityWithCount[], total];
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
