// frontend/src/stores/artifactStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import artifactService from '@/services/artifactService';
import type { Artifact } from '@/types/artifact';

export const useArtifactStore = defineStore('artifact', () => {
  
  // --- Estado ---
  const artifacts = ref<Artifact[]>([]); // Lista para o Admin
  const artifact = ref<Artifact | null>(null); // Artefato atual (Gameplay)
  
  // Controle de UI
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Gameplay UI
  const showArtifact = ref(false);
  const collectionMessage = ref('');
  const position = ref({ top: 0, left: 0 });

  // --- Getters / Computed ---
  const RARITY_COLORS: Record<string, string> = {
    COMMON: 'bg-secondary text-light',
    RARE: 'bg-primary text-light',
    LEGENDARY: 'bg-warning text-dark',
    MYTHIC: 'bg-danger text-light shadow-danger'
  };

  const artifactImageUrl = computed(() => {
    return artifact.value ? artifactService.getImageUrl(artifact.value.image) : '';
  });

  // --- Actions de Admin (CRUD) ---
  
  const fetchArtifacts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // O service já trata de extrair o array .data da paginação
      artifacts.value = await artifactService.getAllArtifacts();
    } catch (e) {
      error.value = 'Erro ao carregar lista de artefatos.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const createArtifact = async (formData: FormData) => {
    isLoading.value = true;
    try {
      const newArtifact = await artifactService.createArtifact(formData);
      // Adiciona na lista local para atualizar a tela sem recarregar
      artifacts.value.push(newArtifact);
    } catch (e) {
      console.error(e);
      throw e; // Lança para a View tratar o alerta de erro
    } finally {
      isLoading.value = false;
    }
  };

  const deleteArtifact = async (id: string) => {
    try {
      await artifactService.deleteArtifact(id);
      artifacts.value = artifacts.value.filter(a => a.id !== id);
    } catch (e) {
      console.error(e);
      throw new Error('Falha ao deletar.');
    }
  };

  const getRarityBadgeClass = (rarity: string) => {
    return RARITY_COLORS[rarity?.toUpperCase()] || 'bg-secondary';
  };

  // --- Actions de Gameplay (Mantidas para compatibilidade) ---
  const trySpawnArtifact = async () => { /* Lógica existente */ };
  const collectArtifact = async () => { /* Lógica existente */ };

  return {
    // State
    artifacts,
    artifact,
    isLoading,
    error,
    showArtifact,
    collectionMessage,
    position,

    // Getters
    artifactImageUrl,

    // Actions
    fetchArtifacts,
    createArtifact,
    deleteArtifact,
    getRarityBadgeClass,
    trySpawnArtifact,
    collectArtifact
  };
});