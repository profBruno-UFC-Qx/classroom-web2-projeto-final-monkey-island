import { inject, injectable } from "inversify";
import { UserRepositoryDB } from "../repositories/user.repositorie";
import { TYPES } from "../types/types";
import { User, UserRole } from "../entities/User";

export interface IUserService {
  changeUserRole(userId: string, role: UserRole): Promise<void>;
  findUserById(id: string): Promise<User>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepositoryDB) private userRepository: UserRepositoryDB
  ) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("user does not exist");
    }

    return user;
  }

  async changeUserRole(userId: string, role: UserRole): Promise<void> {
    const user = await this.findUserById(userId);
    user.role = role;
    await this.userRepository.save(user);
  }
}
