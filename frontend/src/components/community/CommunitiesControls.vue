<template>
  <div class="d-flex justify-content-between align-items-center mb-4">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="form-control w-50 search-input"
      placeholder="Buscar comunidade..."
    />

    <button
      v-if="canCreate"
      class="btn btn-dark fw-black btn-terminal"
      @click="$emit('open-create')"
    >
      <i class="bi bi-plus-circle me-2 text-warning"></i>
      Criar Comunidade
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  canCreate: boolean;
}>();

defineEmits(['update:modelValue', 'open-create']);
</script>

<style scoped>
/* estilos do input e botão */
.fw-black { font-weight: 900; }

.search-input {
  background-color: rgba(26, 47, 43, 0.8);
  border: 2px solid #ffc107;
  color: #e8e2d9;
  font-family: "Courier New", monospace;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 2px;
  outline: none;
  transition: all 0.3s;
}

.search-input::placeholder { color: #e8e2d9; opacity: 0.7; }
.search-input:focus {
  background-color: rgba(26, 47, 43, 1);
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}

.btn-terminal { transition: all 0.3s; }
.btn-terminal:hover {
  background-color: #1a1a1a;
  border-color: #ffc107;
  color: #ffc107;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}
</style>