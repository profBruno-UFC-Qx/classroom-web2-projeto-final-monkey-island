<template>
  <div class="fossil-card card shadow-lg border-0 overflow-hidden">
    <div class="row g-0">
      <div class="col-md-4 bg-warning d-none d-md-flex align-items-center justify-content-center flex-column text-dark p-4">
        <i class="bi bi-exclamation-triangle-fill fs-1 mb-2"></i>
        <h5 class="fw-black text-center text-uppercase">Área Restrita</h5>
        <p class="small text-center fw-bold opacity-75">Acesso exclusivo para pessoal autorizado e entusiastas credenciados.</p>
      </div>

      <div class="col-md-8 bg-dark p-4 p-lg-5">
        <div class="mb-4">
          <h3 class="text-warning fw-black text-uppercase mb-1">Acesso ao Sistema</h3>
          <p class="text-secondary small">Insira suas credenciais para acessar o banco de dados paleontológico.</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label text-warning x-small fw-bold">IDENTIFICAÇÃO (EMAIL)</label>
            <div class="input-group">
              <span class="input-group-text bg-secondary border-0 text-white"><i class="bi bi-envelope"></i></span>
              <input 
                type="email" 
                class="form-control bg-dark text-white border-secondary" 
                v-model="credentials.email" 
                required
                placeholder="exemplo@lostworld.com"
              >
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label text-warning x-small fw-bold">CÓDIGO DE ACESSO (SENHA)</label>
            <div class="input-group">
              <span class="input-group-text bg-secondary border-0 text-white"><i class="bi bi-key"></i></span>
              <input 
                type="password" 
                class="form-control bg-dark text-white border-secondary" 
                v-model="credentials.password" 
                required
              >
            </div>
          </div>

          <button type="submit" class="btn btn-warning w-100 py-3 fw-black text-uppercase shadow" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <span v-else>Iniciar Sessão <i class="bi bi-chevron-right ms-2"></i></span>
          </button>
        </form>

        <div v-if="errorMessage" class="alert alert-danger mt-3 py-2 border-0 bg-danger text-white small text-center fw-bold">
          <i class="bi bi-shield-lock-fill me-2"></i> {{ errorMessage }}
        </div>

        <div class="text-center mt-4 border-top border-secondary pt-3">
          <router-link to="/register" class="text-warning text-decoration-none small fw-bold">
            SOLICITAR NOVO ACESSO (REGISTRO)
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import type { LoginCredentials } from '../types/auth';

// Inicialização das ferramentas
const router = useRouter();
const authStore = useAuthStore();

// Estado Reativo (Essencial para o v-model funcionar)
const credentials = reactive<LoginCredentials>({
  email: '',
  password: ''
});

// Variáveis de Controle de UI
const isLoading = ref(false);
const errorMessage = ref('');

// Função de Login
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const success = await authStore.login(credentials);
    if (success) {
      // Redireciona para a home após o sucesso
      router.push('/home'); 
    }
  } catch (error: any) {
    // Captura a mensagem de erro vinda do backend ou define uma padrão
    errorMessage.value = error.response?.data?.message || 'Falha na autenticação. Verifique suas credenciais.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Estilos mantidos para o design Jurassic */
.fossil-card {
  border-radius: 4px;
  border-right: 4px solid #ffb400 !important;
}

.x-small { font-size: 0.7rem; letter-spacing: 1px; }

.form-control {
  transition: all 0.3s ease;
}

.form-control:focus {
  background-color: #222 !important;
  border-color: #ffb400;
  box-shadow: none;
  color: white;
}

.bg-secondary {
  background-color: #343a40 !important;
}

.fw-black { font-weight: 900; }
</style>