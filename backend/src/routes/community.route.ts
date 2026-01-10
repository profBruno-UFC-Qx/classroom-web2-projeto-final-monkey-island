import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { CommunityController } from "../controllers/community.controller";
import { userIsResearcher } from "../middlewares/user.is.researcher";
import { userAuthentication } from "../middlewares/user.autentication";
import { validateSchema } from "../middlewares/validate.schema";
import { communitySchema } from "../schemas/community/community.schema";
import { communityUpdateSchema } from "../schemas/community/community.update.schema";

const communityController: CommunityController = container.get(
  TYPES.CommunityController
);

const communityRoutes = Router();

communityRoutes.post(
  "/community",
  userAuthentication,
  userIsResearcher,
  validateSchema(communitySchema),
  (req, res) => communityController.createCommunity(req, res)
);

communityRoutes.delete(
  "/community/:id",
  userAuthentication,
  validateSchema(communityUpdateSchema),
  (req, res) => communityController.deleteCommunity(req, res)
);

communityRoutes.put("/community/:id", userAuthentication, (req, res) =>
  communityController.updateCommunityData(req, res)
);

communityRoutes.get(
  "/community/created-for-me",
  userAuthentication,
  (req, res) => communityController.findCommunitiesCreatedByUser(req, res)
);
communityRoutes.get("/community/search", (req, res) =>
  communityController.findCommunityByNameLike(req, res)
);

communityRoutes.get("/community/popular", (req, res) =>
  communityController.findPopularCommunities(req, res)
);

communityRoutes.get("/community/:id", (req, res) =>
  communityController.findCommunityById(req, res)
);

export default communityRoutes;
