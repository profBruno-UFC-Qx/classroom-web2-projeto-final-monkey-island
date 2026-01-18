<template>
  <div class="page-container">
    <div class="container pt-5 pb-4">
      <div class="row align-items-end">
        <div class="col-md-8">
          <h1 class="display-4 fw-black text-uppercase text-light mb-0 tracking-tighter">
            Acervo de <span class="text-warning">Relíquias</span>
          </h1>
          <p class="text-secondary lead mt-2">
            Catalogação e gerenciamento de itens arqueológicos da ilha.
          </p>
        </div>
        <div class="col-md-4 text-md-end mt-4 mt-md-0">
          <button 
            @click="toggleForm" 
            class="btn btn-lg fw-bold text-uppercase shadow-lg d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto ms-auto"
            :class="showForm ? 'btn-outline-danger' : 'btn-warning'"
          >
            <i class="bi" :class="showForm ? 'bi-x-lg' : 'bi-plus-lg'"></i>
            {{ showForm ? 'Cancelar' : 'Nova Relíquia' }}
          </button>
        </div>
      </div>
      <hr class="border-secondary opacity-25 my-4">
    </div>

    <div v-if="successMessage" class="container mb-4 animate__animated animate__fadeInDown">
      <div class="alert alert-success d-flex align-items-center shadow-lg border-success" role="alert">
        <i class="bi bi-check-circle-fill fs-4 me-3"></i>
        <div>
          <strong>Sucesso!</strong> {{ successMessage }}
        </div>
        <button type="button" class="btn-close ms-auto" @click="successMessage = ''"></button>
      </div>
    </div>

    <div class="container pb-5">
      
      <transition name="slide-fade">
        <div v-if="showForm" class="mb-5">
          <div class="card bg-dark border-warning shadow-lg overflow-hidden">
            <div class="card-header bg-warning text-dark fw-bold text-uppercase py-3 d-flex align-items-center gap-2">
              <i class="bi bi-box-seam-fill"></i> Registro de Artefato
            </div>
            <div class="card-body p-4 bg-gradient-dark">
              <form @submit.prevent="createArtifact" class="row g-4">
                <div class="col-md-6">
                  <label class="form-label text-secondary small fw-bold text-uppercase">Nome do Artefato</label>
                  <div class="input-group">
                    <span class="input-group-text bg-black border-secondary text-warning"><i class="bi bi-tag-fill"></i></span>
                    <input 
                      v-model="newArtifact.name" 
                      type="text" 
                      class="form-control bg-black border-secondary text-light focus-warning" 
                      required 
                      placeholder="Ex: Âmbar Fossilizado" 
                    />
                  </div>
                </div>

                <div class="col-md-3">
                  <label class="form-label text-secondary small fw-bold text-uppercase">Raridade</label>
                  <div class="input-group">
                    <span class="input-group-text bg-black border-secondary text-warning"><i class="bi bi-stars"></i></span>
                    <select v-model="newArtifact.rarity" class="form-select bg-black border-secondary text-light focus-warning" required>
                      <option value="COMMON">Comum</option>
                      <option value="RARE">Raro</option>
                      <option value="LEGENDARY">Lendário</option>
                      <option value="MYTHIC">Mítico</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-3">
                  <label class="form-label text-secondary small fw-bold text-uppercase">Imagem</label>
                  <input 
                    type="file" 
                    @change="handleFileUpload" 
                    class="form-control bg-black border-secondary text-light focus-warning" 
                    accept="image/*"
                    required 
                  />
                </div>

                <div class="col-12 text-end border-top border-secondary pt-3 mt-2">
                  <button type="submit" class="btn btn-success fw-bold px-5 text-uppercase shadow" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-save-fill me-2"></i>
                    {{ isSubmitting ? 'Salvando...' : 'Salvar no Acervo' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>

      <div v-if="adminStore.loading" class="text-center py-5 my-5">
        <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status"></div>
        <p class="text-secondary mt-3 animate__animated animate__pulse animate__infinite">Acessando banco de dados...</p>
      </div>

      <div v-else class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
        <div v-for="artifact in adminStore.adminArtifacts" :key="artifact.id" class="col">
          <div class="card h-100 bg-dark border-secondary artifact-card shadow-sm">
            
            <div class="card-img-top bg-black bg-opacity-50 position-relative p-3 d-flex align-items-center justify-content-center" style="height: 180px;">
              <img 
                :src="resolveImageUrl(artifact.image)" 
                :alt="artifact.name" 
                class="img-fluid object-fit-contain drop-shadow artifact-img"
                @error="handleImageError"
              />
              <span 
                class="position-absolute top-0 end-0 m-2 badge rounded-pill shadow-sm text-uppercase fw-bold"
                :class="rarityBadgeClass(artifact.rarity)"
                style="font-size: 0.6rem; letter-spacing: 1px;"
              >
                {{ artifact.rarity }}
              </span>
            </div>

            <div class="card-body d-flex flex-column border-top border-secondary border-opacity-25">
              <h6 class="card-title text-light fw-bold mb-1 text-truncate" :title="artifact.name">
                {{ artifact.name }}
              </h6>
              <p class="card-text text-secondary small mb-3">
                ID: <span class="font-monospace text-muted">{{ artifact.id.slice(0, 6) }}...</span>
              </p>
              
              <button 
                @click="deleteArtifact(artifact.id)" 
                class="btn btn-sm btn-outline-danger mt-auto w-100 border-opacity-50 hover-danger"
                title="Excluir Permanentemente"
              >
                <i class="bi bi-trash-fill me-1"></i> Excluir
              </button>
            </div>
          </div>
        </div>

        <div v-if="adminStore.adminArtifacts.length === 0" class="col-12 text-center py-5">
          <div class="p-5 border border-secondary border-dashed rounded opacity-50">
            <i class="bi bi-box-seam fs-1 text-secondary"></i>
            <p class="text-secondary mt-3">O acervo está vazio no momento.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import { BASE_URL } from '@/api/api';

const adminStore = useAdminStore();
const showForm = ref(false);
const isSubmitting = ref(false);
const successMessage = ref('');
const file = ref<File | null>(null);
const newArtifact = ref({ name: '', rarity: 'COMMON' });

onMounted(() => {
  adminStore.fetchAdminArtifacts();
});

const toggleForm = () => {
  showForm.value = !showForm.value;
  successMessage.value = ''; // Limpa msg ao abrir/fechar
};

// Lógica Robusta de Imagem
const resolveImageUrl = (path: string | undefined) => {
  if (!path) return '/placeholder-artifact.png'; // Fallback
  
  // Se for URL externa completa
  if (path.startsWith('http')) return path;

  // Normaliza barras
  let cleanPath = path.replace(/\\/g, '/');
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);

  // Se o caminho NÃO começar com 'artifacts/', adicionamos (assumindo estrutura padrão public/artifacts)
  // Isso corrige o bug se o banco salva apenas "imagem.png"
  if (!cleanPath.includes('artifacts/')) {
    cleanPath = `artifacts/${cleanPath}`;
  }

  return `${BASE_URL}/${cleanPath}`;
};

const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = 'https://placehold.co/150x150/1a1a1a/ffb400?text=Sem+Imagem';
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
  }
};

const createArtifact = async () => {
  if (!file.value) {
    alert("Por favor, selecione uma imagem.");
    return;
  }
  
  isSubmitting.value = true;
  successMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('name', newArtifact.value.name);
    formData.append('rarity', newArtifact.value.rarity);
    formData.append('image', file.value);

    await adminStore.createArtifactAction(formData);
    
    // Sucesso
    successMessage.value = `O artefato "${newArtifact.value.name}" foi catalogado com sucesso!`;
    showForm.value = false;
    
    // Reset Form
    newArtifact.value = { name: '', rarity: 'COMMON' };
    file.value = null;

    // Auto-hide mensagem após 5s
    setTimeout(() => { successMessage.value = ''; }, 5000);

  } catch (error) {
    console.error(error);
    alert("Erro ao salvar artefato. Verifique o console.");
  } finally {
    isSubmitting.value = false;
  }
};

const deleteArtifact = async (id: string) => {
  if (confirm('ATENÇÃO: Esta ação removerá o artefato permanentemente do banco de dados. Continuar?')) {
    try {
      await adminStore.deleteArtifactAction(id);
    } catch (error) {
      alert("Erro ao excluir.");
    }
  }
};

const rarityBadgeClass = (rarity: string) => {
  const map: Record<string, string> = {
    'COMMON': 'bg-secondary text-light',
    'RARE': 'bg-primary text-light',
    'LEGENDARY': 'bg-warning text-dark',
    'MYTHIC': 'bg-danger text-light shadow-danger'
  };
  return map[rarity] || 'bg-secondary';
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #121212; /* Fundo bem escuro */
}

/* Typography */
.tracking-tighter {
  letter-spacing: -2px;
}
.fw-black {
  font-weight: 900;
  font-family: 'Segoe UI Black', 'Arial Black', sans-serif;
}

/* Card Styling */
.artifact-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #2c2c2c;
}
.artifact-card:hover {
  transform: translateY(-8px);
  border-color: #ffb400;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}
.artifact-card:hover .artifact-img {
  transform: scale(1.1);
}

.artifact-img {
  transition: transform 0.3s ease;
  max-height: 140px;
}

.drop-shadow {
  filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5));
}

.bg-gradient-dark {
  background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
}

/* Form Styling */
.focus-warning:focus {
  border-color: #ffb400 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 180, 0, 0.25);
  outline: none;
}

/* Animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.shadow-danger {
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.6);
}
</style>