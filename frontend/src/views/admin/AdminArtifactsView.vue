<template>
  <div class="page-container">
    <div class="container pt-5 pb-4">
      
      <div class="row mb-5 align-items-end">
        <div class="col-md-8">
          <h6 class="text-warning text-uppercase fw-bold mb-2 tracking-wide small">
            <i class="bi bi-database-fill me-1"></i> Gestão de Recursos
          </h6>
          <h1 class="display-5 fw-black text-light mb-0 tracking-tighter">
            Acervo de <span class="text-warning position-relative">Relíquias
              <svg class="position-absolute w-100 bottom-0 start-0" height="8" style="opacity: 0.3; transform: translateY(4px);">
                <path d="M0 4 Q 50 8 100 4" stroke="#ffc107" stroke-width="4" fill="none" />
              </svg>
            </span>
          </h1>
          <p class="text-secondary lead mt-3 mb-0" style="max-width: 600px;">
            Gerenciamento, catalogação e restauração de itens arqueológicos do sistema.
          </p>
        </div>
        
        <div class="col-md-4 text-md-end mt-4 mt-md-0">
          <button 
            @click="showForm = !showForm" 
            class="btn btn-lg fw-bold text-uppercase shadow-lg d-flex align-items-center justify-content-center gap-2 w-100 transition-all"
            :class="showForm ? 'btn-outline-danger' : 'btn-warning text-dark'"
          >
            <i class="bi" :class="showForm ? 'bi-x-lg' : 'bi-plus-lg'"></i>
            {{ showForm ? 'Cancelar' : 'Nova Relíquia' }}
          </button>
        </div>
      </div>

      <hr class="border-secondary opacity-25 mb-5">

      <transition name="slide-fade">
        <div v-if="successMsg" class="alert alert-success d-flex align-items-center shadow-lg border-success bg-dark text-success mb-4">
          <i class="bi bi-check-circle-fill fs-4 me-3"></i>
          <div>
            <strong class="d-block text-uppercase small">Sucesso</strong>
            <span>{{ successMsg }}</span>
          </div>
        </div>
      </transition>

      <div class="pb-5">
        
        <transition name="slide-fade">
          <div v-if="showForm" class="mb-5">
            <AdminArtifactForm 
              :loading="artifactStore.isLoading"
              @submit="handleCreate"
            />
          </div>
        </transition>

        <div v-if="artifactStore.isLoading && !showForm" class="text-center py-5 my-5">
          <div class="spinner-border text-warning mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
          <p class="text-secondary text-uppercase small fw-bold tracking-wide blink">Carregando acervo...</p>
        </div>

        <div v-else-if="artifactStore.artifacts.length === 0 && !showForm" class="text-center py-5 opacity-50">
          <div class="mb-3 p-4 rounded-circle bg-dark d-inline-flex align-items-center justify-content-center border border-secondary border-opacity-25 border-dashed" style="width: 100px; height: 100px;">
            <i class="bi bi-box-seam fs-1 text-secondary"></i>
          </div>
          <h5 class="text-secondary mt-3 fw-bold">O acervo está vazio</h5>
          <p class="text-muted small">Adicione novas relíquias para começar.</p>
        </div>

        <div v-else class="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-4">
          <TransitionGroup name="list">
            <div v-for="item in artifactStore.artifacts" :key="item.id" class="col">
              <AdminArtifactCard 
                :artifact="item" 
                @delete="handleDelete"
              />
            </div>
          </TransitionGroup>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArtifactStore } from '@/stores/artifactStore';
import AdminArtifactForm from '@/components/admin/AdminArtifactForm.vue';
import AdminArtifactCard from '@/components/admin/AdminArtifactCard.vue';

const artifactStore = useArtifactStore();
const showForm = ref(false);
const successMsg = ref('');

onMounted(() => {
  artifactStore.fetchArtifacts();
});

const handleCreate = async (formData: FormData) => {
  try {
    await artifactStore.createArtifact(formData);
    successMsg.value = 'Artefato adicionado ao acervo.';
    showForm.value = false;
    
    // Auto-scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => successMsg.value = '', 4000);
  } catch (error) {
    alert('Erro ao criar artefato. Verifique os dados e tente novamente.');
  }
};

const handleDelete = async (id: string) => {
  if (confirm('ATENÇÃO: A exclusão é permanente. Deseja remover esta relíquia do acervo?')) {
    await artifactStore.deleteArtifact(id);
  }
};
</script>

<style scoped>
.page-container { min-height: 100vh; background-color: #121212; }
.tracking-tighter { letter-spacing: -2px; }
.tracking-wide { letter-spacing: 2px; }
.fw-black { font-weight: 900; }
.blink { animation: blink 2s infinite ease-in-out; }

@keyframes blink { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

/* Animações de Entrada/Saída */
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-20px); opacity: 0; }

.list-move, .list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.9); }
.list-leave-active { position: absolute; width: 100%; z-index: -1; }

.transition-all { transition: all 0.3s ease; }
</style>