import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { PostMediaController } from "../controllers/post.media.controller";
import { userAuthentication } from "../middlewares/user.autentication";
import upload from "../config/multer/multer.post";
import { userIsOwnerOfPost } from "../middlewares/user.is.owner.of.post";

const postMediaController: PostMediaController = container.get(
  TYPES.PostMediaController
);

const postMediaRoutes = Router();

postMediaRoutes.post(
  "/posts/:postId/medias",
  userAuthentication,
  userIsOwnerOfPost,
  upload.array("files", 5),
  (req, res) => postMediaController.addMediasInPost(req, res)
);

postMediaRoutes.get("/posts/:postId/medias", (req, res) =>
  postMediaController.findMediasInPost(req, res)
);

postMediaRoutes.delete(
  "/posts/:postId/medias/:mediaId",
  userAuthentication,
  userIsOwnerOfPost,
  (req, res) => postMediaController.deleteMediaInPost(req, res)
);

export default postMediaRoutes;
