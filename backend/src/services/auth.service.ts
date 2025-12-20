import { inject, injectable } from "inversify";
import { IUserRepository } from "../repositories/user.repositorie";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TYPES } from "../types/types";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepositoryDB) private userRepository: IUserRepository
  ) {}
}
