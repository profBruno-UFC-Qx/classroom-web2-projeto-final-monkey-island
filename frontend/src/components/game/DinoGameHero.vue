<template>
  <header class="hero-section py-3 mb-4 shadow-lg position-relative">
    <div class="overlay-grid"></div>
    <div class="container position-relative z-1 text-center">
      <div class="d-inline-block border border-warning border-2 p-3 bg-dark-transparent backdrop-blur rounded-1">
        <h1 class="h4 fw-black text-warning text-uppercase mb-0 tracking-widest text-shadow">
          <i class="bi bi-controller me-2"></i>Simulação Tática: Paleo-Code v2.0
        </h1>
        <div class="d-flex align-items-center justify-content-center gap-2 mt-1">
          <span class="badge bg-danger rounded-0 text-uppercase">Nível Avançado</span>
          <span class="text-light-fossil font-monospace x-small text-uppercase">Banco de Dados Expandido</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* estilos temáticos do cabeçalho */
.hero-section {
  background-color: #2c3e50;
  border-bottom: 4px solid #ffc107;
}
.bg-dark-transparent { background-color: rgba(0, 0, 0, 0.6); }
.backdrop-blur { backdrop-filter: blur(5px); }
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 3px; }
.text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); }
.text-light-fossil { color: #e8e2d9; }
.x-small { font-size: 0.7rem; }
</style>