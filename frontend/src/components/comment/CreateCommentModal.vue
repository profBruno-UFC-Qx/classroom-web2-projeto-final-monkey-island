<template>
  <div v-if="commentStore.isModalOpen" class="modal-backdrop show"></div>
  <div 
    class="modal fade" 
    :class="{ 'show d-block': commentStore.isModalOpen }" 
    tabindex="-1" 
    role="dialog"
    @click.self="commentStore.closeCommentModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg post-card overflow-hidden">
        <div class="classification-strip top-strip"></div>
        
        <div class="modal-header bg-light-industrial border-bottom border-warning">
          <h5 class="modal-title fw-black text-uppercase text-dark-jungle">
            <i class="bi bi-journal-text me-2"></i>
            {{ commentStore.targetParentId ? 'Adicionar Resposta' : 'Novo Registro' }}
          </h5>
          <button type="button" class="btn-close" @click="commentStore.closeCommentModal"></button>
        </div>

        <div class="modal-body bg-light">
          <div class="mb-3">
            <label class="form-label text-muted x-small fw-bold text-uppercase">Conteúdo do Relatório</label>
            <textarea 
              v-model="content" 
              class="form-control bg-white border-secondary-subtle" 
              rows="4" 
              placeholder="Digite sua observação aqui..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer bg-light-industrial border-top border-secondary-subtle">
          <button type="button" class="btn btn-outline-secondary btn-sm text-uppercase fw-bold" @click="commentStore.closeCommentModal">Cancel</button>
          <button 
            type="button" 
            class="btn btn-warning btn-sm text-uppercase fw-bold text-dark-jungle" 
            @click="handleSubmit"
            :disabled="!content.trim() || isSubmitting"
          >
            <i class="bi bi-send-fill me-1"></i> Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCommentStore } from '../../stores/commentStore';

const commentStore = useCommentStore();
const content = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (!content.value.trim()) return;
  isSubmitting.value = true;
  try {
    await commentStore.addComment(content.value);
    content.value = ''; // Limpa o campo
  } catch (e) {
    alert("Erro ao enviar comentário");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Reutilizando estilos do PostCard para consistência */
.bg-light-industrial { background-color: #f4f4f4; }
.text-dark-jungle { color: #1a2f2b; }
.fw-black { font-weight: 900; }
.classification-strip { height: 5px; background: repeating-linear-gradient(45deg, #1a2f2b, #1a2f2b 10px, #ffc107 10px, #ffc107 20px); width: 100%; }
.x-small { font-size: 0.7rem; }
</style>