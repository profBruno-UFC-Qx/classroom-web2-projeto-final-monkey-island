import api from "@/api/api";
import type {
  CreateResearcherRequestPayload,
  ResearcherRequestResponse,
} from "../types/researcherRequest";

export default {
  /**
   * Envia uma solicitação para se tornar pesquisador.
   * Rota: POST /researcher-request
   */
  async createRequest(motivation: string): Promise<ResearcherRequestResponse> {
    const payload: CreateResearcherRequestPayload = { motivation };
    const response = await api.post<ResearcherRequestResponse>(
      "/researcher-request",
      payload
    );
    return response.data;
  },

  /**
   * Verifica o status das solicitações do próprio usuário
   * Rota: GET /researcher-request/me
   */
  async getMyRequests(): Promise<ResearcherRequestResponse[]> {
    const response = await api.get<ResearcherRequestResponse[]>(
      "/researcher-request/me"
    );
    return response.data;
  },

  // --- Métodos de Admin (Mantidos caso precise futuramente) ---
  async getPendingRequests() {
    return (await api.get("/researcher-request")).data;
  },

  async approveRequest(requestId: string) {
    return (await api.put(`/researcher-request/${requestId}/approve`)).data;
  },

  async rejectRequest(requestId: string) {
    return (await api.put(`/researcher-request/${requestId}/reject`)).data;
  },
};
