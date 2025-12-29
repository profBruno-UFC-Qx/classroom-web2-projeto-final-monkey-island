<template>
  <div class="login-layout min-vh-100 d-flex flex-column bg-light">
    
    <AppNavbar />

    <div class="flex-grow-1 d-flex align-items-center justify-content-center p-3">
      <LoginForm />
    </div>
    
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue';
import LoginForm from '../components/LoginForm.vue';
</script>

<style scoped>
/* Apenas estilos de layout da página inteira se necessário */
.login-layout {
  /* Se precisar de um background geral específico */
}
</style>