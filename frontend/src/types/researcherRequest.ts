// src/types/researcherRequest.ts

export type ResearcherRequestStatus = "pending" | "approved" | "rejected";

export interface CreateResearcherRequestPayload {
  motivation: string;
}

export interface ResearcherRequestResponse {
  id: string;
  status: ResearcherRequestStatus;
  user_id: string;
  motivation: string;
  updated_at: string;
  created_at: string;
}
