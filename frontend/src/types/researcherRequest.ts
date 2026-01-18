import type { User } from "./user";

export type ResearcherRequestStatus = "pending" | "approved" | "rejected";

export interface CreateResearcherRequestPayload {
  motivation: string;
}

export interface ResearcherRequestResponse {
  id: string;
  status: ResearcherRequestStatus;
  
  // CORREÇÃO: O backend retorna 'user_id', não 'userId'
  user_id: string; 
  
  motivation: string;
  
  // CORREÇÃO: O backend retorna 'updated_at', não 'updatedAt'
  updated_at: string; 
  
  // CORREÇÃO: O backend retorna 'created_at', não 'createdAt'
  created_at: string; 
  
  // Campo opcional para preenchermos manualmente no front
  user?: User; 
}