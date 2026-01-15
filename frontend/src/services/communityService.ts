import type {
  Community,
  CommunityRequest,
  CommunityResponse,
} from "../types/community";
import api from "@/api/api";

export default {
  async getMyCommunities(page = 1, limit = 20): Promise<CommunityResponse> {
    const response = await api.get<CommunityResponse>(
      "/community/profile/my-communities",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  async getCommunityById(communityId: string) {
    const response = await api.get(`/community/${communityId}`);
    return response.data;
  },

  async joinCommunity(communityId: string) {
    const response = await api.post(`/community/${communityId}/join`);
    return response.data;
  },

  async getPopularCommunities(page = 1, limit = 20) {
    const response = await api.get<CommunityResponse>("/community/popular", {
      params: { page, limit },
    });
    return response.data;
  },

  async checkMembership(communityId: string) {
    const response = await api.get(`/community/${communityId}/users/isMember`);
    return response.data;
  },

  async createCommunity(community: CommunityRequest) {
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
