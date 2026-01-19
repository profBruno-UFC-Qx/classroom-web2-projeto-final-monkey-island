<template>
  <div
    class="notfound-layout d-flex flex-column justify-content-center align-items-center min-vh-100 bg-concrete text-center p-4"
  >
    <div
      class="card fossil-card p-5 shadow-lg border-2 border-warning bg-dark text-warning"
    >
      <i class="bi bi-exclamation-triangle-fill fs-1 mb-3 animate-pulse"></i>
      <h1 class="fw-black text-uppercase mb-3 tracking-widest">404</h1>
      <h3 class="fw-bold text-uppercase mb-2">Página Não Encontrada</h3>
      <p class="font-monospace text-light-fossil mb-4">
        O setor que você procura não existe ou foi desativado.<br />
        Verifique o endereço ou retorne ao terminal principal.
      </p>
      <router-link
        to="/home"
        class="btn btn-warning border-dark rounded-0 fw-black text-uppercase px-4 py-2 shadow-sm"
      >
        <i class="bi bi-house-door me-2"></i>Voltar para Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.notfound-layout {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
}

.fossil-card {
  border-radius: 2px;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.fw-black {
  font-weight: 900;
}

.tracking-widest {
  letter-spacing: 3px;
}

.text-light-fossil {
  color: #e8e2d9;
}
</style>
