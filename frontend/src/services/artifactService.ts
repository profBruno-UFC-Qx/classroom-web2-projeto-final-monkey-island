import api, { BASE_URL } from '../api/api';
import type { Artifact } from '../types/artifact';

export default {
  async getRandomArtifact(): Promise<Artifact | null> {
    // Serviços devem repassar o erro para a store tratar, a menos que haja um fallback específico
    // Neste caso, se falhar, retornamos null, mas idealmente lançaríamos o erro.
    try {
      const response = await api.get<Artifact>('/artifacts/random-choice');
      return response.data;
    } catch (error) {
      // Opcional: Logar erro silencioso se a estratégia for "não spawnar nada se der erro"
      console.warn('Service: Falha ao buscar artefato, nenhum será gerado.', error);
      return null;
    }
  },

  async collectArtifact(artifactId: string): Promise<void> {
    // Alterado para void e removido try/catch. Se falhar, a Store pega o erro.
    await api.post(`/artifact-collection/artifact/${artifactId}`, {});
  },

  getImageUrl(path: string): string {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Usa a constante exportada do api.ts em vez de string mágica
    return `${BASE_URL}/images/${cleanPath}`;
  },
  // Adicione estes métodos ao objeto exportado em src/services/artifactService.ts

  async getAllArtifacts(): Promise<Artifact[]> {
    const response = await api.get<Artifact[]>('/artifacts');
    return response.data;
  },

  async createArtifact(formData: FormData): Promise<Artifact> {
    const response = await api.post<Artifact>('/artifacts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateArtifact(id: string, data: Partial<Artifact>): Promise<Artifact> {
    const response = await api.put<Artifact>(`/artifacts/${id}`, data);
    return response.data;
  },

  async deleteArtifact(id: string): Promise<void> {
    await api.delete(`/artifacts/${id}`);
  },
};