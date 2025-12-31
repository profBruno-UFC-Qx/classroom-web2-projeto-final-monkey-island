import { CommunityUserStatus } from "../../../entities/community.user";

export interface CommunityUserResponseDto {
  user: {
    id: string;
    name: string;
    bio: string;
  };
  communityData: {
    joinedAt: Date;
    bannedAt?: Date;
    leftAt?: Date;
    suspendedAt?: Date;
  };
}
