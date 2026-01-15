export type ResearcherRequestStatus = "pending" | "approved" | "rejected";

export interface CreateResearcherRequestPayload {
  motivation: string;
}

export interface ResearcherRequestResponse {
  id: string;
  status: ResearcherRequestStatus;
  userId: string;       
  motivation: string;
  updatedAt: string;    
  createdAt: string;    
}