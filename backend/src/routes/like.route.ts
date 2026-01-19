import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { LikeController } from "../controllers/like.controller";
import { userAuthentication } from "../middlewares/user.autentication";

const likeController = container.get<LikeController>(TYPES.LikeController);

const likeRoutes = Router();

// Rota POST para alternar o like (Toggle)
// Exemplo: POST /posts/123-abc/like
likeRoutes.post(
  "/posts/:postId/like",
  userAuthentication, // Obrigatório estar logado para dar like
  (req, res) => likeController.toggleLike(req, res)
);

export default likeRoutes;