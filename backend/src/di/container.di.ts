import { Container } from "inversify";
import { User } from "../entities/User";
import { AppDataSource } from "../config/db.connection";
import { TYPES } from "../types/types";
import {
  IUserRepository,
  UserRepositoryDB,
} from "../repositories/user.repositorie";

export const container: Container = new Container();

container.bind<IUserRepository>(TYPES.UserRepositoryDB).to(UserRepositoryDB);
