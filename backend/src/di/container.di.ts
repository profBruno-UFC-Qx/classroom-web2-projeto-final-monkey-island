import { Container } from "inversify";
import { TYPES } from "../types/types";
import {
  IUserRepository,
  UserRepositoryDB,
} from "../repositories/user.repositorie";

import { AuthService, IAuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { IUserService, UserService } from "../services/user.service";

export const container: Container = new Container();

//essa é pra camada de autenticação macaco :)
container.bind<IUserRepository>(TYPES.UserRepositoryDB).to(UserRepositoryDB);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

//essa daqui é pra camada de usuário macaco ;), é uma boa prática deixar o fluxo de auth e user separados
container.bind<IUserService>(TYPES.UserService).to(UserService);
