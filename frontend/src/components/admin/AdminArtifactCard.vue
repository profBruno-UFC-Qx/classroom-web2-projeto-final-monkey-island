<template>
  <div class="card h-100 bg-dark border-secondary artifact-card">
    <div class="card-img-top position-relative p-4 bg-black d-flex align-items-center justify-content-center" style="height: 200px;">
      
      <img 
        v-if="hasValidImage"
        :src="fullImageUrl" 
        :alt="artifact.name" 
        class="img-fluid artifact-img"
        @error="handleImageError"
      />
      
      <div v-else class="text-center opacity-50">
        <i class="bi display-4" :class="[config.icon, `text-${config.color}`]"></i>
      </div>

      <span 
        class="position-absolute top-0 end-0 m-2 badge rounded-0 fw-normal text-uppercase border border-opacity-25"
        :class="[`bg-${config.color}`, config.color === 'warning' || config.color === 'info' ? 'text-dark' : 'text-white']"
      >
        {{ config.label }}
      </span>
    </div>

    <div class="card-body d-flex flex-column border-top border-secondary">
      <h6 class="card-title text-white text-truncate fw-bold" :title="artifact.name">
        {{ artifact.name }}
      </h6>
      
      <p class="card-text text-secondary small flex-grow-1 line-clamp-2">
        {{ artifact.description || 'Sem descrição disponível.' }}
      </p>
      
      <div class="mt-3">
        <button 
          @click="$emit('delete', artifact.id)" 
          class="btn btn-sm btn-outline-danger w-100"
        >
          <i class="bi bi-trash me-2"></i>Excluir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Artifact } from '@/types/artifact';
import { getImageUrl } from '@/utils/mediaUtils';

const props = defineProps<{ artifact: Artifact }>();
defineEmits(['delete']);

const imageError = ref(false);

// Configuração Visual (Mapeamento Declarativo)
const RARITY_MAP: Record<string, { label: string; color: string; icon: string }> = {
  fragment: { label: 'Fragmento', color: 'secondary', icon: 'bi-puzzle' },
  partial_fossil: { label: 'Parcial', color: 'info', icon: 'bi-bounding-box' },
  rare: { label: 'Raro', color: 'primary', icon: 'bi-gem' },
  exceptional_specimen: { label: 'Excepcional', color: 'warning', icon: 'bi-star-fill' },
  unique_specimen: { label: 'Único', color: 'danger', icon: 'bi-trophy-fill' }
};

// Computed Helpers
const config = computed(() => RARITY_MAP[props.artifact.rarity] || RARITY_MAP.fragment);

const fullImageUrl = computed(() => getImageUrl(props.artifact.image));

const hasValidImage = computed(() => {
  return props.artifact.image && 
         !props.artifact.image.includes('placeholder') && 
         !imageError.value;
});

// UI Handlers
const handleImageError = () => {
  imageError.value = true;
};
</script>

<style scoped>
.artifact-card {
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.artifact-card:hover {
  border-color: #ffc107 !important; /* Amarelo Industrial */
  transform: translateY(-2px);
}

.artifact-img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>