<template>
  <div class="card bg-dark border-warning shadow-lg overflow-hidden mb-5">
    <div class="card-header bg-warning text-dark fw-bold text-uppercase py-3 d-flex align-items-center gap-2">
      <i class="bi bi-box-seam-fill"></i> Registro de Artefato
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
            <option value="COMMON">Comum</option>
            <option value="RARE">Raro</option>
            <option value="LEGENDARY">Lendário</option>
            <option value="MYTHIC">Mítico</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label text-secondary small fw-bold text-uppercase">Imagem</label>
          <input type="file" @change="onFileChange" class="form-control bg-black border-secondary text-light focus-warning" accept="image/*" required />
        </div>

        <div class="col-12 text-end pt-3">
          <button type="submit" class="btn btn-success fw-bold px-5 text-uppercase" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ loading: boolean }>();
const emit = defineEmits(['submit']);

const form = ref({ name: '', rarity: 'COMMON' });
const file = ref<File | null>(null);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) file.value = target.files[0];
};

const handleSubmit = () => {
  if (!file.value) return alert('Selecione uma imagem');
  
  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('rarity', form.value.rarity);
  formData.append('image', file.value);
  
  emit('submit', formData);
  
  // Limpar form após submit (opcional, pode ser controlado pelo pai)
  form.value.name = '';
  file.value = null;
};
</script>