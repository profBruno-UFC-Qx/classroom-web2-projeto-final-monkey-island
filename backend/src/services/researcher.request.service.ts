import { inject, injectable } from "inversify";
import { RequestToBeResearcherDto } from "../dtos/researcher_request/request/RequestToBeResearcherDto";
import { RequestToBeResearcherResponseDto } from "../dtos/researcher_request/response/RequestToBeResearcherResponseDto";
import { TYPES } from "../types/types";
import { User } from "../entities/User";
import { IUserService } from "./user.service";
import { IResearcherRequestRepositorie } from "../repositories/researcher.request.repositorie";
import { ResearcherRequest } from "../entities/researcher.request";

export interface IResearcherRequestService {
  create(
    userId: string,
    dto: RequestToBeResearcherDto
  ): Promise<RequestToBeResearcherResponseDto>;

  findByUser(userId: string): Promise<RequestToBeResearcherResponseDto[]>;

  findPending(): Promise<RequestToBeResearcherResponseDto[]>;

  approve(requestId: string): Promise<void>;

  reject(requestId: string): Promise<void>;
}

@injectable()
export class ResearcherRequestService implements IResearcherRequestService {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,

    @inject(TYPES.ResearcherRequestRepositoryDB)
    private researcherRequestRepository: IResearcherRequestRepositorie
  ) {}

  async create(
    userId: string,
    dto: RequestToBeResearcherDto
  ): Promise<RequestToBeResearcherResponseDto> {
    const user = await this.userService.findUserById(userId);
    const existsPendingRequest =
      await this.researcherRequestRepository.existsPendingRequest(user);

    if (existsPendingRequest) {
      throw new Error("pending request already exists!");
    }

    const reseacherRequest = this.dtoToEntity(user, dto);
    const dataResponse =
      await this.researcherRequestRepository.save(reseacherRequest);
    const response = this.entityToResponseDto(dataResponse);

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
