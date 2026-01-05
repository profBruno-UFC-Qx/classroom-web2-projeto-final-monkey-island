import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entities/User";

export async function userIsAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const role = req.user?.role;
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    res.status(403).json({
      message: "You do not have permission to perform this action",
    });
    return;
  }
  next();
}
