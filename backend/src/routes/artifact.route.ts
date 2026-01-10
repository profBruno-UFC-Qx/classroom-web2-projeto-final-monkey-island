import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { userIsAdmin } from "../middlewares/user.is.admin";
import { userAuthentication } from "../middlewares/user.autentication";
import { ArtifactController } from "../controllers/artifact.controller";
import multer from "multer";
import multerConfig from "../config/multer/multer.artifact";
import { validateSchema } from "../middlewares/validate.schema";
import { artifactSchema } from "../schemas/artifact/artifact";
import { artifactUpdateSchema } from "../schemas/artifact/artifact.update";

const artifactRoutes = Router();
const artifactController: ArtifactController = container.get(
  TYPES.ArtifactController
);

artifactRoutes.post(
  "/artifacts",
  userAuthentication,
  userIsAdmin,
  multer(multerConfig).single("image"),
  validateSchema(artifactSchema),
  (req, res) => artifactController.createArtifact(req, res)
);

artifactRoutes.put(
  "/artifacts/:id",
  validateSchema(artifactUpdateSchema),
  userAuthentication,
  userIsAdmin,
  (req, res) => artifactController.updateArtifact(req, res)
);

artifactRoutes.delete(
  "/artifacts/:id",
  userAuthentication,
  userIsAdmin,
  (req, res) => artifactController.deleteArtifact(req, res)
);

artifactRoutes.get("/artifacts/random-choice", (req, res) =>
  artifactController.choiceRandomArtifact(req, res)
);
artifactRoutes.get("/artifacts/:id", (req, res) =>
  artifactController.getArtifactById(req, res)
);

artifactRoutes.get("/artifacts", (req, res) =>
  artifactController.getAllArtifacts(req, res)
);

export default artifactRoutes;
