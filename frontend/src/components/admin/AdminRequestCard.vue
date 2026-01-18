<template>
  <div class="card bg-dark border-secondary shadow-lg h-100">
    <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
      
      <div class="d-flex gap-4 align-items-start">
        <div class="bg-secondary bg-opacity-10 p-3 rounded d-flex flex-column align-items-center justify-content-center border border-secondary border-opacity-25" style="width: 80px; height: 80px;">
          <i class="bi bi-person-badge fs-3 text-info"></i>
          <span class="tiny-text text-muted mt-1 font-monospace">#{{ request.id.slice(0,4) }}</span>
        </div>
        
        <div>
          <h5 class="text-light fw-bold mb-1">
             {{ request.user?.name || 'Usuário Desconhecido' }}
          </h5>
          <p class="text-info small text-uppercase fw-bold mb-2">
            {{ request.user?.institution || 'Sem Instituição' }}
          </p>
          
          <div class="bg-black bg-opacity-50 p-2 rounded border border-secondary border-opacity-25">
             <p class="text-secondary mb-0 fst-italic small">"{{ request.motivation }}"</p>
          </div>
          
          <div class="d-flex gap-2 mt-2">
            <span class="badge bg-warning text-dark d-flex align-items-center gap-1">
              <i class="bi bi-clock-history"></i> Pendente
            </span>
            <span class="text-secondary x-small py-1">
              Solicitado em: {{ formatDate(request.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column gap-2 w-100 w-md-auto mt-3 mt-md-0" style="min-width: 140px;">
        <button 
          @click="$emit('approve', request.id)" 
          class="btn btn-success fw-bold text-uppercase btn-sm d-flex align-items-center justify-content-center gap-2"
        >
          <i class="bi bi-check-lg"></i> Aprovar
        </button>
        <button 
          @click="$emit('reject', request.id)" 
          class="btn btn-outline-danger fw-bold text-uppercase btn-sm d-flex align-items-center justify-content-center gap-2 hover-danger"
        >
          <i class="bi bi-x-lg"></i> Rejeitar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResearcherRequest } from '@/types/researcherRequest'; // Ajuste o caminho se necessário
import { formatDate } from '@/utils/formatters'; // Use seu formatador existente ou crie um simples

defineProps<{ request: ResearcherRequest }>();
defineEmits(['approve', 'reject']);
</script>

<style scoped>
.tiny-text { font-size: 0.65rem; }
.x-small { font-size: 0.75rem; }
.hover-danger:hover { background-color: #dc3545; color: white; }
</style>