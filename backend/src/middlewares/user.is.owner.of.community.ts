import { Request, Response, NextFunction } from "express";
import { UserCommunityRepositoryDB } from "../repositories/user.community.repository";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";

export async function userIsOwnerOfCommunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;
  const communityId = req.params.communityId;

  if (!userId) {
    res.status(401).json({ error: "unauthenticated" });
    return;
  }

  const communityUserRepositoryDB: UserCommunityRepositoryDB = container.get(
    TYPES.CommunityUserRepositoryDB
  );
  const communityUser = await communityUserRepositoryDB.findByUserAndCommunity(
    userId,
    communityId
  );

  if (!communityUser || communityUser.community.createdBy.id !== userId) {
    res.status(403).json({
      message: "only the owner of the community can perform this action",
    });
    return;
  }

  next();
}
