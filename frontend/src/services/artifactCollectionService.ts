import type {
  ArtifactCollectionResponse,
  ArtifactRarity,
} from "../types/artifact";
import api from "../api/api";

export default {
  async getMyCollection(
    page = 1,
    limit = 20
  ): Promise<ArtifactCollectionResponse> {
    const response = await api.get<ArtifactCollectionResponse>(
      "/artifact-collection",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  async searchArtifacts(
    name: string,
    page = 1,
    limit = 20
  ): Promise<ArtifactCollectionResponse> {
    const response = await api.get<ArtifactCollectionResponse>(
      "/artifact-collection/search",
      {
        params: { name, page, limit },
      }
    );
    return response.data;
  },

  async filterByRarity(
    rarity: string,
    page = 1,
    limit = 20
  ): Promise<ArtifactCollectionResponse> {
    const response = await api.get<ArtifactCollectionResponse>(
      "/artifact-collection/by-rarity",
      {
        params: { rarity, page, limit },
      }
    );
    return response.data;
  },
};
