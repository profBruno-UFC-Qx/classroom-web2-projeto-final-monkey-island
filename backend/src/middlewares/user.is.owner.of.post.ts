import { Request, Response, NextFunction } from "express";
import { UserCommunityRepositoryDB } from "../repositories/user.community.repository";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { PostRepositoryDB } from "../repositories/post.repository";

export async function userIsOwnerOfPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;
  const postId = req.params.postId;

  if (!userId) {
    res.status(401).json({ error: "unauthenticated" });
    return;
  }

  const postRepositoryDB: PostRepositoryDB = container.get(
    TYPES.PostRepositoryDB
  );
  const post = await postRepositoryDB.findPostById(postId);
  if (!post || post.author.id !== userId) {
    res.status(403).json({
      message: "the action can only be carried out by the owner of the post",
    });
    return;
  }

  next();
}
