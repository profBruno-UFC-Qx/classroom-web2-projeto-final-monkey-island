import { Community } from "../entities/community";
import { CommunityUser, CommunityUserStatus } from "../entities/community.user";
import { User } from "../entities/User";
import { AppDataSource } from "../config/db.connection";

export interface UserCommunityData {
  joinedAt: Date;
  leftAt?: Date;
  bannedAt?: Date;
  suspendedAt?: Date;
}

export interface UserWithCommunityData {
  user: User;
  joinedAt: Date;
  leftAt?: Date;
  bannedAt?: Date;
  suspendedAt?: Date;
}

export interface IUserCommunityRepository {
  save(commityUser: CommunityUser): Promise<CommunityUser>;
  findUsersOfTheCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<[UserWithCommunityData[], number]>;
  findUsersOfTheCommunityByStatus(
    communityId: string,
    status: CommunityUserStatus,
    skip: number,
    take: number
  ): Promise<[UserWithCommunityData[], number]>;

  findByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityUser | null>;

  existsByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<boolean>;

  findCommunitiesByUserId(
    userId: string,
    skip: number,
    take: number
  ): Promise<[Community[], number]>;
}

export class UserCommunityRepositoryDB implements IUserCommunityRepository {
  private get repo() {
    return AppDataSource.getRepository(CommunityUser);
  }

  async save(commityUser: CommunityUser): Promise<CommunityUser> {
    return await this.repo.save(commityUser);
  }

  async findByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityUser | null> {
    return await this.repo.findOne({
      where: { user: { id: userId }, community: { id: communityId } },
      relations: ["community", "community.createdBy", "user"],
    });
  }

  async existsByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<boolean> {
    return await this.repo.exists({
      where: { user: { id: userId }, community: { id: communityId } },
    });
  }

  private mapCollection(items: CommunityUser[]): UserWithCommunityData[] {
    return items.map((item) => {
      let communityData = { joinedAt: item.joinedAt };

      let response: UserWithCommunityData = {
        user: item.user,
        ...communityData,
      };

      if (item.status === CommunityUserStatus.BANNED && item.bannedAt) {
        response = {
          ...response,
          bannedAt: item.bannedAt,
        };
      } else if (
        item.status === CommunityUserStatus.SUSPENDED &&
        item.suspendedAt
      ) {
        response = {
          ...response,
          suspendedAt: item.suspendedAt,
        };
      } else if (item.status === CommunityUserStatus.INACTIVE && item.leftAt) {
        response = {
          ...response,
          leftAt: item.leftAt,
        };
      }
      return response;
    });
  }

  async findUsersOfTheCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<[UserWithCommunityData[], number]> {
    const [items, total] = await this.repo.findAndCount({
      where: {
        community: { id: communityId },
        status: CommunityUserStatus.ACTIVE,
      },
      relations: ["user"],
      skip,
      take,
    });

    const mapped: UserWithCommunityData[] = this.mapCollection(items);
    return [mapped, total];
  }

  async findCommunitiesByUserId(
    userId: string,
    skip: number,
    take: number
  ): Promise<[Community[], number]> {
    const [items, total] = await this.repo.findAndCount({
      where: { user: { id: userId }, status: CommunityUserStatus.ACTIVE },
      relations: ["community", "community.createdBy"],
      skip,
      take,
    });

    const mapped = items.map((item) => item.community);
    return [mapped, total];
  }

  async findUsersOfTheCommunityByStatus(
    communityId: string,
    status: CommunityUserStatus,
    skip: number,
    take: number
  ): Promise<[UserWithCommunityData[], number]> {
    const [items, total] = await this.repo.findAndCount({
      where: {
        community: { id: communityId },
        status,
      },
      relations: ["user"],
      skip,
      take,
    });
    const mapped: UserWithCommunityData[] = this.mapCollection(items);
    return [mapped, total];
  }
}
