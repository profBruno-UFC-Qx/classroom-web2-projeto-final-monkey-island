<template>
  <div>
    <div 
      v-if="store.showArtifact && store.artifact" 
      class="artifact-drop hidden-mode"
      :style="{ 
        top: store.position.top + '%', 
        left: store.position.left + '%',
        '--glow-color': store.rarityColor // Variável CSS dinâmica
      }"
      @click="store.collectArtifact"
      :title="store.artifact.description" 
    >
      <img 
        :src="store.artifactImageUrl" 
        :alt="store.artifact.name" 
        class="artifact-img" 
      />
    </div>

    <transition name="fade">
      <div v-if="store.collectionMessage" class="collection-feedback font-monospace fw-bold">
        <i class="bi bi-check-circle-fill me-2"></i>{{ store.collectionMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useArtifactStore } from '../../stores/artifactStore';
import { useAuthStore } from '../../stores/authStore';

const store = useArtifactStore();
const authStore = useAuthStore();

onMounted(() => {
  store.trySpawnArtifact();
});

watch(
  () => authStore.isAuthenticated, 
  (isAuth) => {
    if (isAuth) store.trySpawnArtifact();
  }
);
</script>

<style scoped>
.artifact-drop { 
  position: fixed; 
  cursor: pointer; 
  z-index: 999;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Estado Furtivo */
  opacity: 0.2;
  filter: grayscale(100%) contrast(120%) brightness(0.8);
  transform: scale(0.8) rotate(0deg);
}

.artifact-drop:hover { 
  opacity: 1;
  /* Usa a variável CSS definida no template para a cor do brilho */
  filter: grayscale(0%) contrast(100%) drop-shadow(0 0 15px var(--glow-color));
  transform: scale(1.3) rotate(10deg);
  z-index: 10000;
}

.artifact-img { 
  width: 40px;
  height: 40px; 
  object-fit: contain; 
}

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