<template>
  <div class="card fossil-card shadow-lg border-0 overflow-hidden mb-4">
    <div class="card-header bg-dark text-white p-4 border-bottom border-warning border-3 position-relative overflow-hidden">
      <div class="watermark-logo"><i class="bi bi-fingerprint"></i></div>
      
      <div class="position-absolute top-0 end-0 p-3 z-2">
        <button 
          v-if="user.role === 'user'"
          @click="$emit('requestResearcher')"
          class="btn btn-sm btn-outline-primary fw-bold text-uppercase shadow-sm d-flex align-items-center gap-2"
          title="Solicitar acesso de Pesquisador"
        >
          <i class="bi bi-person-up"></i>
          <span class="d-none d-md-inline">Virar Pesquisador</span>
        </button>

        <button 
          v-else-if="user.role === 'admin'"
          @click="$emit('openAdminRequests')"
          class="btn btn-sm btn-danger fw-bold text-uppercase shadow-sm d-flex align-items-center gap-2 border-white"
        >
          <i class="bi bi-shield-lock-fill"></i>
          <span>Gerenciar Pedidos</span>
        </button>
      </div>

      <div class="d-flex align-items-center gap-4 position-relative z-1">
        <div class="avatar-box bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center shadow border border-white border-2">
          <i class="bi bi-person-fill display-4"></i>
        </div>
        
        <div>
          <h2 class="fw-black text-uppercase m-0 tracking-wide">{{ user.name }}</h2>
          <div class="d-flex align-items-center gap-2 mt-1">
            <span class="badge bg-secondary text-uppercase x-small">
              <i class="bi bi-pass-fill me-1"></i> 
              {{ user.role === 'admin' ? 'Administrador' : (user.role === 'researcher' ? 'Pesquisador' : 'Visitante') }}
            </span>
            <span class="text-white-50 small font-monospace">ID: {{ user.id.slice(0,8).toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body p-4 bg-light-industrial">
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <label class="text-muted x-small fw-bold text-uppercase">Instituição / Afiliação</label>
          <div class="d-flex align-items-center gap-2 mt-1">
            <i class="bi bi-building-fill text-warning fs-5"></i>
            <span class="fw-bold text-dark-jungle">
              {{ user.institution || 'Autônomo (Sem afiliação)' }}
            </span>
          </div>
        </div>
        
        <div class="col-md-6">
          <label class="text-muted x-small fw-bold text-uppercase">Status da Credencial</label>
          <div class="d-flex align-items-center gap-2 mt-1">
            <i :class="statusIcon" class="fs-5"></i>
            <span class="fw-bold text-dark-jungle text-uppercase">{{ user.status }}</span>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <label class="text-muted x-small fw-bold text-uppercase mb-2">Dados Biográficos</label>
        <div class="p-3 bg-white border border-secondary-subtle rounded-1 fst-italic text-secondary">
          "{{ user.bio || 'Nenhum registro biográfico encontrado no sistema.' }}"
        </div>
      </div>

      <div class="d-flex flex-column gap-2">
        <button 
          @click="$emit('openVault')" 
          class="btn btn-dark w-100 py-3 fw-black text-uppercase border-warning btn-relics shadow-sm"
        >
          <i class="bi bi-box-seam-fill me-2 text-warning"></i> Acessar Cofre de Relíquias
        </button>

        <button 
          @click="$emit('openCommunities')" 
          class="btn btn-dark w-100 py-3 fw-black text-uppercase border-info btn-communities shadow-sm"
        >
          <i class="bi bi-hdd-network-fill me-2 text-info"></i> Meus Setores e Comunidades
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '../../types/user';

const props = defineProps<{
  user: User
}>();

defineEmits([
  'openVault', 
  'openCommunities', 
  'requestResearcher', 
  'openAdminRequests'
]);

const statusIcon = computed(() => {
  return props.user.status === 'active' 
    ? 'bi bi-check-circle-fill text-success' 
    : 'bi bi-dash-circle-fill text-danger';
});
</script>

<style scoped>
.bg-light-industrial { background-color: #e8e2d9; }
.text-dark-jungle { color: #1a2f2b; }
.fw-black { font-weight: 900; }
.x-small { font-size: 0.7rem; letter-spacing: 1px; }
.tracking-wide { letter-spacing: 1px; }

.fossil-card {
  border-left: 6px solid #ffb400 !important; 
}

.avatar-box {
  width: 100px;
  height: 100px;
}

.watermark-logo {
  position: absolute;
  right: -20px;
  top: -30px;
  font-size: 10rem;
  opacity: 0.05;
  transform: rotate(-15deg);
  color: white;
  pointer-events: none;
}

.btn-relics:hover {
  background-color: #1a1a1a;
  border-color: #fff;
  transform: translateY(-2px);
  transition: all 0.2s;
}

.btn-communities:hover {
  background-color: #1a1a1a;
  border-color: #0dcaf0;
  color: #0dcaf0;
  transform: translateY(-2px);
  transition: all 0.2s;
}
</style>