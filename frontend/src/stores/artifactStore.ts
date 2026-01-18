import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import artifactService from '@/services/artifactService';
import type { Artifact } from '@/types/artifact';
// Importação essencial para corrigir o problema da imagem
import { getImageUrl } from '@/utils/mediaUtils';

export const useArtifactStore = defineStore('artifact', () => {
  
  // --- Estado Gameplay ---
  const artifact = ref<Artifact | null>(null);
  const showArtifact = ref(false);
  const collectionMessage = ref('');
  const position = ref({ top: 0, left: 0 });

  // --- Estado Admin ---
  const artifacts = ref<Artifact[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // --- Getters / Computed ---
  const RARITY_COLORS: Record<string, string> = {
    fragment: '#6c757d', // Cinza
    partial_fossil: '#0dcaf0', // Ciano
    rare: '#0d6efd', // Azul
    exceptional_specimen: '#ffc107', // Dourado
    unique_specimen: '#dc3545' // Vermelho
  };

  // CORREÇÃO DA IMAGEM: Usa o utilitário padrão do sistema
  const artifactImageUrl = computed(() => {
    return artifact.value ? getImageUrl(artifact.value.image) : '';
  });

  const rarityColor = computed(() => {
    // Garante que a chave da raridade esteja em minúsculo para bater com o mapa
    const rarityKey = artifact.value?.rarity?.toLowerCase() || 'fragment';
    return RARITY_COLORS[rarityKey] || '#ffffff';
  });

  // --- Actions Gameplay ---

  const trySpawnArtifact = async () => {
    if (showArtifact.value) return; // Se já tem um, não spawna outro

    // Chance de 30% de spawnar (pode ajustar esse valor)
    if (Math.random() > 0.3) return;

    try {
      const randomArtifact = await artifactService.getRandomArtifact();
      
      if (randomArtifact) {
        artifact.value = randomArtifact;
        // Define posição aleatória na tela (evitando bordas)
        position.value = {
          top: Math.floor(Math.random() * 60) + 20, // 20% a 80% altura
          left: Math.floor(Math.random() * 80) + 10 // 10% a 90% largura
        };
        showArtifact.value = true;
      }
    } catch (e) {
      console.warn('Tentativa de spawn falhou (sem artefatos ou erro de api).');
    }
  };

  const collectArtifact = async () => {
    if (!artifact.value) return;

    try {
      // 1. Salva no banco
      await artifactService.collectArtifact(artifact.value.id);
      
      // 2. Feedback visual
      collectionMessage.value = `Você encontrou: ${artifact.value.name}!`;
      
      // 3. Remove da tela IMEDIATAMENTE (Corrige o bug de não sumir)
      showArtifact.value = false;
      artifact.value = null;

      // Limpa mensagem após 3 segundos
      setTimeout(() => {
        collectionMessage.value = '';
      }, 3000);

    } catch (e) {
      console.error(e);
      collectionMessage.value = 'Erro ao coletar. Tente novamente.';
    }
  };

  // --- Actions Admin (CRUD) ---
  
  const fetchArtifacts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
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
      artifacts.value.push(newArtifact);
    } catch (e) {
      console.error(e);
      throw e;
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

  // Helper para Admin UI (Badges)
  const getRarityBadgeClass = (rarity: string) => {
    const map: Record<string, string> = {
      'fragment': 'bg-secondary text-light',
      'partial_fossil': 'bg-info text-dark',
      'rare': 'bg-primary text-light',
      'exceptional_specimen': 'bg-warning text-dark',
      'unique_specimen': 'bg-danger text-light shadow-danger'
    };
    // Tenta normalizar para lowercase, caso venha maiúsculo do banco antigo
    return map[rarity?.toLowerCase()] || 'bg-secondary';
  };

  return {
    // State
    artifact,
    showArtifact,
    collectionMessage,
    position,
    artifacts,
    isLoading,
    error,
    
    // Getters
    artifactImageUrl,
    rarityColor,
    
    // Actions
    trySpawnArtifact,
    collectArtifact,
    fetchArtifacts,
    createArtifact,
    deleteArtifact,
    getRarityBadgeClass
  };
});