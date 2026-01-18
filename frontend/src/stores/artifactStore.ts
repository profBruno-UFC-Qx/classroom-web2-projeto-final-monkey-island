// frontend/src/stores/artifactStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import artifactService from '@/services/artifactService';
import type { Artifact, ArtifactRarity } from '@/types/artifact';

export const useArtifactStore = defineStore('artifact', () => {
  const authStore = useAuthStore();

  // --- Estado Gameplay ---
  const artifact = ref<Artifact | null>(null);
  const showArtifact = ref(false);
  const collectionMessage = ref('');
  const position = ref({ top: 0, left: 0 });

  // --- Estado Admin (NOVO) ---
  const artifacts = ref<Artifact[]>([]); // Lista completa para o admin
  const isLoading = ref(false);
  const error = ref<string | null>(null);

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

  // --- Actions Admin (CRUD) ---
  
  // 1. Buscar todos (Corrige o problema de não carregar)
  const fetchArtifacts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      artifacts.value = await artifactService.getAllArtifacts();
    } catch (e) {
      error.value = 'Falha ao carregar artefatos.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  // 2. Criar Artefato (Corrige o problema de criação)
  const createArtifact = async (formData: FormData) => {
    isLoading.value = true;
    try {
      const newArtifact = await artifactService.createArtifact(formData);
      artifacts.value.push(newArtifact); // Atualiza a lista localmente
      return true;
    } catch (e) {
      console.error(e);
      throw new Error('Erro ao criar artefato');
    } finally {
      isLoading.value = false;
    }
  };

  // 3. Deletar Artefato
  const deleteArtifact = async (id: string) => {
    try {
      await artifactService.deleteArtifact(id);
      artifacts.value = artifacts.value.filter(a => a.id !== id);
    } catch (e) {
      console.error(e);
      throw new Error('Erro ao deletar');
    }
  };

  // Helper para cores de raridade (UI)
  const getRarityBadgeClass = (rarity: string) => {
    // Normaliza para maiúsculo para garantir match com o enum do backend se necessário
    const key = rarity.toUpperCase();
    return RARITY_COLORS[key] || 'bg-secondary';
  };

  // --- Actions Gameplay (Mantidas) ---
  const trySpawnArtifact = async () => { /* ... código original ... */ };
  const collectArtifact = async () => { /* ... código original ... */ };

  return {
    // State
    artifact,
    showArtifact,
    collectionMessage,
    position,
    artifacts,   // Exportado para a View usar
    isLoading,
    error,
    
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