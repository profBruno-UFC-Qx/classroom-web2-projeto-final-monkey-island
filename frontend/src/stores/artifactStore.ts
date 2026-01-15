import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './authStore';
import artifactService from '../services/artifactService';
import { type Artifact, ArtifactRarity } from '../types/artifact';

export const useArtifactStore = defineStore('artifact', () => {
  const authStore = useAuthStore();

  const artifact = ref<Artifact | null>(null);
  const showArtifact = ref(false);
  const collectionMessage = ref('');
  const position = ref({ top: 0, left: 0 });

  // Getter da Imagem
  const artifactImageUrl = computed(() => {
    return artifact.value ? artifactService.getImageUrl(artifact.value.image) : '';
  });

  // Getter de Cor por Raridade (Para o brilho/borda)
  const rarityColor = computed(() => {
    if (!artifact.value) return 'white';
    switch (artifact.value.rarity) {
      case ArtifactRarity.FRAGMENT: return '#bdc3c7'; // Cinza
      case ArtifactRarity.PARTIAL_FOSSIL: return '#2ecc71'; // Verde
      case ArtifactRarity.RARE_FOSSIL: return '#3498db'; // Azul
      case ArtifactRarity.EXCEPTIONAL_SPECIMEN: return '#9b59b6'; // Roxo
      case ArtifactRarity.UNIQUE_SPECIMEN: return '#f1c40f'; // Dourado
      default: return 'white';
    }
  });

  const trySpawnArtifact = async () => {
    if (!authStore.isAuthenticated) return;
    
    // Chance de 25% (Pode ajustar para testes)
    if (Math.random() > 0.25) return; 

    const data = await artifactService.getRandomArtifact();
    
    if (data) {
      artifact.value = data;
      // Define posição aleatória longe das bordas (5% a 90%)
      position.value = { 
        top: Math.random() * (90 - 5) + 5, 
        left: Math.random() * (90 - 5) + 5 
      };
      showArtifact.value = true;
      console.log('Sistema: Anomalia detectada no setor.');
    }
  };

  const collectArtifact = async () => {
    if (!artifact.value || !authStore.isAuthenticated) return;
    
    // CORREÇÃO: Removemos a manipulação manual de token aqui.
    // O service agora usa a instância do api.ts que injeta o token automaticamente.
    const success = await artifactService.collectArtifact(artifact.value.id);

    if (success) {
      collectionMessage.value = `Coletado: ${artifact.value.name}`;
      showArtifact.value = false;
      
      // Limpa mensagem após 3 segundos
      setTimeout(() => { collectionMessage.value = ''; }, 3000);
    }
  };

  return {
    artifact,
    showArtifact,
    collectionMessage,
    position,
    artifactImageUrl,
    rarityColor,
    trySpawnArtifact,
    collectArtifact
  };
});