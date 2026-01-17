import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { CommentController } from "../controllers/comment.controller";
import { userAuthentication } from "../middlewares/user.autentication";

const commentController = container.get<CommentController>(TYPES.CommentController);

const commentRoutes = Router();

// Criar comentário em um post (aceita parentId no body para ser resposta)
commentRoutes.post(
  "/posts/:postId/comments",
  userAuthentication,
  (req, res) => commentController.createComment(req, res)
);

// Listar comentários de um post (retorna arvore aninhada)
commentRoutes.get(
  "/posts/:postId/comments",
  (req, res) => commentController.getComments(req, res)
);

// Deletar comentário
commentRoutes.delete(
  "/comments/:commentId",
  userAuthentication,
  (req, res) => commentController.deleteComment(req, res)
);

export default commentRoutes;