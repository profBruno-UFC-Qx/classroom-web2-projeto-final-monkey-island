<template>
  <div class="page-container">
    <div class="container pt-5 pb-4">
      
      <div class="row mb-5 align-items-end">
        <div class="col-md-8">
          <h6 class="text-info text-uppercase fw-bold mb-2 tracking-wide small">
            <i class="bi bi-shield-lock me-1"></i> Área Administrativa
          </h6>
          <h1 class="display-5 fw-black text-light mb-0 tracking-tighter">
            Solicitações de <span class="text-info position-relative">Acesso
              <svg class="position-absolute w-100 bottom-0 start-0" height="8" style="opacity: 0.3; transform: translateY(4px);">
                <path d="M0 4 Q 50 8 100 4" stroke="#0dcaf0" stroke-width="4" fill="none" />
              </svg>
            </span>
          </h1>
          <p class="text-secondary lead mt-3 mb-0" style="max-width: 600px;">
            Gerencie os pedidos de credenciamento para o nível de Pesquisador e expanda nossa comunidade científica.
          </p>
        </div>
        
        <div class="col-md-4 text-md-end mt-4 mt-md-0">
          <div class="d-inline-flex align-items-center gap-3 px-4 py-2 rounded-pill bg-dark border border-secondary border-opacity-25 shadow-sm">
            <span class="text-secondary small text-uppercase fw-bold">Pendentes:</span>
            <span class="fs-4 fw-black text-info">{{ adminStore.pendingRequests.length }}</span>
          </div>
        </div>
      </div>

      <hr class="border-secondary opacity-25 mb-5">

      <div v-if="adminStore.loading" class="text-center py-5 my-5">
        <div class="spinner-border text-info mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="text-secondary text-uppercase small fw-bold tracking-wide blink">Sincronizando dados...</p>
      </div>

      <div v-else-if="adminStore.pendingRequests.length === 0" class="row justify-content-center py-5">
        <div class="col-md-6 col-lg-5 text-center">
          <div class="mb-4 p-4 rounded-circle bg-dark d-inline-flex align-items-center justify-content-center border border-secondary border-opacity-25 border-dashed" style="width: 120px; height: 120px;">
            <i class="bi bi-check2-all fs-1 text-success opacity-75"></i>
          </div>
          <h3 class="text-light fw-bold mb-2">Tudo em dia!</h3>
          <p class="text-secondary">Não há novas solicitações de pesquisador aguardando análise no momento.</p>
        </div>
      </div>

      <div v-else class="row g-4">
        <TransitionGroup name="list">
          <div v-for="req in adminStore.pendingRequests" :key="req.id" class="col-12">
            <AdminRequestCard 
              :request="req" 
              @approve="adminStore.approveRequestAction"
              @reject="adminStore.rejectRequestAction"
            />
          </div>
        </TransitionGroup>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import AdminRequestCard from '@/components/admin/AdminRequestCard.vue';

const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchPendingRequests();
});
</script>

<style scoped>
.page-container { min-height: 100vh; background-color: #121212; }
.tracking-tighter { letter-spacing: -2px; }
.tracking-wide { letter-spacing: 2px; }
.fw-black { font-weight: 900; }
.blink { animation: blink 2s infinite ease-in-out; }

@keyframes blink { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

/* Animações da Lista */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-active {
  position: absolute;
  width: 100%; /* Garante layout estável durante saída */
}
</style>