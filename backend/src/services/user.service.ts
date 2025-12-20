import { inject, injectable } from "inversify";
import { UserRepositoryDB } from "../repositories/user.repositorie";
import { TYPES } from "../types/types";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepositoryDB) private userRepository: UserRepositoryDB
  ) {}
}
