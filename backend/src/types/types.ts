import { ResearcherRequestRepositorieDB } from "../repositories/researcher.request.repositorie";
import { CommunityService } from "../services/community.service";

export const TYPES = {
  UserRepositoryDB: Symbol.for("UserRepositoryDB"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  UserService: Symbol.for("UserService"),
  ResearcherRequestRepositoryDB: Symbol.for("ResearcherRequestRepositoryDB"),
  ResearcherRequestService: Symbol.for("ResearcherRequestService"),
  ResearcherRequestController: Symbol.for("ResearcherRequestController"),
  ArtifactRepositoryDB: Symbol.for("ArtifactRepositoryDB"),
  ArtifactService: Symbol.for("ArtifactService"),
  ArtifactController: Symbol.for("ArtifactController"),
  ArtifactCollectionRepositoryDB: Symbol.for("ArtifactCollectionRepository"),
  ArtifactCollectionService: Symbol.for("ArtifactCollectionService"),
  ArtifactCollectionController: Symbol.for("ArtifactCollectionController"),
  CommunityRepositoryDB: Symbol.for("CommunityRepositoryDB"),
  CommunityService: Symbol.for("CommunityService"),
};
