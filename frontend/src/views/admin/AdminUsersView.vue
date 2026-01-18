<template>
  <div class="container py-5">
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h1 class="fw-black text-uppercase text-light display-5">
          Gestão de <span class="text-warning">Visitantes</span>
        </h1>
        <p class="text-secondary">Controle de acesso e status dos usuários do parque.</p>
      </div>
    </div>

    <div class="card bg-dark border-secondary shadow-lg">
      <div class="card-body p-0">
        <div v-if="adminStore.loading" class="p-5 text-center text-warning">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-dark table-hover mb-0 align-middle">
            <thead class="bg-black text-warning text-uppercase small">
              <tr>
                <th class="ps-4 py-3">Nome</th>
                <th class="py-3">Email</th>
                <th class="py-3">Credencial</th>
                <th class="py-3">Status</th>
                <th class="pe-4 py-3 text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in adminStore.users" :key="user.id" class="border-secondary">
                <td class="ps-4 py-3 fw-bold text-light">
                  <i class="bi bi-person-circle text-secondary me-2"></i>
                  {{ user.name }}
                </td>
                <td class="py-3 text-secondary">{{ user.email }}</td>
                <td class="py-3">
                  <span :class="roleBadgeClass(user.role)" class="badge rounded-pill text-uppercase">
                    {{ translateRole(user.role) }}
                  </span>
                </td>
                <td class="py-3">
                  <div class="d-flex align-items-center gap-2">
                    <span 
                      class="d-inline-block rounded-circle" 
                      style="width: 10px; height: 10px;"
                      :class="user.status ? 'bg-success shadow-success' : 'bg-danger shadow-danger'"
                    ></span>
                    <span :class="user.status ? 'text-success' : 'text-danger'" class="small fw-bold">
                      {{ user.status ? 'Ativo' : 'Banido' }}
                    </span>
                  </div>
                </td>
                <td class="pe-4 py-3 text-end">
                  <button 
                    v-if="user.role !== 'ADMIN' && user.role !== 'admin'"
                    @click="banUser(user.id)" 
                    class="btn btn-sm fw-bold transition-transform"
                    :class="user.status ? 'btn-outline-danger' : 'btn-outline-success'"
                    title="Alterar status de acesso"
                  >
                    <i :class="user.status ? 'bi bi-slash-circle' : 'bi bi-check-circle'"></i>
                    {{ user.status ? 'Banir' : 'Reativar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
  adminStore.fetchUsers();
});

const banUser = async (id: string) => {
  if (confirm('Tem certeza que deseja alterar o status de acesso deste usuário?')) {
    await adminStore.banUserAction(id);
  }
};

const translateRole = (role: string) => {
  const map: Record<string, string> = {
    'admin': 'Administrador',
    'ADMIN': 'Administrador',
    'researcher': 'Pesquisador',
    'RESEARCHER': 'Pesquisador',
    'user': 'Visitante',
    'USER': 'Visitante'
  };
  return map[role] || role;
};

const roleBadgeClass = (role: string) => {
  const r = role.toLowerCase();
  if (r === 'admin') return 'bg-danger text-white border border-danger';
  if (r === 'researcher') return 'bg-info text-dark border border-info';
  return 'bg-secondary text-light border border-secondary';
};
</script>

<style scoped>
.shadow-success { box-shadow: 0 0 8px rgba(25, 135, 84, 0.6); }
.shadow-danger { box-shadow: 0 0 8px rgba(220, 53, 69, 0.6); }
.transition-transform:hover { transform: scale(1.05); }
</style>