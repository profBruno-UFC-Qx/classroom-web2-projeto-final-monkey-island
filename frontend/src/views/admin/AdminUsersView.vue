<template>
  <div class="page-container">
    <div class="container pt-5 pb-4">
      
      <div class="row mb-5 align-items-end">
        <div class="col-md-8">
          <h6 class="text-warning text-uppercase fw-bold mb-2 tracking-wide small">
            <i class="bi bi-people-fill me-1"></i> Controle de Acesso
          </h6>
          <h1 class="display-5 fw-black text-light mb-0 tracking-tighter">
            Gestão de <span class="text-warning position-relative">Visitantes
              <svg class="position-absolute w-100 bottom-0 start-0" height="8" style="opacity: 0.3; transform: translateY(4px);">
                <path d="M0 4 Q 50 8 100 4" stroke="#ffc107" stroke-width="4" fill="none" />
              </svg>
            </span>
          </h1>
          <p class="text-secondary lead mt-3 mb-0" style="max-width: 600px;">
            Gerencie as credenciais, permissões e status de todos os usuários registrados no sistema.
          </p>
        </div>

        <div class="col-md-4 text-md-end mt-4 mt-md-0">
          <div class="d-inline-flex gap-3">
            <div class="px-3 py-2 rounded bg-dark border border-secondary border-opacity-25 text-center">
              <span class="d-block text-secondary x-small text-uppercase">Total</span>
              <span class="fw-bold text-light fs-5">{{ adminStore.users.length }}</span>
            </div>
            <div class="px-3 py-2 rounded bg-dark border border-secondary border-opacity-25 text-center">
              <span class="d-block text-secondary x-small text-uppercase">Banidos</span>
              <span class="fw-bold text-danger fs-5">{{ bannedCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <hr class="border-secondary opacity-25 mb-5">

      <div v-if="adminStore.loading" class="text-center py-5 my-5">
        <div class="spinner-border text-warning mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="text-secondary text-uppercase small fw-bold tracking-wide blink">Carregando base de dados...</p>
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        <TransitionGroup name="list">
          <div v-for="user in sortedUsers" :key="user.id" class="col">
            <AdminUserCard 
              :user="user" 
              :loading="isProcessing === user.id"
              @ban="handleBan"
            />
          </div>
        </TransitionGroup>
      </div>

      <div v-if="!adminStore.loading && adminStore.users.length === 0" class="text-center py-5 opacity-50">
        <i class="bi bi-people fs-1 text-secondary"></i>
        <p class="mt-3">Nenhum usuário encontrado.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import AdminUserCard from '@/components/admin/AdminUserCard.vue';

const adminStore = useAdminStore();
const isProcessing = ref<string | null>(null);

onMounted(() => {
  adminStore.fetchUsers();
});

const bannedCount = computed(() => adminStore.users.filter(u => !u.status).length);

// Ordena: Ativos primeiro, depois por nome
const sortedUsers = computed(() => {
  return [...adminStore.users].sort((a, b) => {
    if (a.status === b.status) return a.name.localeCompare(b.name);
    return a.status ? -1 : 1;
  });
});

const handleBan = async (id: string) => {
  if (!confirm('ATENÇÃO: Deseja realmente banir este usuário? Ele perderá o acesso imediatamente.')) return;
  
  isProcessing.value = id;
  try {
    await adminStore.banUserAction(id);
  } catch (error) {
    alert('Erro ao banir usuário. Verifique se você tem permissão.');
  } finally {
    isProcessing.value = null;
  }
};
</script>

<style scoped>
.page-container { min-height: 100vh; background-color: #121212; }
.tracking-tighter { letter-spacing: -2px; }
.tracking-wide { letter-spacing: 2px; }
.fw-black { font-weight: 900; }
.x-small { font-size: 0.65rem; font-weight: 700; }
.blink { animation: blink 2s infinite ease-in-out; }

/* Animações */
.list-move, .list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
.list-leave-active { position: absolute; width: 100%; }
</style>