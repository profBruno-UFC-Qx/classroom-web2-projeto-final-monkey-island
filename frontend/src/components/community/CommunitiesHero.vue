<template>
  <header class="hero-section py-5 mb-5 shadow-lg position-relative">
    <div class="overlay-grid"></div>
    <div class="container position-relative z-1 text-center">
      <div class="d-inline-block border border-warning border-3 p-4 bg-dark-transparent backdrop-blur rounded-1">
        <h1 class="display-5 fw-black text-warning text-uppercase mb-0 tracking-widest text-shadow">
          <i class="bi bi-diagram-3-fill me-3"></i>Comunidades
        </h1>
        <div class="mt-2">
          <span class="text-light-fossil font-monospace small text-uppercase">
            Rede de Pesquisadores
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* estilos visuais específicos do hero */
.text-light-fossil { color: #e8e2d9; }
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 3px; }
.text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); }
.bg-dark-transparent { background-color: rgba(0, 0, 0, 0.6); }
.backdrop-blur { backdrop-filter: blur(5px); }
</style>