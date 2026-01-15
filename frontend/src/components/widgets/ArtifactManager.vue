<template>
  <div>
    <div 
      v-if="showArtifact && artifact" 
      class="artifact-drop hidden-mode"
      :style="{ top: position.top + '%', left: position.left + '%' }"
      @click="collectArtifact"
      title="???"
    >
      <img 
        :src="getImageUrl(artifact.image)" 
        :alt="artifact.name" 
        class="artifact-img" 
      />
    </div>

    <transition name="fade">
      <div v-if="collectionMessage" class="collection-feedback font-monospace fw-bold">
        <i class="bi bi-check-circle-fill me-2"></i>{{ collectionMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const API_URL = 'http://localhost:3000';
const authStore = useAuthStore();

interface Artifact { id: string; name: string; image: string; rarity: string; }

const artifact = ref<Artifact | null>(null);
const showArtifact = ref(false);
const collectionMessage = ref('');
const position = ref({ top: 0, left: 0 });

const getImageUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/images/${cleanPath}`;
};

const trySpawnArtifact = async () => {
  if (!authStore.isAuthenticated) return;
  
  // Chance de 25% (Mantida)
  if (Math.random() > 0.25) return;

  try {
    const response = await fetch(`${API_URL}/artifacts/random-choice`);
    if (!response.ok) return;
    const data = await response.json();
    artifact.value = data;
    
    // POSIÇÃO FURTIVA:
    // Permite que apareça quase nas bordas totais da tela (2% a 92%)
    // Antes era centralizado (15-70), agora é espalhado.
    position.value = { 
      top: Math.random() * (92 - 2) + 2, 
      left: Math.random() * (92 - 2) + 2 
    };
    
    showArtifact.value = true;
    console.log('Sistema: Anomalia detectada no setor.'); // Log discreto
  } catch (error) { console.error(error); }
};

const collectArtifact = async () => {
  if (!artifact.value || !authStore.isAuthenticated) return;
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/artifact-collection/artifact/${artifact.value.id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      collectionMessage.value = `Coletado: ${artifact.value.name}!`;
      showArtifact.value = false;
      setTimeout(() => { collectionMessage.value = ''; }, 3000);
    }
  } catch (error) { console.error(error); }
};

onMounted(() => { if (authStore.isAuthenticated) trySpawnArtifact(); });
watch(() => authStore.isAuthenticated, (isAuth) => { if (isAuth) trySpawnArtifact(); });
</script>

<style scoped>
/* ESTILO FURTIVO */
.artifact-drop { 
  position: fixed; 
  cursor: pointer; 
  z-index: 999; /* Fica acima do fundo, mas abaixo de modais */
  transition: all 0.3s ease;
  
  /* CAMUFLAGEM INICIAL */
  opacity: 0.3; /* Quase transparente */
  filter: grayscale(100%) contrast(150%); /* Preto e branco para misturar com texto */
  transform: scale(0.9) rotate(0deg);
}

/* EFEITO AO PASSAR O MOUSE (REVELAÇÃO) */
.artifact-drop:hover { 
  opacity: 1; /* Totalmente visível */
  filter: grayscale(0%) contrast(100%) drop-shadow(0 0 8px gold); /* Cor original + brilho */
  transform: scale(1.2) rotate(10deg); /* Cresce para confirmar */
  z-index: 10000; /* Traz para frente de tudo ao achar */
}

.artifact-img { 
  width: 40px; /* Bem menor (era 80px) */
  height: 40px; 
  object-fit: contain; 
}

/* Feedback de sucesso (Mantido) */
.collection-feedback { 
  position: fixed; 
  bottom: 30px; 
  right: 30px; 
  background-color: #1a2f2b; 
  color: #ffc107; 
  padding: 1rem 1.5rem; 
  border-radius: 4px; 
  border: 2px solid #ffc107; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.3); 
  z-index: 10000; 
  text-transform: uppercase; 
  display: flex; 
  align-items: center; 
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>