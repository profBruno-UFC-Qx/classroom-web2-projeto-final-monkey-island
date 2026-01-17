<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Solicitações de Pesquisador</h1>

    <div v-if="adminStore.pendingRequests.length === 0" class="text-gray-400">
      Não há solicitações pendentes.
    </div>

    <div v-else class="grid gap-4">
      <div v-for="req in adminStore.pendingRequests" :key="req.id" class="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl text-white font-bold">Solicitação #{{ req.id.slice(0,8) }}</h3>
            <p class="text-gray-400 mt-2"><strong>Motivação:</strong> {{ req.motivation }}</p>
            <p class="text-sm text-gray-500 mt-1">Status atual: {{ req.status }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="adminStore.approveRequestAction(req.id)" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Aprovar
            </button>
            <button @click="adminStore.rejectRequestAction(req.id)" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Rejeitar
            </button>
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