import { inject, injectable } from "inversify";
import { UserRepositoryDB } from "../repositories/user.repositorie";
import { TYPES } from "../types/types";
import { User, UserRole } from "../entities/User";

export interface IUserService {
  changeUserRole(userId: string, role: UserRole): Promise<void>;
  findUserById(id: string): Promise<User>;
  userIsResearcher(userId: string): Promise<boolean>;
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

  public async changeUserRole(userId: string, role: UserRole): Promise<void> {
    const user = await this.findUserById(userId);
    user.role = role;
    await this.userRepository.save(user);
  }

  public async userIsResearcher(userId: string): Promise<boolean> {
    return await this.userRepository.userIsResearcher(userId);
  }
}
