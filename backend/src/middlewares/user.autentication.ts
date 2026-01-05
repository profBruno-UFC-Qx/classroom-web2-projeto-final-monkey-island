import { Request, Response, NextFunction } from "express";
import { UserRepositoryDB } from "../repositories/user.repositorie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { container } from "../di/container.di";
import { TYPES } from "../types/types";
import { UserStatus } from "../entities/User";

export async function userAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const repo: UserRepositoryDB = container.get(TYPES.UserRepositoryDB);

    if (!payload.sub) {
      return res.status(403).json({ message: "invalid token" });
    }
    const user = await repo.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status !== UserStatus.ACTIVE) {
      return res.status(403).json({ message: "Account inactive or banned" });
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
