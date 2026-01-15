import type { Artifact } from '../types/artifact';

const API_URL = 'http://localhost:3000'; 

export default {
  async getRandomArtifact(): Promise<Artifact | null> {
    try {
      const response = await fetch(`${API_URL}/artifacts/random-choice`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar artefato:', error);
      return null;
    }
  },

  async collectArtifact(artifactId: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/artifact-collection/artifact/${artifactId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Erro ao coletar artefato:', error);
      return false;
    }
  },

  getImageUrl(imagePath: string): string {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${API_URL}/images/${cleanPath}`;
  }
};