import { Community } from "../entities/community";
import { CommunityUser, CommunityUserStatus } from "../entities/community.user";
import { User } from "../entities/User";

export interface IUserCommunityRepository {
  save(commityUser: CommunityUser): Promise<void>;
  findUsersOfTheCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<[User[], number]>;
  findUsersOfTheCommunityByStatus(
    communityId: string,
    status: CommunityUserStatus,
    skip: number,
    take: number
  ): Promise<[User[], number]>;

  findByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityUser | null>;

  findCommunitiesByUserId(
    userId: string,
    skip: number,
    take: number
  ): Promise<[Community[], number]>;
}
