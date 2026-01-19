import { Router } from "express";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { PostController } from "../controllers/post.controller";
import { userAuthentication } from "../middlewares/user.autentication";
import { userIsResearcher } from "../middlewares/user.is.researcher";
import { userIsOwnerOfPost } from "../middlewares/user.is.owner.of.post";
import { validateSchema } from "../middlewares/validate.schema";
import { postSchema } from "../schemas/post/post";
import { postUpdateSchema } from "../schemas/post/post.update";

const postController: PostController = container.get(TYPES.PostController);

const postRoutes = Router();

postRoutes.post(
  "/community/:communityId/posts",
  userAuthentication,
  userIsResearcher,
  validateSchema(postSchema),
  (req, res) => postController.createDraftPost(req, res)
);

postRoutes.patch(
  "/posts/:postId/publish",
  userAuthentication,
  userIsOwnerOfPost,
  (req, res) => postController.publishPost(req, res)
);

postRoutes.put(
  "/posts/:postId",
  userAuthentication,
  userIsOwnerOfPost,
  validateSchema(postUpdateSchema),
  (req, res) => postController.updatePostData(req, res)
);

postRoutes.delete(
  "/posts/:postId",
  userAuthentication,
  userIsOwnerOfPost,
  (req, res) => postController.deletePost(req, res)
);

postRoutes.get("/posts/:postId", (req, res) =>
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
