<template>
  <div v-if="canCreatePost" class="card fossil-card mb-5 p-0 bg-white border-0 shadow-sm position-relative overflow-hidden">
    <div class="top-folder-tab bg-warning px-3 py-1 d-inline-block fw-bold small text-dark border-top border-start border-end border-dark">
      NOVO REGISTRO
    </div>
    <div class="card-body p-4 border border-dark bg-light-industrial">
      <h5 class="fw-black text-uppercase mb-3 text-dark-jungle">
        <i class="bi bi-file-earmark-medical-fill text-danger me-2"></i>Catalogar Descoberta
      </h5>
      <p class="text-secondary small font-monospace mb-3">
        > Insira os dados da observação para o banco de dados central...
      </p>
      <button class="btn btn-dark w-100 py-2 fw-black text-uppercase border-warning btn-terminal" @click="$emit('open-create')">
        <i class="bi bi-upload me-2 text-warning"></i>Enviar Dados
      </button>
    </div>
  </div>

  <div v-else-if="!isAuthenticated" class="card fossil-card mb-5 bg-danger-subtle border-danger border-2 shadow-sm">
    <div class="card-body p-4 d-flex align-items-center gap-4">
      <div class="bg-danger text-white p-3 rounded-1 d-flex align-items-center justify-content-center shadow border border-white" style="width: 64px; height: 64px">
        <i class="bi bi-hand-index-thumb-fill fs-2"></i>
      </div>
      <div>
        <h5 class="fw-black text-danger text-uppercase m-0 mb-1">Acesso Negado</h5>
        <p class="small text-dark fw-bold m-0 mb-3 opacity-75 font-monospace">
          "ERR_AUTH_FAIL: Credenciais de nível 1 necessárias."<br />
          Identifique-se no terminal de segurança.
        </p>
        <router-link to="/login" class="btn btn-sm btn-dark text-warning fw-bold text-uppercase px-4 rounded-0 shadow">
          <i class="bi bi-shield-lock me-2"></i>Inserir Senha
        </router-link>
      </div>
    </div>
  </div>

  <div v-else class="card fossil-card mb-5 bg-secondary-subtle border-secondary border-2 shadow-sm">
    <div class="card-body p-3 d-flex align-items-center gap-3">
      <i class="bi bi-eye-slash-fill fs-3 text-secondary"></i>
      <div>
        <h6 class="fw-bold text-dark text-uppercase m-0">Modo Observador</h6>
        <small class="text-muted font-monospace">Você não possui credenciais de pesquisador para catalogar novas descobertas.</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();

// Computed para facilitar a leitura no template
const isAuthenticated = computed(() => authStore.isAuthenticated);
const canCreatePost = computed(() => authStore.isAuthenticated && authStore.user?.role === "researcher");

// Emite evento quando clica em criar
defineEmits(['open-create']);
</script>

<style scoped>
/* Copiar estilos relevantes (btn-terminal, fossil-card, etc) */
.fossil-card { border-radius: 2px; }
.bg-light-industrial { background-color: #f0f0f0; }
.text-dark-jungle { color: #1a2f2b; }
.fw-black { font-weight: 900; }
.btn-terminal { transition: all 0.3s; }
.btn-terminal:hover { background-color: #1a1a1a; border-color: #ffc107; color: #ffc107; box-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
</style>