<template>
  <div class="register-layout min-vh-100 d-flex flex-column bg-texture">
    <AppNavbar />

    <div
      class="flex-grow-1 d-flex align-items-center justify-content-center p-3"
    >
      <div class="container" style="max-width: 900px">
        <RegisterForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from "../components/AppNavbar.vue";
import RegisterForm from "../components/RegisterForm.vue";
</script>

<style scoped>
.bg-texture {
  background-color: #f4f4f4;
  background-image: radial-gradient(#1a2f2b 0.5px, transparent 0.5px);
  background-size: 20px 20px;
}
</style>
