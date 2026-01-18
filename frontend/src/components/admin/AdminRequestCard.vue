<template>
  <div class="card bg-dark border-secondary border-opacity-25 shadow-sm h-100 request-card overflow-hidden">
    <div class="card-body p-4 d-flex flex-column flex-lg-row align-items-start gap-4">
      
      <div class="d-flex gap-3 align-items-center flex-shrink-0 user-col">
        <div class="avatar-box rounded-circle bg-info bg-opacity-10 text-info border border-info border-opacity-25">
          {{ getInitials(request.user?.name) }}
        </div>
        
        <div class="overflow-hidden">
          <h6 class="text-light fw-bold mb-1 text-truncate" :title="request.user?.name">
            {{ request.user?.name || 'Usuário Desconhecido' }}
          </h6>
          
          <div class="d-flex flex-column gap-1">
            <span class="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-25 rounded-pill tiny-text w-fit">
              <i class="bi bi-building me-1"></i> {{ request.user?.institution || 'Sem Instituição' }}
            </span>
            <span class="text-muted tiny-text text-truncate">
              <i class="bi bi-envelope me-1"></i> {{ request.user?.email }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex-grow-1 w-100 position-relative ps-lg-4 border-start-lg border-secondary border-opacity-25 motivation-col">
        <i class="bi bi-quote position-absolute text-secondary opacity-10 display-3 quote-icon"></i>
        
        <div class="position-relative z-1 pt-2">
          <p class="text-gray-300 fst-italic mb-2">
            "{{ request.motivation }}"
          </p>
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-clock-history text-info small"></i>
            <span class="text-secondary x-small">
            Solicitado em: {{ formatDate(request.created_at) }}
            </span>
          </div>
        </div>
      </div>

      <div class="actions-col d-flex flex-row flex-lg-column gap-2 w-100 w-lg-auto border-top border-top-lg-0 border-secondary border-opacity-25 pt-3 pt-lg-0 mt-2 mt-lg-0">
        <button 
          @click="$emit('approve', request.id)" 
          class="btn btn-sm btn-success fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 w-100 shadow-success-hover py-2"
          title="Aprovar Solicitação"
        >
          <i class="bi bi-check-lg fs-6"></i> 
          <span class="d-inline d-lg-none d-xl-inline">Aprovar</span>
        </button>
        
        <button 
          @click="$emit('reject', request.id)" 
          class="btn btn-sm btn-outline-danger fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 w-100 hover-danger py-2"
          title="Rejeitar Solicitação"
        >
          <i class="bi bi-x-lg fs-6"></i> 
          <span class="d-inline d-lg-none d-xl-inline">Rejeitar</span>
        </button>
      </div>

    </div>
    
    <div class="card-footer p-0 bg-transparent border-0">
      <div class="progress" style="height: 3px;">
        <div class="progress-bar bg-info w-100 opacity-50" role="progressbar"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResearcherRequestResponse } from '@/types/researcherRequest';
import { formatDate } from '@/utils/formatters';

defineProps<{ request: ResearcherRequestResponse }>();
defineEmits(['approve', 'reject']);

const getInitials = (name?: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};
</script>

<style scoped>
.request-card { transition: transform 0.2s ease, border-color 0.2s ease; }
.request-card:hover { transform: translateY(-2px); border-color: #0dcaf0; }

.avatar-box {
  width: 56px; height: 56px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1.2rem;
  letter-spacing: -1px;
}

.tiny-text { font-size: 0.7rem; letter-spacing: 0.5px; }
.x-small { font-size: 0.75rem; }
.text-gray-300 { color: #d1d5db; }
.w-fit { width: fit-content; }

/* Responsividade customizada */
.user-col { min-width: 240px; max-width: 100%; }
.actions-col { min-width: 140px; }
.quote-icon { top: -10px; left: 0; }

@media (min-width: 992px) { /* lg breakpoint */
  .border-start-lg { border-left: 1px solid rgba(108, 117, 125, 0.25) !important; }
  .border-top-lg-0 { border-top: 0 !important; }
  .user-col { max-width: 260px; }
}

.shadow-success-hover:hover { box-shadow: 0 4px 12px rgba(25, 135, 84, 0.4); }
.hover-danger:hover { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; border-color: #dc3545; }
</style>