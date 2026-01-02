import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";

import { CommunityUserController } from "../controllers/community.user.controller";
import { userAuthentication } from "../middlewares/user.autentication";
import { userIsOwnerOfCommunity } from "../middlewares/user.is.owner.of.community";

const communityUserController: CommunityUserController = container.get(
  TYPES.CommunityUserController
);

const communityUserRoutes = Router();

communityUserRoutes.put(
  "/community/:communityId/users/ban/:targetUserId",
  userAuthentication,
  userIsOwnerOfCommunity,
  (req, res) => communityUserController.banUser(req, res)
);

communityUserRoutes.put(
  "/community/:communityId/users/suspend/:targetUserId",
  userAuthentication,
  userIsOwnerOfCommunity,
  (req, res) => communityUserController.suspendUser(req, res)
);

communityUserRoutes.put(
  "/community/:communityId/users/unsuspend/:targetUserId",
  userAuthentication,
  userIsOwnerOfCommunity,
  (req, res) => communityUserController.unsuspendUser(req, res)
);

communityUserRoutes.get("/community/:communityId/users", (req, res) =>
  communityUserController.listUsersOfCommunity(req, res)
);

communityUserRoutes.get(
  "/community/my-communities",
  userAuthentication,
  (req, res) => communityUserController.listCommunitiesOfUser(req, res)
);

communityUserRoutes.post(
  "/community/:communityId/join",
  userAuthentication,
  (req, res) => communityUserController.joinInCommunity(req, res)
);

communityUserRoutes.delete(
  "/community/:communityId/join",
  userAuthentication,
  (req, res) => communityUserController.leftOfCommunity(req, res)
);

export default communityUserRoutes;
