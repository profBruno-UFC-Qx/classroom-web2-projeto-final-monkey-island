<template>
  <div class="card h-100 bg-dark border-secondary artifact-card shadow-sm">
    <div class="card-img-top bg-black bg-opacity-50 position-relative p-3 d-flex align-items-center justify-content-center" style="height: 180px;">
      <img 
        :src="imageUrl" 
        :alt="artifact.name" 
        class="img-fluid object-fit-contain drop-shadow artifact-img"
        @error="handleImageError"
      />
      <span 
        class="position-absolute top-0 end-0 m-2 badge rounded-pill shadow-sm text-uppercase fw-bold"
        :class="badgeClass"
        style="font-size: 0.6rem; letter-spacing: 1px;"
      >
        {{ artifact.rarity }}
      </span>
    </div>

    <div class="card-body d-flex flex-column border-top border-secondary border-opacity-25">
      <h6 class="card-title text-light fw-bold mb-1 text-truncate" :title="artifact.name">
        {{ artifact.name }}
      </h6>
      <p class="card-text text-secondary small mb-3">
        ID: <span class="font-monospace text-muted">{{ artifact.id.slice(0, 6) }}...</span>
      </p>
      
      <button 
        @click="$emit('delete', artifact.id)" 
        class="btn btn-sm btn-outline-danger mt-auto w-100 border-opacity-50 hover-danger"
      >
        <i class="bi bi-trash-fill me-1"></i> Excluir
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Artifact } from '@/types/artifact';
import artifactService from '@/services/artifactService';
import { useArtifactStore } from '@/stores/artifactStore';

const props = defineProps<{ artifact: Artifact }>();
defineEmits(['delete']);

const store = useArtifactStore();

// Usa o Service para URL correta, removendo a lógica duplicada da View antiga
const imageUrl = computed(() => artifactService.getImageUrl(props.artifact.image));
const badgeClass = computed(() => store.getRarityBadgeClass(props.artifact.rarity));

const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = 'https://placehold.co/150x150/1a1a1a/ffb400?text=Sem+Imagem';
};
</script>

<style scoped>
/* Copiar estilos de .artifact-card e .artifact-img da view original */
.artifact-card { transition: all 0.3s; border: 1px solid #2c2c2c; }
.artifact-card:hover { transform: translateY(-5px); border-color: #ffb400; }
.artifact-img { max-height: 140px; }
</style>