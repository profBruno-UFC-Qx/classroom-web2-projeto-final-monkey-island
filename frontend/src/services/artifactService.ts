// frontend/src/services/artifactService.ts
import api, { BASE_URL } from '../api/api';
import type { Artifact } from '../types/artifact';

// Interface para tipar a resposta paginada do backend
interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export default {
  // --- Métodos de Admin (CRUD) ---

  async getAllArtifacts(): Promise<Artifact[]> {
    // O backend retorna { data: [], totalItems: N, ... }
    // Precisamos tipar o get como PaginatedResponse e retornar apenas o .data
    const response = await api.get<PaginatedResponse<Artifact>>('/artifacts');
    return response.data.data; 
  },

  async createArtifact(formData: FormData): Promise<Artifact> {
    const response = await api.post<Artifact>('/artifacts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteArtifact(id: string): Promise<void> {
    await api.delete(`/artifacts/${id}`);
  },

  // --- Métodos de Gameplay/Util ---

  async getRandomArtifact(): Promise<Artifact | null> {
    try {
      const response = await api.get<Artifact>('/artifacts/random-choice');
      return response.data;
    } catch (error) {
      console.warn('Service: Falha ao buscar artefato aleatório.', error);
      return null;
    }
  },

  async collectArtifact(artifactId: string): Promise<void> {
    await api.post(`/artifact-collection/artifact/${artifactId}`, {});
  },

  getImageUrl(path: string): string {
    if (!path) return '';
    // Remove a barra inicial se houver para evitar duplicidade (ex: //artifacts)
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  }
};