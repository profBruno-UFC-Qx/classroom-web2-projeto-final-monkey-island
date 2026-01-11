<template>
  <div class="modal fade" id="researcherRequestModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark border-2 border-primary shadow-lg">
        
        <div class="modal-header bg-black border-bottom border-primary">
          <h5 class="modal-title fw-black text-uppercase text-light tracking-wide">
            <i class="bi bi-file-earmark-person-fill text-primary me-2"></i> Credencial de Pesquisador
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body bg-concrete p-4">
          <p class="text-light small mb-3">
            Para acessar o laboratório e criar comunidades, você precisa de aprovação administrativa. Por favor, descreva sua motivação acadêmica ou profissional.
          </p>
          
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label text-primary x-small fw-bold">MOTIVAÇÃO DO PEDIDO</label>
              <textarea 
                v-model="motivation" 
                class="form-control bg-dark text-white border-secondary" 
                rows="4" 
                required
                placeholder="Ex: Sou paleontólogo especializado em..."
              ></textarea>
            </div>

            <div v-if="errorMessage" class="alert alert-danger small py-2">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success small py-2">{{ successMessage }}</div>

            <div class="d-grid">
              <button type="submit" class="btn btn-primary fw-bold text-uppercase" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <span v-else>Enviar Solicitação</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as bootstrap from 'bootstrap';
import researcherRequestService from '../../services/researcherRequestService';

const motivation = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const open = () => {
  motivation.value = '';
  errorMessage.value = '';
  successMessage.value = '';
  const modalEl = document.getElementById('researcherRequestModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
};

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await researcherRequestService.createRequest(motivation.value);
    successMessage.value = 'Solicitação enviada com sucesso! Aguarde aprovação.';
    setTimeout(() => {
      const modalEl = document.getElementById('researcherRequestModal');
      const modal = bootstrap.Modal.getInstance(modalEl!);
      modal?.hide();
    }, 2000);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Falha ao enviar solicitação.';
  } finally {
    loading.value = false;
  }
};

defineExpose({ open });
</script>

<style scoped>
.bg-concrete { 
  background-color: #1a1a1a;
  background-image: radial-gradient(#2c3e50 1px, transparent 1px);
  background-size: 10px 10px;
}
.fw-black { font-weight: 900; }
.x-small { font-size: 0.7rem; letter-spacing: 1px; }
.text-primary { color: #0d6efd !important; }
.border-primary { border-color: #0d6efd !important; }
.btn-primary { 
  background-color: #0d6efd; 
  border-color: #0d6efd;
}
</style>