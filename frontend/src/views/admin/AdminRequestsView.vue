<template>
  <div class="container py-5">
    <div class="row mb-5">
      <div class="col">
        <h1 class="fw-black text-uppercase text-light display-5 tracking-tight">
          Solicitações de <span class="text-info">Acesso</span>
        </h1>
        <p class="text-secondary lead">Gerencie os pedidos de credenciamento para Pesquisador.</p>
        <hr class="border-secondary opacity-25">
      </div>
    </div>

    <div v-if="adminStore.loading" class="text-center py-5">
      <div class="spinner-border text-info" role="status"></div>
      <p class="text-secondary mt-3 blink">Carregando solicitações...</p>
    </div>

    <div v-else-if="adminStore.pendingRequests.length === 0" class="text-center py-5 rounded border border-secondary border-dashed border-opacity-25 opacity-75">
      <i class="bi bi-inbox fs-1 text-secondary opacity-50"></i>
      <h5 class="text-secondary mt-3 fw-bold text-uppercase">Tudo Limpo</h5>
      <p class="text-muted small">Nenhuma solicitação pendente no momento.</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="req in adminStore.pendingRequests" :key="req.id" class="col-12">
        <AdminRequestCard 
          :request="req" 
          @approve="adminStore.approveRequestAction"
          @reject="adminStore.rejectRequestAction"
        />
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
.tracking-tight { letter-spacing: -1px; }
.blink { animation: blink 1.5s infinite; }
@keyframes blink { 50% { opacity: 0.5; } }
</style>