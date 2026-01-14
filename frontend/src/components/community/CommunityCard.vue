<template>
  <div
    class="card fossil-card community-card border-dark shadow-sm position-relative overflow-hidden"
    @click="$emit('select', community)"
  >
    <!-- Aba superior estilo pasta -->
    <div
      class="top-folder-tab bg-warning px-3 py-1 fw-bold small text-dark border-top border-start border-end border-dark"
    >
      COMUNIDADE
    </div>

    <div class="card-body p-3 bg-light-industrial">
      <h6 class="fw-black text-uppercase text-dark-jungle mb-1">
        <i class="bi bi-diagram-3-fill text-danger me-2"></i>
        {{ community.name }}
      </h6>

      <p class="small text-muted font-monospace mb-3">
        >
        {{ community.description || "Registro sem descrição disponível." }}
      </p>

      <div
        class="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle"
      >
        <span class="badge bg-dark rounded-0 text-uppercase">
          <i class="bi bi-people-fill me-1"></i>
          {{ community.memberCount }} membros
        </span>

        <span class="small text-secondary font-monospace"> STATUS: ATIVO </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ community: any }>();
defineEmits(["select"]);
</script>

<style scoped>
.community-card {
  cursor: pointer;
  transition: all 0.25s ease;
  border-width: 2px;
}

/* Hover no estilo terminal */
.community-card:hover {
  background-color: #f5f5f5;
  box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.6);
}

/* Reaproveitando identidade */
.text-dark-jungle {
  color: #1a2f2b;
}

.bg-light-industrial {
  background-color: #f0f0f0;
}

.fw-black {
  font-weight: 900;
}

/* Aba estilo arquivo */
.top-folder-tab {
  position: absolute;
  top: 0;
  left: 12px;
  transform: translateY(-100%);
  letter-spacing: 1px;
}
</style>
