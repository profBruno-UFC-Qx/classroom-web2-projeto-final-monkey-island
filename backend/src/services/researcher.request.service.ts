import { inject, injectable } from "inversify";
import { RequestToBeResearcherDto } from "../dtos/researcher_request/request/RequestToBeResearcherDto";
import { RequestToBeResearcherResponseDto } from "../dtos/researcher_request/response/RequestToBeResearcherResponseDto";
import { TYPES } from "../types/types";
import { User, UserRole, UserStatus } from "../entities/User";
import { IUserService } from "./user.service";
import { IResearcherRequestRepositorie } from "../repositories/researcher.request.repositorie";
import {
  ResearcherRequest,
  ResearcherRequestStatus,
} from "../entities/researcher.request";

export interface IResearcherRequestService {
  create(
    userId: string,
    dto: RequestToBeResearcherDto
  ): Promise<RequestToBeResearcherResponseDto>;

  findByUser(userId: string): Promise<RequestToBeResearcherResponseDto[]>;

  findPending(): Promise<RequestToBeResearcherResponseDto[]>;

  approve(requestId: string): Promise<RequestToBeResearcherResponseDto>;

  reject(requestId: string): Promise<RequestToBeResearcherResponseDto>;
}

@injectable()
export class ResearcherRequestService implements IResearcherRequestService {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,

    @inject(TYPES.ResearcherRequestRepositoryDB)
    private researcherRequestRepository: IResearcherRequestRepositorie
  ) {}

  public async create(
    userId: string,
    dto: RequestToBeResearcherDto
  ): Promise<RequestToBeResearcherResponseDto> {
    const user = await this.userService.findUserById(userId);

    const userIsResearcher = await this.userService.userIsResearcher(userId);

    if (userIsResearcher) {
      throw new Error("you are already a researcher");
    }

    const existsPendingRequest =
      await this.researcherRequestRepository.existsPendingRequest(userId);

    if (existsPendingRequest) {
      throw new Error("pending request already exists!");
    }

    const reseacherRequest = this.dtoToEntity(user, dto);
    const dataResponse =
      await this.researcherRequestRepository.save(reseacherRequest);
    const response = this.entityToResponseDto(dataResponse);

    return response;
  }

  public async findByUser(
    userId: string
  ): Promise<RequestToBeResearcherResponseDto[]> {
    const user = await this.userService.findUserById(userId);
    const dataResponse =
      await this.researcherRequestRepository.findRequestsByUserId(userId);
    const reponse = dataResponse.map((data) => this.entityToResponseDto(data));
    return reponse;
  }

  public async findPending(): Promise<RequestToBeResearcherResponseDto[]> {
    const dataResponse =
      await this.researcherRequestRepository.findPendingRequests();
    const reponse = dataResponse.map((data) => this.entityToResponseDto(data));
    return reponse;
  }

  public async approve(
    requestId: string
  ): Promise<RequestToBeResearcherResponseDto> {
    const request =
      await this.researcherRequestRepository.findRequestById(requestId);

    if (!request) {
      throw new Error("this researcher request does not exists");
    }

    if (request.status !== ResearcherRequestStatus.PENDING) {
      throw new Error("only pending requests can be approved");
    }

    if (request.user.status !== UserStatus.ACTIVE) {
      throw new Error("the requester user is banned or inactive");
    }
    request.status = ResearcherRequestStatus.APPROVED;
    await this.userService.changeUserRole(request.user.id, UserRole.RESEARCHER);
    const responseData = await this.researcherRequestRepository.save(request);
    const response = this.entityToResponseDto(responseData);
    return response;
  }

  async reject(requestId: string): Promise<RequestToBeResearcherResponseDto> {
    const request =
      await this.researcherRequestRepository.findRequestById(requestId);

    if (!request) {
      throw new Error("this researcher request does not exists");
    }

    if (request.status !== ResearcherRequestStatus.PENDING) {
      throw new Error("only pending requests can be rejected");
    }

    if (request.user.status !== UserStatus.ACTIVE) {
      throw new Error("the requester user is banned or inactive");
    }
    request.status = ResearcherRequestStatus.REJECTED;
    const responseData = await this.researcherRequestRepository.save(request);
    const response = this.entityToResponseDto(responseData);
    return response;
  }

  private entityToResponseDto(
    data: ResearcherRequest
  ): RequestToBeResearcherResponseDto {
    return {
      id: data.id,
      status: data.status,
      user_id: data.user.id,
      motivation: data.motivation,
      updated_at: data.updatedAt,
      created_at: data.createdAt,
    };
  }

  private dtoToEntity(
    user: User,
    dto: RequestToBeResearcherDto
  ): ResearcherRequest {
    const researcherRequest = new ResearcherRequest();
    researcherRequest.motivation = dto.motivation;
    researcherRequest.user = user;
    return researcherRequest;
  }
}
