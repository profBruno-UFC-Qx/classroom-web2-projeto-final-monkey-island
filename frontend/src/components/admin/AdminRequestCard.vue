<template>
  <div class="card bg-dark border-secondary shadow-sm h-100 request-card">
    <div class="card-body p-4">
      <div class="row g-4 align-items-center">
        
        <div class="col-lg-4 d-flex align-items-center gap-3">
          <div class="avatar-box bg-dark border border-info text-info rounded-circle">
            {{ getInitials(request.user?.name) }}
          </div>
          
          <div class="overflow-hidden">
            <h6 class="text-white fw-bold mb-1 text-truncate" :title="request.user?.name">
              {{ request.user?.name || 'Usuário Desconhecido' }}
            </h6>
            
            <div class="d-flex flex-column text-secondary small">
              <span v-if="request.user?.institution" class="text-truncate">
                <i class="bi bi-building me-1"></i> {{ request.user.institution }}
              </span>
              <span class="text-truncate">
                <i class="bi bi-envelope me-1"></i> {{ request.user?.email }}
              </span>
            </div>
          </div>
        </div>

        <div class="col-lg-6 position-relative border-start-lg border-secondary">
          <i class="bi bi-quote text-secondary fs-1 position-absolute top-0 start-0 opacity-25 translate-middle-y d-none d-lg-block"></i>
          
          <div class="ps-lg-4">
            <p class="text-light fst-italic mb-2 text-break">
              "{{ request.motivation }}"
            </p>
            <div class="text-secondary" style="font-size: 0.8rem;">
              <i class="bi bi-clock me-1"></i> 
              Solicitado em: {{ formatDate(request.created_at) }}
            </div>
          </div>
        </div>

        <div class="col-lg-2 d-flex flex-lg-column gap-2">
          <button 
            @click="$emit('approve', request.id)" 
            class="btn btn-sm btn-success w-100 fw-bold"
            title="Aprovar"
          >
            <i class="bi bi-check-lg me-1"></i> Aprovar
          </button>
          
          <button 
            @click="$emit('reject', request.id)" 
            class="btn btn-sm btn-outline-danger w-100 fw-bold"
            title="Rejeitar"
          >
            <i class="bi bi-x-lg me-1"></i> Rejeitar
          </button>
        </div>

      </div>
    </div>
    
    <div class="card-footer p-0 border-0 bg-transparent">
      <div class="progress" style="height: 2px;">
        <div class="progress-bar bg-info w-100 opacity-25"></div>
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
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
</script>

<style scoped>
.request-card {
  transition: border-color 0.2s, transform 0.2s;
}

.request-card:hover {
  border-color: #0dcaf0 !important; /* Info Cyan */
  transform: translateY(-2px);
}

.avatar-box {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  background-color: rgba(13, 202, 240, 0.1) !important; /* Info with opacity */
  flex-shrink: 0;
}

/* Ajuste de borda responsiva para telas grandes */
@media (min-width: 992px) {
  .border-start-lg {
    border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
}
</style>