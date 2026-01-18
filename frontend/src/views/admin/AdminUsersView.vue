<template>
  <div class="page-container">
    <div class="container pt-5 pb-4">
      
      <div class="row mb-5 align-items-end">
        <div class="col-md-8">
          <h6 class="text-warning text-uppercase fw-bold mb-2 small tracking-wide">
            <i class="bi bi-people-fill me-1"></i> Controle de Acesso
          </h6>
          <h1 class="display-5 fw-bold text-white mb-0">
            Gestão de <span class="text-warning">Visitantes</span>
          </h1>
          <p class="text-secondary lead mt-3 mb-0" style="max-width: 600px;">
            Gerencie as credenciais, permissões e status de todos os usuários registrados no sistema.
          </p>
        </div>
      </div>

      <hr class="border-secondary opacity-25 mb-5">

      <div v-if="adminStore.loading" class="text-center py-5 my-5">
        <div class="spinner-border text-warning mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="text-secondary text-uppercase small fw-bold">Carregando base de dados...</p>
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        <div v-for="user in sortedUsers" :key="user.id" class="col">
          <AdminUserCard 
            :user="user" 
            @ban="handleBan"
          />
        </div>
      </div>

      <div v-if="!adminStore.loading && adminStore.users.length === 0" class="text-center py-5 opacity-50">
        <i class="bi bi-people fs-1 text-secondary"></i>
        <p class="mt-3 text-secondary">Nenhum usuário encontrado.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import AdminUserCard from '@/components/admin/AdminUserCard.vue';

const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchUsers();
});

const sortedUsers = computed(() => {
  return [...adminStore.users].sort((a, b) => {
    // Ativos primeiro
    if (a.status !== b.status) {
      return a.status ? -1 : 1;
    }
    // Depois alfabético
    return a.name.localeCompare(b.name);
  });
});

const handleBan = async (userId: string) => {
  // 1. Pede o motivo
  const reason = prompt('Por favor, digite o motivo do banimento (Obrigatório):');
  
  // 2. Valida
  if (reason === null) return; // Cancelou
  if (reason.trim() === '') return alert('O motivo é obrigatório para banir um usuário.');

  try {
    // 3. Chama a store corrigida passando ID e Motivo
    await adminStore.banUserAction(userId, reason);
    alert('Usuário banido com sucesso.');
  } catch (error) {
    console.error(error);
    alert('Erro ao banir usuário. Verifique se você tem permissão.');
  }
};
</script>

<style scoped>
.page-container { 
  min-height: 100vh; 
  background-color: #121212; 
}
.tracking-wide { 
  letter-spacing: 1px; 
}
</style>