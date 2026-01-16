<template>
  <div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning mb-3" role="status"></div>
      <p class="text-light-fossil font-monospace small blink-text">
        SINCRONIZANDO COMUNIDADES...
      </p>
    </div>

    <div
      v-else-if="error"
      class="alert alert-danger border-0 shadow-sm fw-bold text-center"
    >
      <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
      <div class="mt-2">
        <button class="btn btn-sm btn-outline-danger" @click="$emit('retry')">
          Tentar Novamente
        </button>
      </div>
    </div>

    <div
      v-else-if="communities.length === 0"
      class="text-center py-5 opacity-50"
    >
      <i class="bi bi-diagram-2 display-1 text-secondary"></i>
      <h5 class="mt-3 text-uppercase fw-bold text-secondary">
        Nenhuma comunidade
      </h5>
      <p class="small text-muted">
        Não há comunidades correspondentes à sua pesquisa.
      </p>
    </div>

    <div v-else class="communities-list d-flex flex-column gap-3">
      <CommunityCard
        v-for="community in communities"
        :key="community.id"
        :community="community"
        @select="$emit('select', community)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommunityCard from './CommunityCard.vue';

defineProps<{
  communities: any[];
  loading: boolean;
  error: string | null;
}>();

defineEmits(['retry', 'select']);
</script>

<style scoped>
/* estilos da lista e scrollbar */
.text-light-fossil { color: #e8e2d9; }
.blink-text { animation: blink 1.5s infinite; }

.communities-list {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
}

.communities-list::-webkit-scrollbar { width: 8px; }
.communities-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffc107, #ffea70);
  border-radius: 4px;
  border: 2px solid #1a2f2b;
}
.communities-list::-webkit-scrollbar-track {
  background: rgba(26, 47, 43, 0.8);
  border-radius: 4px;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>