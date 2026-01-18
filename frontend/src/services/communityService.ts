import type {
  Community,
  CommunityRequest,
  CommunityResponse,
} from "@/types/community";
import api from "@/api/api";

export default {
  async getMyCommunities(page = 1, limit = 20): Promise<CommunityResponse> {
    const response = await api.get<CommunityResponse>(
      "/community/profile/my-communities",
      { params: { page, limit } }
    );
    return response.data;
  },

  async getCommunityById(communityId: string): Promise<Community> {
    const response = await api.get<Community>(`/community/${communityId}`);
    return response.data;
  },

  // Retorna status ou void dependendo do backend. Assumindo que retorna msg de sucesso.
  async joinCommunity(communityId: string): Promise<any> {
    const response = await api.post(`/community/${communityId}/join`);
    return response.data;
  },

  async getPopularCommunities(page = 1, limit = 20): Promise<CommunityResponse> {
    const response = await api.get<CommunityResponse>("/community/popular", {
      params: { page, limit },
    });
    return response.data;
  },

  async checkMembership(communityId: string): Promise<boolean> {
    // Assumindo que o backend retorna { isMember: boolean } ou similar
    const response = await api.get(`/community/${communityId}/users/isMember`);
    return response.data; 
  },

  async createCommunity(community: CommunityRequest): Promise<CommunityResponse> {
    const response = await api.post<CommunityResponse>("/community", community);
    return response.data;
  },

  async searchCommunitiesByName(
    name: string,
    page = 1,
    limit = 20
  ): Promise<CommunityResponse> {
    const response = await api.get<CommunityResponse>("/community/search", {
      params: { name, page, limit },
    });
    return response.data;
  },
};