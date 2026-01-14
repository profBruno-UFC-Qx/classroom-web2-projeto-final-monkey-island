<template>
  <aside
    class="card fossil-card community-aside border-dark shadow-sm position-relative overflow-hidden"
    v-if="community"
  >
    <!-- Aba superior -->
    <div
      class="top-folder-tab bg-warning px-3 py-1 fw-bold small text-dark border-top border-start border-end border-dark"
    >
      PAINEL DA COMUNIDADE
    </div>

    <!-- Header -->
    <div
      class="card-header bg-dark text-warning fw-black text-uppercase border-bottom border-warning rounded-0 d-flex justify-content-between align-items-center p-3"
    >
      <span> <i class="bi bi-diagram-3-fill me-2"></i>Registro </span>

      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <!-- Corpo -->
    <div class="card-body bg-light-industrial p-4">
      <h6 class="fw-black text-uppercase text-dark-jungle mb-2">
        {{ community.name }}
      </h6>

      <p class="small text-muted font-monospace mb-4">
        >
        {{
          community.description ||
          "Nenhuma descrição registrada no banco de dados."
        }}
      </p>

      <ul
        class="list-unstyled font-monospace small fw-bold text-dark-jungle mb-4"
      >
        <li
          class="d-flex justify-content-between mb-2 pb-2 border-bottom border-secondary-subtle"
        >
          <span><i class="bi bi-people-fill me-1"></i>Membros</span>
          <span>{{ community.memberCount ?? "—" }}</span>
        </li>

        <li class="d-flex justify-content-between">
          <span><i class="bi bi-calendar-event me-1"></i>Criada em</span>
          <span>{{ formatDate(community.createdAt) }}</span>
        </li>
      </ul>

      <button
        class="btn btn-dark w-100 py-2 fw-black text-uppercase border-warning btn-terminal"
      >
        <i class="bi bi-box-arrow-in-right text-warning me-2"></i>
        Acessar Comunidade
      </button>
    </div>

    <div
      class="card-footer bg-dark text-secondary text-center font-monospace small"
    >
      STATUS: <span class="text-success">ATIVO</span> · 🦖
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  community: any | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pt-BR");
};
</script>

<style scoped>
.community-aside {
  width: 340px;
  height: 400px;
  z-index: 3;
  opacity: 0.9;

  border-width: 2px;
}

/* Aba estilo arquivo */
.top-folder-tab {
  position: absolute;
  top: 0;
  left: 16px;
  transform: translateY(-100%);
  letter-spacing: 1px;
}

/* Botão fechar */
.close-btn {
  background: transparent;
  border: none;
  color: #ffc107;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.8;
}

.close-btn:hover {
  opacity: 1;
}

/* Reaproveitando identidade */
.bg-light-industrial {
  background-color: #f0f0f0;
}

.text-dark-jungle {
  color: #1a2f2b;
}

.fw-black {
  font-weight: 900;
}
</style>
