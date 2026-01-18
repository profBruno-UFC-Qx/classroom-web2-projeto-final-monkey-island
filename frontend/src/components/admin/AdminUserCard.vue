<template>
  <div class="card bg-dark border-secondary shadow-sm h-100 user-card">
    <div class="card-body p-4 d-flex flex-column">
      
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="d-flex align-items-center gap-3">
          <div 
            class="avatar-box rounded-circle d-flex align-items-center justify-content-center border"
            :class="statusColorClass"
          >
            {{ getInitials(user.name) }}
          </div>
          
          <div class="overflow-hidden">
            <h6 class="text-white fw-bold mb-0 text-truncate" :title="user.name">
              {{ user.name }}
            </h6>
            <span class="badge rounded-pill mt-1 border" :class="roleConfig.class">
              {{ roleConfig.label }}
            </span>
          </div>
        </div>

        <div 
          class="rounded-circle status-dot"
          :class="user.status ? 'bg-success shadow-success' : 'bg-danger shadow-danger'"
          :title="user.status ? 'Ativo' : 'Suspenso'"
        ></div>
      </div>

      <div class="d-flex flex-column gap-2 text-secondary small mb-4">
        <div class="d-flex align-items-center gap-2 text-truncate">
          <i class="bi bi-envelope"></i>
          <span>{{ user.email }}</span>
        </div>
        <div class="d-flex align-items-center gap-2 text-truncate">
          <i class="bi bi-building"></i>
          <span>{{ user.institution || 'Sem instituição' }}</span>
        </div>
      </div>

      <div class="mt-auto">
        <button 
          v-if="user.status"
          @click="$emit('ban', user.id)" 
          class="btn btn-sm btn-outline-danger w-100 fw-bold text-uppercase"
          :disabled="isAdmin"
          :title="isAdmin ? 'Não é possível banir administradores' : 'Banir usuário'"
        >
          <i class="bi bi-slash-circle me-2"></i> Banir Acesso
        </button>

        <div v-else class="alert alert-danger py-2 mb-0 text-center small fw-bold border-danger">
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

// Configuração visual baseada no Role
const ROLE_MAP: Record<string, { label: string; class: string }> = {
  admin: { label: 'Admin', class: 'bg-warning text-dark border-warning' },
  researcher: { label: 'Pesquisador', class: 'bg-info text-dark border-info' },
  user: { label: 'Visitante', class: 'bg-secondary text-light border-secondary' }
};

// Computed Helpers
const roleConfig = computed(() => {
  const roleKey = props.user.role?.toLowerCase() || 'user';
  return ROLE_MAP[roleKey] || ROLE_MAP.user;
});

const isAdmin = computed(() => props.user.role?.toUpperCase() === 'ADMIN');

const statusColorClass = computed(() => {
  return props.user.status 
    ? 'bg-success bg-opacity-10 text-success border-success' 
    : 'bg-danger bg-opacity-10 text-danger border-danger';
});

// Utilitário simples de formatação
const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
};
</script>

<style scoped>
.user-card {
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.user-card:hover {
  transform: translateY(-4px);
  border-color: #6c757d !important; /* Secondary border on hover */
}

.avatar-box {
  width: 48px;
  height: 48px;
  font-weight: bold;
  font-size: 1.1rem;
}

.status-dot {
  width: 10px;
  height: 10px;
}

.shadow-success { box-shadow: 0 0 6px rgba(25, 135, 84, 0.6); }
.shadow-danger { box-shadow: 0 0 6px rgba(220, 53, 69, 0.6); }
</style>