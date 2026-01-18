import { injectable } from "inversify";
import { User, UserRole } from "../entities/User";
import { AppDataSource } from "../config/db.connection";

export interface IUserRepository {
  save(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  findById(id: string): Promise<User | null>;
  getById(id: string): Promise<User | null>; 
  userIsResearcher(userId: string): Promise<boolean>;
}

@injectable()
export class UserRepositoryDB implements IUserRepository {
  private get repo() {
    return AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  async findById(id: string): Promise<User | null> {
    if (!id) return null;
    return await this.repo.findOne({ where: { id } });
  }

  async getById(id: string): Promise<User | null> {
    return this.findById(id);
  }

  async save(user: User): Promise<void> {
    await this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.repo.existsBy({ email });
  }

  async userIsResearcher(userId: string): Promise<boolean> {
    if (!userId) return false;
    return await this.repo.existsBy({ 
      id: userId, 
      role: UserRole.RESEARCHER 
    });
  }
}