import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { AuthController } from "../controllers/auth.controller";
import { userIsAdmin } from "../middlewares/user.is.admin";
import { userAuthentication } from "../middlewares/user.autentication";
import { validateSchema } from "../middlewares/validate.schema";
import { loginSchema } from "../schemas/auth/login.schema";
import { registerSchema } from "../schemas/auth/register.schema";

const authController: AuthController = container.get(TYPES.AuthController);

const authRoutes = Router();

authRoutes.post(
  "/auth/register-user",
  validateSchema(registerSchema),
  (req, res) => authController.registerUser(req, res)
);

authRoutes.post(
  "/auth/register-admin",
  userAuthentication,
  userIsAdmin,
  validateSchema(registerSchema),
  (req, res) => authController.registerAdmin(req, res)
);

authRoutes.post("/auth/login", validateSchema(loginSchema), (req, res) =>
  authController.login(req, res)
);

export default authRoutes;
