import { inject, injectable } from "inversify";
import { UserRepositoryDB } from "../repositories/user.repositorie";
import { TYPES } from "../types/types";
import { User, UserRole, UserStatus } from "../entities/User";
import { UserResponseDto } from "../dtos/user/response/user.response.dto";

export interface IUserService {
  changeUserRole(userId: string, role: UserRole): Promise<void>;
  findUserById(id: string): Promise<User>;
  userIsResearcher(userId: string): Promise<boolean>;
  banUser(userId: string): Promise<void>;
  getAllUsers(): Promise<UserResponseDto[]>;
  getUserProfileInfo(userId: string): Promise<UserResponseDto>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepositoryDB) private userRepository: UserRepositoryDB
  ) {}

  public async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("user does not exist");
    }

    return user;
  }

  public async getUserProfileInfo(userId: string): Promise<UserResponseDto> {
    const user = await this.findUserById(userId);
    return this.entityToDto(user);
  }

  public async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.entityToDto(user));
  }

  public async banUser(userId: string): Promise<void> {
    const user = await this.findUserById(userId);

    if (user.status === UserStatus.BANNED) {
      throw new Error("user already banned");
    }

    user.status = UserStatus.BANNED;
    await this.userRepository.save(user);
  }

  private entityToDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      instituition: user.institution,
      bio: user.bio,
      joinedAt: user.createdAt,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    };
  }

  public async changeUserRole(userId: string, role: UserRole): Promise<void> {
    const user = await this.findUserById(userId);
    user.role = role;
    await this.userRepository.save(user);
  }

  public async userIsResearcher(userId: string): Promise<boolean> {
    return await this.userRepository.userIsResearcher(userId);
  }
}
