<template>
  <div 
    @click="goToGame" 
    class="card fossil-card bg-dark-jungle border-warning border-1 mb-4 shadow-sm cursor-pointer hover-effect overflow-hidden position-relative"
  >
    <div class="scanline-overlay"></div>

    <div class="card-body p-3 d-flex align-items-center position-relative z-1">
      
      <div class="icon-box bg-warning text-dark me-3 shadow-sm">
        <i class="bi bi-controller fs-4"></i>
      </div>
      
      <div class="flex-grow-1 lh-1">
        <h6 class="fw-black text-white text-uppercase mb-1 tracking-wide">
          Paleo-Code
        </h6>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-danger rounded-0 x-small" style="font-size: 0.6rem;">LIVE</span>
          <span class="text-light-fossil font-monospace x-small">Desafio Diário</span>
        </div>
      </div>

      <div class="action-arrow text-warning">
        <i class="bi bi-play-circle-fill fs-3"></i>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToGame = () => {
  router.push('/game');
};
</script>

<style scoped>
/* CORES E TIPOGRAFIA */
.bg-dark-jungle {
  background-color: #1a2f2b; /* Verde escuro InGen */
}
.text-light-fossil {
  color: #e8e2d9;
}
.fw-black {
  font-weight: 900;
}
.tracking-wide {
  letter-spacing: 1px;
}
.x-small {
  font-size: 0.75rem;
}

/* LAYOUT E INTERAÇÃO */
.cursor-pointer {
  cursor: pointer;
}

.icon-box {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid #000;
}

/* EFEITOS DE HOVER */
.hover-effect {
  transition: all 0.3s ease;
  border: 1px solid #ffc107; /* Amarelo padrão */
}

.hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2) !important;
  background-color: #233b36; /* Um pouco mais claro */
}

.hover-effect:hover .action-arrow {
  transform: scale(1.1);
  color: #fff;
}

.action-arrow {
  transition: all 0.3s ease;
}

/* SCANLINE (Detalhe estético sutil) */
.scanline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.1)
  );
  background-size: 100% 4px;
  opacity: 0.3;
  pointer-events: none;
}
</style>