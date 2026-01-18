import { ResearcherRequestStatus } from "../../../entities/researcher.request";

export interface RequestToBeResearcherResponseDto {
  id: string;
  user_id: string;
  motivation: string;
  status: ResearcherRequestStatus;
  updated_at: Date;
  created_at: Date;
}
