<template>
  <div class="login-layout min-vh-100 d-flex flex-column bg-light">
    <div
      class="flex-grow-1 d-flex align-items-center justify-content-center p-3"
    >
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from "../components/LoginForm.vue";
</script>

<style scoped>
.login-layout {
}
</style>
