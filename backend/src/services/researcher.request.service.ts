import { inject, injectable } from "inversify";
import { RequestToBeResearcherDto } from "../dtos/researcher_request/request/RequestToBeResearcherDto";
import { RequestToBeResearcherResponseDto } from "../dtos/researcher_request/response/RequestToBeResearcherResponseDto";
import { TYPES } from "../types/types";
import { UserService } from "./user.service";
import { IResearcherRequestRepositorie } from "../repositories/researcher.request.repositorie";

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
    @inject(TYPES.UserService) private userService: UserService,

    @inject(TYPES.ResearcherRequestRepositoryDB)
    private researcherRequestRepository: IResearcherRequestRepositorie
  ) {}
}
