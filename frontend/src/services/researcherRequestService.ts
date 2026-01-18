import api from "@/api/api";
import type {
  CreateResearcherRequestPayload,
  ResearcherRequestResponse,
} from "@/types/researcherRequest";

interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export default {
  async createRequest(motivation: string): Promise<ResearcherRequestResponse> {
    const payload: CreateResearcherRequestPayload = { motivation };
    const response = await api.post<ResearcherRequestResponse>(
      "/researcher-request",
      payload
    );
    return response.data;
  },

  async getMyRequests(): Promise<ResearcherRequestResponse[]> {
    const response = await api.get<PaginatedResponse<ResearcherRequestResponse>>(
      "/researcher-request/me"
    );
    return response.data.data;
  },

  async getPendingRequests(): Promise<ResearcherRequestResponse[]> {
    const response = await api.get<PaginatedResponse<ResearcherRequestResponse>>(
      "/researcher-request",
      {
        params: { status: "pending" },
      }
    );
    return response.data.data;
  },

  async approveRequest(requestId: string): Promise<void> {
    await api.patch(`/researcher-request/${requestId}/approve`);
  },

  async rejectRequest(requestId: string): Promise<void> {
    await api.patch(`/researcher-request/${requestId}/reject`);
  },
};