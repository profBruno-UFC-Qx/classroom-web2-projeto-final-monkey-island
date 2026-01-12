// src/types/researcherRequest.ts

export type ResearcherRequestStatus = 'pending' | 'approved' | 'rejected';

// O que enviamos para o backend
export interface CreateResearcherRequestPayload {
  motivation: string;
}

// O que o backend retorna (baseado no seu entityToResponseDto)
export interface ResearcherRequestResponse {
  id: string;
  status: ResearcherRequestStatus;
  user_id: string;
  motivation: string;
  updated_at: string;
  created_at: string;
}