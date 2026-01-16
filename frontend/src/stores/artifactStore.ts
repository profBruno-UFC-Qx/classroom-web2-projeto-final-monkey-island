import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import artifactService from '@/services/artifactService';
import type { Artifact, ArtifactRarity } from '@/types/artifact';

export const useArtifactStore = defineStore('artifact', () => {
  const authStore = useAuthStore();

  const artifact = ref<Artifact | null>(null);
  const showArtifact = ref(false);
  const collectionMessage = ref('');
  const position = ref({ top: 0, left: 0 });

  const RARITY_COLORS: Record<ArtifactRarity, string> = {
    fragment: '#bdc3c7',
    partial_fossil: '#2ecc71',
    rare: '#3498db',
    exceptional_specimen: '#9b59b6',
    unique_specimen: '#f1c40f',
  };

  const artifactImageUrl = computed(() => {
    return artifact.value ? artifactService.getImageUrl(artifact.value.image) : '';
  });

  const rarityColor = computed(() => {
    if (!artifact.value) return 'white';
    return RARITY_COLORS[artifact.value.rarity] || 'white';
  });

  const trySpawnArtifact = async () => {
    if (!authStore.isAuthenticated) return;
    
    if (Math.random() > 0.25) return; 

    try {
      const data = await artifactService.getRandomArtifact();
      
      if (data) {
        artifact.value = data;
        position.value = { 
          top: Math.random() * (90 - 5) + 5, 
          left: Math.random() * (90 - 5) + 5 
        };
        showArtifact.value = true;
        console.log('Sistema: Anomalia detectada no setor.');
      }
    } catch (error) {
      console.error('Erro ao tentar gerar artefato:', error);
    }
  };

  const collectArtifact = async () => {
    if (!artifact.value || !authStore.isAuthenticated) return;
    
    try {
      const success = await artifactService.collectArtifact(artifact.value.id);

      if (success) {
        collectionMessage.value = `Coletado: ${artifact.value.name}`;
        showArtifact.value = false;

        setTimeout(() => { collectionMessage.value = ''; }, 3000);
      }
    } catch (error) {
      console.error('Erro ao coletar artefato:', error);
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