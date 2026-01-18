import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { userAuthentication } from "../middlewares/user.autentication";
import { ArtifactCollectionController } from "../controllers/artifact.collection.controller";

const artifactCollectionRoutes = Router();
const artifactCollectionController: ArtifactCollectionController =
  container.get(TYPES.ArtifactCollectionController);

artifactCollectionRoutes.post(
  "/artifact-collection/artifact/:artifactId",
  userAuthentication,
  (req, res) => artifactCollectionController.addArtifactInCollection(req, res)
);

artifactCollectionRoutes.get(
  "/artifact-collection",
  userAuthentication,
  (req, res) => artifactCollectionController.getAllArtifactsByUser(req, res)
);

artifactCollectionRoutes.get(
  "/artifact-collection/by-rarity",
  userAuthentication,
  (req, res) =>
    artifactCollectionController.getAllArtifactsByUserAndRarity(req, res)
);

artifactCollectionRoutes.get(
  "/artifact-collection/search",
  userAuthentication,
  (req, res) =>
    artifactCollectionController.getAllArtifactsByUserAndNameLike(req, res)
);

export default artifactCollectionRoutes;
