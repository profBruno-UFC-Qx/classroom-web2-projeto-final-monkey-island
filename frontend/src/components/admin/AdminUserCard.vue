<template>
  <div class="card bg-dark border-secondary h-100 user-card">
    <div class="card-body p-4 d-flex flex-column">
      
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="d-flex align-items-center gap-3">
          <div 
            class="rounded-circle d-flex align-items-center justify-content-center border"
            :class="statusClasses.bg"
            style="width: 48px; height: 48px; font-weight: bold;"
          >
            {{ userInitials }}
          </div>
          
          <div class="overflow-hidden">
            <h6 class="text-white fw-bold mb-0 text-truncate" :title="user.name">
              {{ user.name }}
            </h6>
            <span class="badge rounded-pill mt-1 border" :class="roleClasses">
              {{ userRoleLabel }}
            </span>
          </div>
        </div>

        <div 
          class="rounded-circle"
          :class="user.status === 'active' ? 'bg-success' : 'bg-danger'"
          style="width: 10px; height: 10px;"
          :title="user.status === 'active' ? 'Ativo' : 'Banido'"
        ></div>
      </div>

      <div class="d-flex flex-column gap-2 text-secondary small mb-4">
        <div class="text-truncate">
          <i class="bi bi-envelope me-2"></i>{{ user.email }}
        </div>
        <div class="text-truncate">
          <i class="bi bi-building me-2"></i>{{ user.institution }}
        </div>
      </div>

      <div class="mt-auto">
        <button 
          v-if="user.status === 'active'"
          @click="$emit('ban', user.id)" 
          class="btn btn-sm btn-outline-danger w-100 text-uppercase fw-bold"
          :disabled="isAdmin"
          :title="isAdmin ? 'Não é possível banir administradores' : 'Banir usuário'"
        >
          <i class="bi bi-slash-circle me-2"></i> Banir
        </button>

        <div v-else class="text-center py-1 text-danger small fw-bold border border-danger rounded bg-danger bg-opacity-10">
          <i class="bi bi-lock-fill me-1"></i> Acesso Bloqueado
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '@/types/user';

const props = defineProps<{ user: User }>();
defineEmits(['ban']);

const isAdmin = computed(() => props.user.role?.toLowerCase() === 'admin');

const userInitials = computed(() => {
  const name = props.user.name || '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
});

const userRoleLabel = computed(() => {
  const map: Record<string, string> = { 
    admin: 'Admin', researcher: 'Pesquisador', user: 'Visitante' 
  };
  return map[props.user.role?.toLowerCase()] || 'Visitante';
});

const roleClasses = computed(() => {
  const role = props.user.role?.toLowerCase();
  if (role === 'admin') return 'bg-warning text-dark border-warning';
  if (role === 'researcher') return 'bg-info text-dark border-info';
  return 'bg-secondary text-light border-secondary';
});

const statusClasses = computed(() => {
  // CORREÇÃO: Ajuste na lógica de cores do avatar baseado no status string
  return props.user.status === 'active'
    ? { bg: 'bg-success bg-opacity-10 text-success border-success' }
    : { bg: 'bg-danger bg-opacity-10 text-danger border-danger' };
});
</script>

<style scoped>
.user-card {
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.user-card:hover {
  transform: translateY(-2px);
  border-color: #6c757d !important;
}
</style>