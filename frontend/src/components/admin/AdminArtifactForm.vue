<template>
  <div class="card bg-dark border-secondary shadow-sm">
    <div class="card-header border-secondary bg-black py-3">
      <h6 class="mb-0 text-white text-uppercase fw-bold">
        <i class="bi bi-box-seam me-2 text-warning"></i>Nova Relíquia
      </h6>
    </div>
    
    <div class="card-body p-4">
      <form @submit.prevent="handleSubmit" class="row g-3">
        <div class="col-md-6">
          <label class="form-label text-secondary small text-uppercase fw-bold">Nome</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="form-control form-control-dark" 
            required 
            placeholder="Ex: Âmbar fossilizado"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label text-secondary small text-uppercase fw-bold">Raridade</label>
          <select v-model="form.rarity" class="form-select form-select-dark" required>
            <option value="fragment">Fragmento</option>
            <option value="partial_fossil">Fóssil Parcial</option>
            <option value="rare">Raro</option>
            <option value="exceptional_specimen">Excepcional</option>
            <option value="unique_specimen">Único</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label text-secondary small text-uppercase fw-bold">Imagem</label>
          <input 
            ref="fileInput"
            type="file" 
            @change="onFileChange" 
            class="form-control form-control-dark" 
            accept="image/*" 
            required 
          />
        </div>

        <div class="col-12">
           <label class="form-label text-secondary small text-uppercase fw-bold">Descrição</label>
           <textarea 
             v-model="form.description" 
             class="form-control form-control-dark" 
             rows="3"
             placeholder="Detalhes históricos ou científicos..."
           ></textarea>
        </div>

        <div class="col-12 text-end mt-4">
          <button type="submit" class="btn btn-warning fw-bold px-4" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Processando...' : 'Adicionar ao Acervo' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

defineProps<{ loading: boolean }>();
const emit = defineEmits<{ (e: 'submit', data: FormData): void }>();

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);

const form = reactive({ 
  name: '', 
  rarity: 'fragment', 
  description: '' 
});

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
  }
};

const handleSubmit = () => {
  if (!file.value) return; 
  
  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('rarity', form.rarity);
  formData.append('description', form.description);
  formData.append('image', file.value);
  
  emit('submit', formData);
};


const resetForm = () => {
  form.name = '';
  form.rarity = 'fragment';
  form.description = '';
  file.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

defineExpose({ resetForm });
</script>

<style scoped>
.form-control-dark,
.form-select-dark {
  background-color: #1a1a1a;
  border: 1px solid #333;
  color: #e0e0e0;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control-dark:focus,
.form-select-dark:focus {
  background-color: #222;
  border-color: #ffc107; 
  box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  color: #fff;
}

.form-control-dark::placeholder {
  color: #6c757d;
  opacity: 0.7;
}
</style>