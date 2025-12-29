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
import { ArtifactController } from "../controllers/artifact.controller";
import {
  ArtifactCollectionRepositoryDB,
  IArtifactCollectionRepository,
} from "../repositories/artifact.collection.repository";
import {
  ArtifactCollectionService,
  IArtifactCollectionService,
} from "../services/artifact.collection.service";
import { ArtifactCollectionController } from "../controllers/artifact.collection.controller";

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

container
  .bind<ArtifactController>(TYPES.ArtifactController)
  .to(ArtifactController);

//aqui é pra collection

container
  .bind<IArtifactCollectionRepository>(TYPES.ArtifactCollectionRepositoryDB)
  .to(ArtifactCollectionRepositoryDB);

container
  .bind<IArtifactCollectionService>(TYPES.ArtifactCollectionService)
  .to(ArtifactCollectionService);

container
  .bind<ArtifactCollectionController>(TYPES.ArtifactCollectionController)
  .to(ArtifactCollectionController);
