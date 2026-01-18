<template>
  <div class="container py-5">
    <div class="row mb-5">
      <div class="col">
        <h1 class="fw-black text-uppercase text-light display-5">
          Solicitações de <span class="text-info">Acesso</span>
        </h1>
        <p class="text-secondary">Avalie os pedidos de credenciamento para Pesquisador.</p>
      </div>
    </div>

    <div v-if="adminStore.loading" class="text-center py-5">
      <div class="spinner-border text-info" role="status"></div>
    </div>

    <div v-else-if="adminStore.pendingRequests.length === 0" class="text-center py-5 bg-dark rounded border border-secondary border-dashed opacity-50">
      <i class="bi bi-inbox fs-1 text-secondary"></i>
      <p class="text-secondary mt-3">Nenhuma solicitação pendente no momento.</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="req in adminStore.pendingRequests" :key="req.id" class="col-12">
        <div class="card bg-dark border-secondary shadow-lg">
          <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
            
            <div class="d-flex gap-4 align-items-start">
              <div class="bg-secondary bg-opacity-25 p-3 rounded d-flex flex-column align-items-center justify-content-center" style="width: 80px; height: 80px;">
                <i class="bi bi-file-text fs-3 text-info"></i>
                <span class="tiny-text text-muted mt-1">#{{ req.id.slice(0,4) }}</span>
              </div>
              
              <div>
                <h5 class="text-light fw-bold mb-1">Candidato a Pesquisador</h5>
                <p class="text-gray-400 mb-2 fst-italic">"{{ req.motivation }}"</p>
                <div class="d-flex gap-2">
                  <span class="badge bg-warning text-dark">Pendente</span>
                  <span class="text-secondary small">{{ new Date().toLocaleDateString() }}</span> </div>
              </div>
            </div>

            <div class="d-flex gap-2 w-100 w-md-auto mt-3 mt-md-0">
              <button 
                @click="adminStore.approveRequestAction(req.id)" 
                class="btn btn-success fw-bold flex-grow-1 text-uppercase"
              >
                <i class="bi bi-check-lg me-1"></i> Aprovar
              </button>
              <button 
                @click="adminStore.rejectRequestAction(req.id)" 
                class="btn btn-outline-danger fw-bold flex-grow-1 text-uppercase"
              >
                <i class="bi bi-x-lg me-1"></i> Rejeitar
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchPendingRequests();
});
</script>

<style scoped>
.tiny-text { font-size: 0.7rem; }
.text-gray-400 { color: #adb5bd; }
</style>