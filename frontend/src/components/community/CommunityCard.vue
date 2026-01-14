<template>
  <div
    class="card fossil-card bg-dark border-secondary community-card"
    @click="$emit('select', community)"
  >
    <div class="card-body d-flex align-items-center gap-3">
      <!-- Ícone ou avatar -->
      <div
        class="d-flex align-items-center justify-content-center bg-black border border-secondary rounded-1 position-relative"
        style="width: 60px; height: 60px; min-width: 60px"
      >
        <i class="bi bi-shield-shaded fs-3 text-warning"></i>
      </div>

      <!-- Conteúdo da comunidade -->
      <div class="flex-grow-1">
        <h6 class="text-warning fw-bold text-uppercase m-0">
          {{ community.name }}
        </h6>
        <p class="text-secondary font-monospace x-small m-0">
          {{ community.description || "Sem descrição" }}
        </p>
      </div>

      <!-- Botão de ação -->
      <button class="btn btn-sm btn-outline-warning rounded-0 fw-bold px-3">
        <i class="bi bi-box-arrow-in-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Community } from "@/types/community";

defineProps<{
  community: Community;
}>();

defineEmits<{
  (e: "select", community: Community): void;
}>();
</script>

<style scoped>
.community-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.community-card:hover {
  transform: scale(1.02);
}
</style>
