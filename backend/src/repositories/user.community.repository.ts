import { CommunityUser } from "../entities/community.user";

export interface IUserCommunityRepository {
  save(commityUser: CommunityUser): Promise<void>;
  deleteByUserId(userId: string, communityId: string): Promise<void>;
  findUsersOfTheCommunity(
    communityId: string,
    skip: number,
    take: number
  ): Promise<[]>;
}
