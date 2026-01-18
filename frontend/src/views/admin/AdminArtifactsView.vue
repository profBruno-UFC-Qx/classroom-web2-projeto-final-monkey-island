<template>
  <div class="page-container">
    <div class="container pt-5 pb-4">
      <div class="row align-items-end">
        <div class="col-md-8">
          <h1 class="display-4 fw-black text-uppercase text-light mb-0 tracking-tighter">
            Acervo de <span class="text-warning">Relíquias</span>
          </h1>
          <p class="text-secondary lead mt-2">Gerenciamento de itens arqueológicos.</p>
        </div>
        <div class="col-md-4 text-md-end">
          <button 
            @click="showForm = !showForm" 
            class="btn btn-lg fw-bold text-uppercase shadow-lg d-flex align-items-center justify-content-center gap-2 w-100"
            :class="showForm ? 'btn-outline-danger' : 'btn-warning'"
          >
            <i class="bi" :class="showForm ? 'bi-x-lg' : 'bi-plus-lg'"></i>
            {{ showForm ? 'Cancelar' : 'Nova Relíquia' }}
          </button>
        </div>
      </div>
      <hr class="border-secondary opacity-25 my-4">
    </div>

    <div v-if="successMsg" class="container mb-4">
      <div class="alert alert-success d-flex align-items-center shadow-lg border-success">
        <i class="bi bi-check-circle-fill fs-4 me-3"></i>
        <strong>{{ successMsg }}</strong>
      </div>
    </div>

    <div class="container pb-5">
      <transition name="slide-fade">
        <AdminArtifactForm 
          v-if="showForm" 
          :loading="artifactStore.isLoading"
          @submit="handleCreate"
        />
      </transition>

      <div v-if="artifactStore.isLoading && !showForm" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
      </div>

      <div v-else class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
        <div v-for="item in artifactStore.artifacts" :key="item.id" class="col">
          <AdminArtifactCard 
            :artifact="item" 
            @delete="handleDelete"
          />
        </div>
        
        <div v-if="artifactStore.artifacts.length === 0" class="col-12 text-center py-5">
          <p class="text-secondary">O acervo está vazio.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArtifactStore } from '@/stores/artifactStore'; // Note: usando artifactStore, não adminStore
import AdminArtifactForm from '@/components/admin/AdminArtifactForm.vue'; // Ajuste o path conforme onde salvar
import AdminArtifactCard from '@/components/admin/AdminArtifactCard.vue';

const artifactStore = useArtifactStore();
const showForm = ref(false);
const successMsg = ref('');

onMounted(() => {
  // Chamada correta para buscar dados ao iniciar
  artifactStore.fetchArtifacts();
});

const handleCreate = async (formData: FormData) => {
  try {
    await artifactStore.createArtifact(formData);
    successMsg.value = 'Artefato criado com sucesso!';
    showForm.value = false;
    setTimeout(() => successMsg.value = '', 3000);
  } catch (error) {
    alert('Erro ao criar artefato.');
  }
};

const handleDelete = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir este artefato?')) {
    await artifactStore.deleteArtifact(id);
  }
};
</script>

<style scoped>
/* Mantenha apenas o CSS global da página aqui */
.page-container { min-height: 100vh; background-color: #121212; }
.tracking-tighter { letter-spacing: -2px; }
.fw-black { font-weight: 900; }
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease-out; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-20px); opacity: 0; }
</style>