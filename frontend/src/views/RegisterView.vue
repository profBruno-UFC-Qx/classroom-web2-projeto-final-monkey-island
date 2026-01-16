<template>
  <div class="register-layout min-vh-100 d-flex flex-column">
    
    <div class="flex-grow-1 d-flex align-items-center justify-content-center p-3">
      
      <div class="container" style="max-width: 900px">
        <RegisterForm />
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
// importa o componente do formulário de registro
import RegisterForm from "../components/RegisterForm.vue";
</script>

<style scoped>
/* cor de fundo simples e neutra */
.register-layout {
  background-color: #f4f4f4;
}
</style>