import { Container } from "inversify";
import { TYPES } from "../types/types";
import {
  IUserRepository,
  UserRepositoryDB,
} from "../repositories/user.repositorie";

import { AuthService, IAuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { IUserService, UserService } from "../services/user.service";
import {
  IResearcherRequestRepositorie,
  ResearcherRequestRepositorieDB,
} from "../repositories/researcher.request.repositorie";
import {
  IResearcherRequestService,
  ResearcherRequestService,
} from "../services/researcher.request.service";
import { ResearcherRequestController } from "../controllers/researcher.request.controller";
import {
  ArtifactRepositoryDB,
  IArtifactRepository,
} from "../repositories/artifact.repositorie";
import {
  ArtifactService,
  IArtifactService,
} from "../services/artifact.service";

export const container: Container = new Container();

//essa é pra camada de autenticação macaco :)
container.bind<IUserRepository>(TYPES.UserRepositoryDB).to(UserRepositoryDB);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

//essa daqui é pra camada de usuário macaco ;), é uma boa prática deixar o fluxo de auth e user separados
container.bind<IUserService>(TYPES.UserService).to(UserService);

//esse daqui é pra researcher :)
container
  .bind<IResearcherRequestRepositorie>(TYPES.ResearcherRequestRepositoryDB)
  .to(ResearcherRequestRepositorieDB);

container
  .bind<IResearcherRequestService>(TYPES.ResearcherRequestService)
  .to(ResearcherRequestService);

container
  .bind<ResearcherRequestController>(TYPES.ResearcherRequestController)
  .to(ResearcherRequestController);

// esse daqi é pra artifact
container
  .bind<IArtifactRepository>(TYPES.ArtifactRepositoryDB)
  .to(ArtifactRepositoryDB);

container.bind<IArtifactService>(TYPES.ArtifactService).to(ArtifactService);
