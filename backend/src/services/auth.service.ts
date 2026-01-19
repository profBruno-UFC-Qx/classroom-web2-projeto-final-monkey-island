import { inject, injectable } from "inversify";
import { IUserRepository } from "../repositories/user.repositorie";
import jsonwebtoken, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RegisterRequestDto } from "../dtos/auth/request/register.request.dto";
import { TYPES } from "../types/types";
import { LoginRequestDto } from "../dtos/auth/request/login.request.dto";
import { User, UserRole, UserStatus } from "../entities/User";

export interface IAuthService {
  registerUser(request: RegisterRequestDto): Promise<void>;
  registerAdmin(request: RegisterRequestDto): Promise<void>;
  login(request: LoginRequestDto): Promise<LoginResponseDto>;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepositoryDB) private userRepository: IUserRepository
  ) {}

  public async registerUser(request: RegisterRequestDto): Promise<void> {
    await this.register(request, UserRole.USER);
  }

  public async registerAdmin(request: RegisterRequestDto): Promise<void> {
    await this.register(request, UserRole.ADMIN);
  }

  private async register(
    request: RegisterRequestDto,
    role: UserRole
  ): Promise<void> {
    const userExists = await this.userRepository.existsByEmail(request.email);

    if (userExists) {
      throw new Error("user already exists!");
    }

    const hashedPassword = await bcrypt.hash(request.password, 12);

    const user = this.registerDtoToUser(
      {
        ...request,
        password: hashedPassword,
      },
      role
    );

    await this.userRepository.save(user);
  }

  private registerDtoToUser(request: RegisterRequestDto, role: UserRole): User {
    const user = new User();
    user.name = request.name;
    user.institution = request.institution;
    user.email = request.email;
    user.password = request.password;
    user.bio = request.bio ? request.bio : "";
    user.role = role;
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

    if (user.status === UserStatus.INACTIVE) {
      throw new Error("Account is not active");
    }

    if (user.status === UserStatus.BANNED) {
      throw new Error("user is banned");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const token = jsonwebtoken.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    return { jwt: token };
  }
}
