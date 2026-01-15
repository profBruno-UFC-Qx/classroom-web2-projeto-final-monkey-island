import api from '../api/api';
import type { Artifact } from '../types/artifact';

const BASE_URL = 'http://localhost:3000';

export default {
  async getRandomArtifact(): Promise<Artifact | null> {
    try {
      const response = await api.get<Artifact>('/artifacts/random-choice');
      return response.data;
    } catch (error) {
      console.error('Service: Erro ao buscar artefato', error);
      return null;
    }
  },

  async collectArtifact(artifactId: string): Promise<boolean> {
    try {
      await api.post(`/artifact-collection/artifact/${artifactId}`, {});
      return true;
    } catch (error) {
      console.error('Service: Erro ao coletar', error);
      return false;
    }
  },

  getImageUrl(path: string): string {

    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/images/${cleanPath}`;
  }
};