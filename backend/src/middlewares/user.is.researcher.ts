import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entities/User";

export async function userIsResearcher(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const role = req.user?.role;
  if (!req.user || req.user.role !== UserRole.RESEARCHER) {
    res.status(403).json({
      message: "You need to be a researcher to be able to perform this action",
    });
    return;
  }
  next();
}
