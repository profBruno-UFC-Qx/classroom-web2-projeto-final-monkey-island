import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { UserController } from "../controllers/user.controller";
import { userAuthentication } from "../middlewares/user.autentication";
import { userIsAdmin } from "../middlewares/user.is.admin";

const userController: UserController = container.get(TYPES.UserController);

const userRoutes = Router();

userRoutes.get("/users/me", userAuthentication, (req, res) =>
  userController.getMyProfile(req, res)
);

userRoutes.get("/users/:id", userAuthentication, (req, res) =>
  userController.getUserProfileById(req, res)
);

userRoutes.get("/users", userAuthentication, userIsAdmin, (req, res) =>
  userController.getAllUsers(req, res)
);

userRoutes.patch(
  "/users/:id/ban",
  userAuthentication,
  userIsAdmin,
  (req, res) => userController.banUser(req, res)
);

export default userRoutes;
