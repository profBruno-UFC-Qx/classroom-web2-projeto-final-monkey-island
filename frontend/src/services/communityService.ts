import type { CommunityResponse } from "../types/community";
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

  async getPopularCommunities(page = 1, limit = 20) {
    const response = await api.get<CommunityResponse>("/community/popular", {
      params: { page, limit },
    });
    return response.data;
  },

  async searchArtifacts(
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
