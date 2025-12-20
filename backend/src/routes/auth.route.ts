import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { AuthController } from "../controllers/auth.controller";

const authController: AuthController = container.get(TYPES.AuthController);

const authRoutes = Router();

authRoutes.post("/auth/register-user", (req, res) =>
  authController.registerUser(req, res)
);

authRoutes.post("/auth/register-admin", (req, res) =>
  authController.registerUser(req, res)
);

authRoutes.post("/auth/login", (req, res) => authController.login(req, res));

export default authRoutes;
