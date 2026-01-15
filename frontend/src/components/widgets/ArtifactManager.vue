<template>
  <div>
    <div 
      v-if="showArtifact && artifact" 
      class="artifact-drop"
      :style="{ top: position.top + '%', left: position.left + '%' }"
      @click="collectArtifact"
      title="Clique para coletar!"
    >
      <img :src="getImageUrl(artifact.image)" :alt="artifact.name" class="artifact-img" />
      <span class="sparkle">✨</span>
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
  if (Math.random() > 0.25) return; // 25% chance

  try {
    const response = await fetch(`${API_URL}/artifacts/random-choice`);
    if (!response.ok) return;
    const data = await response.json();
    artifact.value = data;
    position.value = { top: Math.random() * (70 - 15) + 15, left: Math.random() * (85 - 5) + 5 };
    showArtifact.value = true;
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
.artifact-drop { position: fixed; cursor: pointer; z-index: 9999; animation: float 3s ease-in-out infinite; transition: transform 0.2s; }
.artifact-drop:hover { transform: scale(1.15) rotate(5deg); }
.artifact-img { width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 0 15px rgba(255, 193, 7, 0.6)); }
.sparkle { position: absolute; top: -10px; right: -10px; font-size: 24px; animation: spin 2s linear infinite; text-shadow: 0 0 5px gold; }
.collection-feedback { position: fixed; bottom: 30px; right: 30px; background-color: #1a2f2b; color: #ffc107; padding: 1rem 1.5rem; border-radius: 4px; border: 2px solid #ffc107; box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 10000; text-transform: uppercase; display: flex; align-items: center; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes spin { from { transform: rotate(0deg); opacity: 0.5; } 50% { opacity: 1; } to { transform: rotate(360deg); opacity: 0.5; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>