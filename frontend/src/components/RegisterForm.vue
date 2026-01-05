<template>
  <div class="fossil-card card shadow-lg border-0 overflow-hidden">
    <div class="row g-0">
      
      <div class="col-md-5 bg-dark p-4 p-lg-5 d-flex flex-column justify-content-center border-end border-secondary">
        <div class="text-center mb-4">
          <i class="bi bi-person-vcard-fill text-warning display-1"></i>
        </div>
        <h4 class="text-warning fw-black text-uppercase text-center mb-3">
          Novos Pesquisadores
        </h4>
        <p class="text-secondary small text-center mb-4">
          O acesso ao <strong>The Lost World</strong> requer credenciamento aprovado. 
          Preencha seus dados acadêmicos e pessoais para gerar sua identificação.
        </p>
        
        <div class="alert alert-dark border border-warning d-flex align-items-start gap-2 rounded-0">
          <i class="bi bi-info-circle-fill text-warning mt-1"></i>
          <span class="x-small text-light">
            Sua afiliação (Instituição) será exibida no ranking de colaboradores.
          </span>
        </div>
      </div>

      <div class="col-md-7 bg-light-industrial p-4 p-lg-5">
        <h3 class="fw-black text-uppercase mb-4 text-dark-green">
          <i class="bi bi-pencil-square me-2"></i>Ficha de Inscrição
        </h3>

        <form @submit.prevent="handleRegister">
          
          <div class="mb-3">
            <label class="form-label text-dark-green x-small fw-bold">NOME COMPLETO</label>
            <input type="text" class="form-control" v-model="form.name" required placeholder="Dr. Alan Grant">
          </div>

          <div class="mb-3">
            <label class="form-label text-dark-green x-small fw-bold">EMAIL INSTITUCIONAL</label>
            <input type="email" class="form-control" v-model="form.email" required placeholder="email@universidade.edu">
          </div>

          <div class="mb-3">
            <label class="form-label text-dark-green x-small fw-bold">INSTITUIÇÃO / AFILIAÇÃO</label>
            <div class="input-group">
              <span class="input-group-text bg-dark text-warning border-0"><i class="bi bi-building"></i></span>
              <input type="text" class="form-control" v-model="form.institution" required placeholder="Ex: Universidade Federal...">
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label text-dark-green x-small fw-bold">BREVE BIOGRAFIA (OPCIONAL)</label>
            <textarea class="form-control" v-model="form.bio" rows="2" placeholder="Sua área de estudo..."></textarea>
          </div>

          <div class="mb-4">
            <label class="form-label text-dark-green x-small fw-bold">DEFINIR CÓDIGO DE ACESSO</label>
            <input type="password" class="form-control" v-model="form.password" required>
          </div>

          <button type="submit" class="btn btn-dark w-100 py-3 fw-black text-uppercase shadow-sm border-warning" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <span v-else>Emitir Credencial <i class="bi bi-check-lg ms-2 text-warning"></i></span>
          </button>
        </form>

        <div v-if="errorMessage" class="alert alert-danger mt-3 py-2 border-0 small text-center fw-bold">
          {{ errorMessage }}
        </div>
        
        <div v-if="successMessage" class="alert alert-success mt-3 py-2 border-0 small text-center fw-bold">
          {{ successMessage }}
        </div>

        <div class="text-center mt-4 pt-3 border-top border-secondary-subtle">
          <span class="small text-muted me-2">Já possui credencial?</span>
          <router-link to="/login" class="text-dark-green fw-bold text-decoration-none">
            ACESSAR TERMINAL
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
import type { RegisterCredentials } from '../types/auth';

const router = useRouter();
const authStore = useAuthStore();

// Estado do formulário combinando com os campos do Backend (User.ts)
const form = reactive<RegisterCredentials>({
  name: '',
  email: '',
  password: '',
  institution: '',
  bio: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authStore.register(form);
    
    // Sucesso visual antes de redirecionar
    successMessage.value = 'Cadastro realizado com sucesso! Redirecionando para login...';
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error: any) {
    // O backend retorna msg: "user already exists!" em caso de duplicata
    errorMessage.value = error.response?.data?.message || 'Erro ao processar cadastro.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fossil-card {
  border-radius: 4px;
  /* Borda amarela na esquerda dessa vez */
  border-left: 5px solid #ffb400 !important; 
}

.bg-light-industrial {
  background-color: #e8e2d9; /* Cor de osso/fóssil */
}

.text-dark-green {
  color: #1a2f2b;
}

.x-small { font-size: 0.7rem; letter-spacing: 1px; }

.form-control {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  transition: all 0.3s;
}

.form-control:focus {
  background-color: #fff;
  border-color: #1a2f2b;
  box-shadow: 0 0 0 0.2rem rgba(26, 47, 43, 0.25);
}

.fw-black { font-weight: 900; }

.border-warning {
    border-color: #ffb400 !important;
}
</style>