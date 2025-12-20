import { inject, injectable } from "inversify";
import { IUserRepository } from "../repositories/user.repositorie";
import jsonwebtoken, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RegisterRequestDto } from "../dtos/auth/request/register.request.dto";
import { TYPES } from "../types/types";
import { LoginRequestDto } from "../dtos/auth/request/login.request.dto";
import { User } from "../entities/User";

export interface IAuthService {
  register(request: RegisterRequestDto): Promise<void>;
  login(request: LoginRequestDto): Promise<LoginResponseDto>;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepositoryDB) private userRepository: IUserRepository
  ) {}

  public async register(request: RegisterRequestDto): Promise<void> {
    const userExists = await this.userRepository.existsByEmail(request.email);

    if (userExists) {
      throw new Error("user already exists!");
    }

    const hashedPassword = await bcrypt.hash(request.password, 12);

    const user = this.registerDtoToUser({
      ...request,
      password: hashedPassword,
    });

    await this.userRepository.create(user);
  }

  private registerDtoToUser(request: RegisterRequestDto): User {
    const user = new User();
    user.name = request.name;
    user.institution = request.institution;
    user.email = request.email;
    user.password = request.password;
    user.bio = request.bio ? request.bio : "";
    return user;
  }

  public async login(request: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(request.password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    const token = jsonwebtoken.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    return { jwt: token };
  }
}
