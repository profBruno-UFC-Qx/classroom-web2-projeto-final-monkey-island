<template>
  <header class="hero-section py-5 mb-5 shadow-lg position-relative">
    <div class="overlay-grid"></div>
    <div class="container position-relative z-1 text-center">
      <div class="d-inline-block border border-warning border-3 p-4 bg-dark-transparent backdrop-blur rounded-1">
        <h1 class="display-5 fw-black text-warning text-uppercase mb-0 tracking-widest text-shadow">
          <i class="bi bi-terminal-fill me-3"></i>Terminal Central
        </h1>
        <div class="d-flex align-items-center justify-content-center gap-2 mt-2">
          <span class="badge bg-danger rounded-0 text-uppercase">Restrito</span>
          <span class="text-light-fossil font-monospace small text-uppercase">Sistema Operacional v4.0</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-section {
  background-color: #2c3e50;
  background-image: linear-gradient(rgba(26, 47, 43, 0.9), rgba(26, 47, 43, 0.8)), url("https://www.transparenttextures.com/patterns/dark-matter.png");
  border-bottom: 4px solid #ffc107;
}
.overlay-grid {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px);
  background-size: 50px 50px; background-position: center; opacity: 0.1; pointer-events: none;
}
.bg-dark-transparent { background-color: rgba(0, 0, 0, 0.6); }
.backdrop-blur { backdrop-filter: blur(5px); }
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 3px; }
.text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); }
.text-light-fossil { color: #e8e2d9; }
</style>