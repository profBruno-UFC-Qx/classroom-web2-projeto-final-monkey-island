import { RequestToBeResearcherDto } from "../request/RequestToBeResearcherDto";

export interface PendingRequestsResponseDto {
  data: RequestToBeResearcherDto[];
  totalItems: number;
  totalPages: number;
}
