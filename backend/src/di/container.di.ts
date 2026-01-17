import { Container } from "inversify";
import { TYPES } from "../types/types";

// Repositories
import {
  IUserRepository,
  UserRepositoryDB,
} from "../repositories/user.repositorie";
import {
  IResearcherRequestRepositorie,
  ResearcherRequestRepositorieDB,
} from "../repositories/researcher.request.repositorie";
import {
  ArtifactRepositoryDB,
  IArtifactRepository,
} from "../repositories/artifact.repositorie";
import {
  ArtifactCollectionRepositoryDB,
  IArtifactCollectionRepository,
} from "../repositories/artifact.collection.repository";
import {
  CommunityRepositoryDB,
  ICommunityRepository,
} from "../repositories/community.repository";
import {
  IUserCommunityRepository,
  UserCommunityRepositoryDB,
} from "../repositories/user.community.repository";
import {
  IPostRepository,
  PostRepositoryDB,
} from "../repositories/post.repository";
import {
  IPostMediaRepository,
  PostMediaRepositoryDB,
} from "../repositories/post.media.repository";
import { LikeRepositoryDB, ILikeRepository } from "../repositories/like.repository";
import { CommentRepositoryDB, ICommentRepository } from "../repositories/comment.repository";

// Services
import { AuthService, IAuthService } from "../services/auth.service";
import { IUserService, UserService } from "../services/user.service";
import {
  IResearcherRequestService,
  ResearcherRequestService,
} from "../services/researcher.request.service";
import {
  ArtifactService,
  IArtifactService,
} from "../services/artifact.service";
import {
  ArtifactCollectionService,
  IArtifactCollectionService,
} from "../services/artifact.collection.service";
import {
  CommunityService,
  ICommunityService,
} from "../services/community.service";
import {
  CommunityUserService,
  ICommunityUserService,
} from "../services/community.user.service";
import { IPostService, PostService } from "../services/post.service";
import {
  IPostMediaService,
  PostMediaService,
} from "../services/post.media.service";
import { LikeService, ILikeService } from "../services/like.service";
import { CommentService, ICommentService } from "../services/comment.service";

// Controllers
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";
import { ResearcherRequestController } from "../controllers/researcher.request.controller";
import { ArtifactController } from "../controllers/artifact.controller";
import { ArtifactCollectionController } from "../controllers/artifact.collection.controller";
import { CommunityController } from "../controllers/community.controller";
import { CommunityUserController } from "../controllers/community.user.controller";
import { PostController } from "../controllers/post.controller";
import { PostMediaController } from "../controllers/post.media.controller";
import { LikeController } from "../controllers/like.controller";
import { CommentController } from "../controllers/comment.controller";

export const container: Container = new Container();

// Camada de Autenticação e Usuário
container.bind<IUserRepository>(TYPES.UserRepositoryDB).to(UserRepositoryDB);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);

// Researcher Requests
container
  .bind<IResearcherRequestRepositorie>(TYPES.ResearcherRequestRepositoryDB)
  .to(ResearcherRequestRepositorieDB);
container
  .bind<IResearcherRequestService>(TYPES.ResearcherRequestService)
  .to(ResearcherRequestService);
container
  .bind<ResearcherRequestController>(TYPES.ResearcherRequestController)
  .to(ResearcherRequestController);

// Artifacts
container
  .bind<IArtifactRepository>(TYPES.ArtifactRepositoryDB)
  .to(ArtifactRepositoryDB);
container.bind<IArtifactService>(TYPES.ArtifactService).to(ArtifactService);
container
  .bind<ArtifactController>(TYPES.ArtifactController)
  .to(ArtifactController);

// Artifact Collections
container
  .bind<IArtifactCollectionRepository>(TYPES.ArtifactCollectionRepositoryDB)
  .to(ArtifactCollectionRepositoryDB);
container
  .bind<IArtifactCollectionService>(TYPES.ArtifactCollectionService)
  .to(ArtifactCollectionService);
container
  .bind<ArtifactCollectionController>(TYPES.ArtifactCollectionController)
  .to(ArtifactCollectionController);

// Communities
container
  .bind<ICommunityRepository>(TYPES.CommunityRepositoryDB)
  .to(CommunityRepositoryDB);
container.bind<ICommunityService>(TYPES.CommunityService).to(CommunityService);
container
  .bind<CommunityController>(TYPES.CommunityController)
  .to(CommunityController);

// Community Users
container
  .bind<IUserCommunityRepository>(TYPES.CommunityUserRepositoryDB)
  .to(UserCommunityRepositoryDB);
container
  .bind<ICommunityUserService>(TYPES.CommunityUserService)
  .to(CommunityUserService);
container
  .bind<CommunityUserController>(TYPES.CommunityUserController)
  .to(CommunityUserController);

// Posts
container.bind<IPostRepository>(TYPES.PostRepositoryDB).to(PostRepositoryDB);
container.bind<IPostService>(TYPES.PostService).to(PostService);
container.bind<PostController>(TYPES.PostController).to(PostController);

// Post Media
container
  .bind<IPostMediaRepository>(TYPES.PostMediaRepositoryDB)
  .to(PostMediaRepositoryDB);
container.bind<IPostMediaService>(TYPES.PostMediaService).to(PostMediaService);
container
  .bind<PostMediaController>(TYPES.PostMediaController)
  .to(PostMediaController);

// Likes
container
  .bind<ILikeRepository>(TYPES.LikeRepository)
  .to(LikeRepositoryDB);
container
  .bind<ILikeService>(TYPES.LikeService)
  .to(LikeService);
container
  .bind<LikeController>(TYPES.LikeController)
  .to(LikeController);

// Comments
container
  .bind<ICommentRepository>(TYPES.CommentRepository)
  .to(CommentRepositoryDB);
container
  .bind<ICommentService>(TYPES.CommentService)
  .to(CommentService);
container
  .bind<CommentController>(TYPES.CommentController)
  .to(CommentController);