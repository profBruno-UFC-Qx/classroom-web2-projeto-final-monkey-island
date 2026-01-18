<template>
  <div class="card bg-dark border-warning shadow-lg overflow-hidden mb-5">
    <div class="card-header bg-warning text-dark fw-bold text-uppercase py-3 d-flex align-items-center gap-2">
      <i class="bi bi-box-seam-fill"></i> Nova Relíquia
    </div>
    <div class="card-body p-4 bg-gradient-dark">
      <form @submit.prevent="handleSubmit" class="row g-4">
        <div class="col-md-6">
          <label class="form-label text-secondary small fw-bold text-uppercase">Nome</label>
          <input v-model="form.name" type="text" class="form-control bg-black border-secondary text-light focus-warning" required />
        </div>

        <div class="col-md-3">
          <label class="form-label text-secondary small fw-bold text-uppercase">Raridade</label>
          <select v-model="form.rarity" class="form-select bg-black border-secondary text-light focus-warning" required>
            <option value="fragment">Fragmento</option>
            <option value="partial_fossil">Fóssil Parcial</option>
            <option value="rare">Raro</option>
            <option value="exceptional_specimen">Espécime Excepcional</option>
            <option value="unique_specimen">Espécime Único</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label text-secondary small fw-bold text-uppercase">Imagem</label>
          <input type="file" @change="onFileChange" class="form-control bg-black border-secondary text-light focus-warning" accept="image/*" required />
        </div>

        <div class="col-12">
           <label class="form-label text-secondary small fw-bold text-uppercase">Descrição</label>
           <textarea v-model="form.description" class="form-control bg-black border-secondary text-light focus-warning" rows="2"></textarea>
        </div>

        <div class="col-12 text-end pt-3">
          <button type="submit" class="btn btn-warning fw-bold px-5 text-uppercase" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Salvando...' : 'Salvar Relíquia' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ loading: boolean }>();
const emit = defineEmits(['submit']);

// Estado inicial correspondente ao 'fragment'
const form = ref({ 
  name: '', 
  rarity: 'fragment', 
  description: '' 
});
const file = ref<File | null>(null);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) file.value = target.files[0];
};

const handleSubmit = () => {
  if (!file.value) return alert('A imagem é obrigatória!');
  
  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('rarity', form.value.rarity);
  formData.append('description', form.value.description); // Adicionado description
  formData.append('image', file.value); // O backend espera 'image' no multer
  
  emit('submit', formData);
  
  // Reset básico
  form.value.name = '';
  form.value.description = '';
  file.value = null;
};
</script>