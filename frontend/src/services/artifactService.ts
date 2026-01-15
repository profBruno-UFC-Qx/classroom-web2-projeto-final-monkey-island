import { api } from '../types/api';
import type { Artifact } from '../types/artifact';

export default {
  async getRandomArtifact(): Promise<Artifact | null> {
    try {
      // Simples e direto
      return await api.get<Artifact>('/artifacts/random-choice');
    } catch (error) {
      console.error('Service: Erro ao buscar artefato', error);
      return null;
    }
  },

  async collectArtifact(artifactId: string): Promise<boolean> {
    try {
      // Não precisa passar token! O api.ts já pega do localStorage automaticamente.
      await api.post(`/artifact-collection/artifact/${artifactId}`, {});
      return true;
    } catch (error) {
      console.error('Service: Erro ao coletar', error);
      return false;
    }
  },

  getImageUrl(path: string): string {
    return api.getImageUrl(path);
  }
};