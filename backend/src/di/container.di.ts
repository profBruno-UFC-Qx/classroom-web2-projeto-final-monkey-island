import { Container } from "inversify";
import { User } from "../entities/User";
import { AppDataSource } from "../config/db.connection";
import { TYPES } from "../types/types";

export const container: Container = new Container();

const UserRepositoryDB = AppDataSource.getRepository(User);
container.bind(TYPES.UserRepositoryDB).toConstantValue(UserRepositoryDB);
