import { UserRole, UserStatus } from "../../../entities/User";

export interface UserResponseDto {
  id: string;
  name: string;
  instituition: string;
  bio: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: Date;
  joinedAt: Date;
}
