import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { AuthController } from "../controllers/auth.controller";
import { userIsAdmin } from "../middlewares/user.is.admin";
import { userAuthentication } from "../middlewares/user.autentication";

const authController: AuthController = container.get(TYPES.AuthController);

const authRoutes = Router();

authRoutes.post("/auth/register-user", (req, res) =>
  authController.registerUser(req, res)
);

authRoutes.post(
  "/auth/register-admin",
  userAuthentication,
  userIsAdmin,
  (req, res) => authController.registerAdmin(req, res)
);

authRoutes.post("/auth/login", (req, res) => authController.login(req, res));

export default authRoutes;
