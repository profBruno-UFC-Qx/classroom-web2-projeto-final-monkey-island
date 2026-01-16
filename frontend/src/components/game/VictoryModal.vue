<template>
  <div v-if="show" class="modal-backdrop-custom d-flex justify-content-center align-items-center">
    <div class="card fossil-card border-warning border-3 bg-dark text-light p-5 text-center shadow-lg animate-pop" style="max-width: 500px;">
      
      <div class="display-1 text-warning mb-3"><i class="bi bi-trophy-fill"></i></div>
      <h2 class="text-uppercase fw-black text-warning">Sistema Desbloqueado!</h2>
      
      <div class="bg-secondary bg-opacity-25 p-3 rounded mb-4 mt-3">
        <p class="font-monospace mb-0 text-light-fossil">
          > ANÁLISE COMPLETA.<br>
          > DNA SEQUENCIADO: 100%<br>
          > STATUS: OPERACIONAL
        </p>
      </div>

      <button @click="$emit('reset')" class="btn btn-warning text-uppercase fw-bold rounded-0 px-5 py-2 shadow hover-scale">
        Reiniciar Simulação
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
defineEmits(['reset']);
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.85);
  z-index: 2000;
  backdrop-filter: blur(5px);
}
.fw-black { font-weight: 900; }
.text-light-fossil { color: #e8e2d9; }
.animate-pop { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.hover-scale:hover { transform: scale(1.05); }

@keyframes popIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>