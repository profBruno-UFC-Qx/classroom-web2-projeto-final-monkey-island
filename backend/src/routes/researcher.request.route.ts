import { ResearcherRequestController } from "../controllers/researcher.request.controller";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { userAuthentication } from "../middlewares/user.autentication";
import { userIsAdmin } from "../middlewares/user.is.admin";
import { Router } from "express";
import { validateSchema } from "../middlewares/validate.schema";
import { researcherRequestSchema } from "../schemas/researcher_request/researcher.request.schema";

const researcherRequestRoutes = Router();

const researcherRequestController: ResearcherRequestController = container.get(
  TYPES.ResearcherRequestController
);

researcherRequestRoutes.post(
  "/researcher-request",
  userAuthentication,
  validateSchema(researcherRequestSchema),
  (req, res) => researcherRequestController.create(req, res)
);

researcherRequestRoutes.get(
  "/researcher-request",
  userAuthentication,
  userIsAdmin,
  (req, res) => researcherRequestController.findPending(req, res)
);

researcherRequestRoutes.get(
  "/researcher-request/me",
  userAuthentication,
  (req, res) => researcherRequestController.findByUser(req, res)
);

researcherRequestRoutes.put(
  "/researcher-request/:requestId/approve",
  userAuthentication,
  userIsAdmin,
  (req, res) => researcherRequestController.approve(req, res)
);

researcherRequestRoutes.put(
  "/researcher-request/:requestId/reject",
  userAuthentication,
  userIsAdmin,
  (req, res) => researcherRequestController.reject(req, res)
);

export default researcherRequestRoutes;
