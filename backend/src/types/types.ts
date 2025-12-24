import { ResearcherRequestRepositorieDB } from "../repositories/researcher.request.repositorie";

export const TYPES = {
  UserRepositoryDB: Symbol.for("UserRepositoryDB"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  UserService: Symbol.for("UserService"),
  ResearcherRequestRepositoryDB: Symbol.for("ResearcherRequestRepositoryDB"),
  ResearcherRequestService: Symbol.for("ResearcherRequestService"),
  ResearcherRequestController: Symbol.for("ResearcherRequestController"),
  ArtifactRepositoryDB: Symbol.for("ArtifactRepositoryDB"),
};
