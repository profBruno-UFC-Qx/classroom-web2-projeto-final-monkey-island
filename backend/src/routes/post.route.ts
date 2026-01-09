import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { PostController } from "../controllers/post.controller";
import { userAuthentication } from "../middlewares/user.autentication";

const postController: PostController = container.get(TYPES.PostController);

const postRoutes = Router();

postRoutes.post(
  "/community/:communityId/posts",
  userAuthentication,
  (req, res) => postController.createDraftPost(req, res)
);

postRoutes.patch("/posts/:id/publish", userAuthentication, (req, res) =>
  postController.publishPost(req, res)
);

postRoutes.put("/posts/:id", userAuthentication, (req, res) =>
  postController.updatePostData(req, res)
);

postRoutes.delete("/posts/:id", userAuthentication, (req, res) =>
  postController.deletePost(req, res)
);

postRoutes.get("/posts/:id", (req, res) =>
  postController.findPostById(req, res)
);

postRoutes.get("/community/:communityId/posts/author/:authorId", (req, res) =>
  postController.findPostsByAuthorInCommunity(req, res)
);

postRoutes.get("/community/:communityId/posts", (req, res) =>
  postController.findRecentPostsInCommunity(req, res)
);

postRoutes.get("/feed/public", (req, res) =>
  postController.findPublicFeed(req, res)
);

postRoutes.get("/feed", userAuthentication, (req, res) =>
  postController.findFeedForUser(req, res)
);

export default postRoutes;
