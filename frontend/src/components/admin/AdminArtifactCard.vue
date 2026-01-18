<template>
  <div class="card h-100 bg-dark border-secondary artifact-card shadow-sm">
    <div class="card-img-wrapper position-relative p-3 d-flex align-items-center justify-content-center bg-black bg-opacity-25">
      
      <img 
        v-if="hasValidImage"
        :src="fullImageUrl" 
        :alt="artifact.name" 
        class="img-fluid object-fit-contain artifact-img drop-shadow"
        @error="handleImageError"
      />
      
      <div v-else class="d-flex align-items-center justify-content-center h-100 w-100 text-secondary">
        <i class="bi bi-gem fs-1 opacity-50" :class="badgeTextClass"></i>
      </div>

      <span 
        class="position-absolute top-0 end-0 m-2 badge rounded-pill shadow-sm text-uppercase fw-bold border border-opacity-25"
        :class="badgeClass"
        style="font-size: 0.6rem; letter-spacing: 1px;"
      >
        {{ formatRarity(artifact.rarity) }}
      </span>
    </div>

    <div class="card-body d-flex flex-column border-top border-secondary border-opacity-25">
      <h6 class="card-title text-light fw-bold mb-1 text-truncate" :title="artifact.name">
        {{ artifact.name }}
      </h6>
      
      <p class="card-text text-secondary small mb-3 text-truncate" style="min-height: 20px;">
        {{ artifact.description || 'Sem descrição' }}
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
import { getImageUrl } from '@/utils/mediaUtils';

const props = defineProps<{ artifact: Artifact }>();
defineEmits(['delete']);

// Verifica se a imagem existe e não é um placeholder (Lógica do RelicsVaultModal)
const hasValidImage = computed(() => {
  return props.artifact.image && !props.artifact.image.includes('placeholder');
});

// Computa a URL. REMOVIDO o prefixo 'artifacts/' que estava causando o erro 404
const fullImageUrl = computed(() => {
  return getImageUrl(props.artifact.image);
});

// Cores baseadas no Enum (fundo do badge)
const badgeClass = computed(() => {
  const map: Record<string, string> = {
    'fragment': 'bg-secondary text-light',
    'partial_fossil': 'bg-info text-dark',
    'rare': 'bg-primary text-light',
    'exceptional_specimen': 'bg-warning text-dark',
    'unique_specimen': 'bg-danger text-light shadow-danger'
  };
  return map[props.artifact.rarity] || 'bg-secondary';
});

// Cores do ícone de fallback (texto)
const badgeTextClass = computed(() => {
  const map: Record<string, string> = {
    'fragment': 'text-secondary',
    'partial_fossil': 'text-info',
    'rare': 'text-primary',
    'exceptional_specimen': 'text-warning',
    'unique_specimen': 'text-danger'
  };
  return map[props.artifact.rarity] || 'text-secondary';
});

const formatRarity = (rarity: string) => {
  const labels: Record<string, string> = {
    'fragment': 'Fragmento',
    'partial_fossil': 'Parcial',
    'rare': 'Raro',
    'exceptional_specimen': 'Excepcional',
    'unique_specimen': 'Único'
  };
  return labels[rarity] || rarity;
};

const handleImageError = (event: Event) => {
  // Fallback visual simples se a imagem quebrar
  (event.target as HTMLElement).style.display = 'none';
  if ((event.target as HTMLElement).parentElement) {
      // Opcional: mostrar o ícone de fallback forçando a reatividade ou manipulando DOM
      // Aqui apenas escondemos a imagem quebrada para mostrar o fundo do card
  }
};
</script>

<style scoped>
.artifact-card { transition: transform 0.2s, border-color 0.2s; border: 1px solid #333; }
.artifact-card:hover { transform: translateY(-3px); border-color: #ffb400; }
.card-img-wrapper { height: 160px; overflow: hidden; }
.artifact-img { max-height: 100%; max-width: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5)); }
.hover-danger:hover { background-color: #dc3545; color: white; }
</style>