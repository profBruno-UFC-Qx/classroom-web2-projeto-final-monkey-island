import { User } from "../entities/User";
import { AppDataSource } from "../config/db.connection";

export interface IUserRepository {
  create(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
}

export class UserRepositoryDB implements IUserRepository {
  private repo = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  async create(user: User): Promise<void> {
    await this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }
}
