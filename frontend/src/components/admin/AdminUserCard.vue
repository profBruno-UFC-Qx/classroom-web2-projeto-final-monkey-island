<template>
  <div class="card bg-dark border-secondary border-opacity-25 shadow-sm h-100 user-card group">
    <div class="card-body p-4 d-flex flex-column gap-3">
      
      <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex gap-3 align-items-center">
          <div 
            class="avatar-box rounded-circle d-flex align-items-center justify-content-center fw-bold border border-opacity-25 shadow-sm"
            :class="statusClasses.avatarBg"
          >
            {{ getInitials(user.name) }}
          </div>
          
          <div class="overflow-hidden">
            <h6 class="text-light fw-bold mb-0 text-truncate" :title="user.name">
              {{ user.name }}
            </h6>
            <span class="badge rounded-pill mt-1" :class="roleBadgeClass">
              {{ translateRole(user.role) }}
            </span>
          </div>
        </div>

        <div 
          class="status-dot rounded-circle shadow-glow"
          :class="user.status ? 'bg-success' : 'bg-danger'"
          :title="user.status ? 'Ativo' : 'Banido'"
        ></div>
      </div>

      <div class="py-2 border-top border-bottom border-secondary border-opacity-10 my-1">
        <div class="d-flex align-items-center gap-2 text-secondary mb-1 text-truncate">
          <i class="bi bi-envelope small"></i>
          <span class="small font-monospace">{{ user.email }}</span>
        </div>
        <div class="d-flex align-items-center gap-2 text-secondary text-truncate">
          <i class="bi bi-building small"></i>
          <span class="small">{{ user.institution || 'Sem instituição' }}</span>
        </div>
      </div>

      <div class="mt-auto pt-2">
        <button 
          v-if="user.status"
          @click="$emit('ban', user.id)" 
          class="btn btn-sm btn-outline-danger w-100 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 hover-danger"
          :disabled="loading || isSelfOrAdmin"
          :title="isSelfOrAdmin ? 'Não é possível banir admins' : 'Banir Usuário'"
        >
          <i class="bi bi-slash-circle"></i> Banir Acesso
        </button>

        <button 
          v-else
          class="btn btn-sm btn-dark w-100 fw-bold text-uppercase text-danger border-danger border-opacity-25 opacity-75"
          disabled
          title="Reativação requer suporte técnico"
        >
          <i class="bi bi-lock-fill me-2"></i> Acesso Bloqueado
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '@/types/user';

const props = defineProps<{ 
  user: User;
  loading?: boolean;
}>();

defineEmits(['ban']);

// Verifica se é admin ou o próprio usuário (lógica simplificada visual)
const isSelfOrAdmin = computed(() => {
  return props.user.role === 'ADMIN' || props.user.role === 'admin';
});

const getInitials = (name: string) => {
  return name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
};

const translateRole = (role: string) => {
  const map: Record<string, string> = {
    'admin': 'Admin', 'ADMIN': 'Admin',
    'researcher': 'Pesquisador', 'RESEARCHER': 'Pesquisador',
    'user': 'Visitante', 'USER': 'Visitante'
  };
  return map[role] || role;
};

const roleBadgeClass = computed(() => {
  const r = props.user.role?.toLowerCase();
  if (r === 'admin') return 'bg-warning text-dark border border-warning border-opacity-25';
  if (r === 'researcher') return 'bg-info text-dark border border-info border-opacity-25';
  return 'bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25';
});

const statusClasses = computed(() => {
  if (props.user.status) {
    return { avatarBg: 'bg-success bg-opacity-10 text-success border-success' };
  }
  return { avatarBg: 'bg-danger bg-opacity-10 text-danger border-danger' };
});
</script>

<style scoped>
.user-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.user-card:hover { transform: translateY(-4px); border-color: rgba(255, 255, 255, 0.15) !important; }

.avatar-box { width: 48px; height: 48px; font-size: 1.1rem; }
.status-dot { width: 8px; height: 8px; }
.shadow-glow { box-shadow: 0 0 8px currentColor; }

.hover-danger:hover { 
  background-color: rgba(220, 53, 69, 0.1); 
  color: #dc3545; 
  border-color: #dc3545; 
}
</style>