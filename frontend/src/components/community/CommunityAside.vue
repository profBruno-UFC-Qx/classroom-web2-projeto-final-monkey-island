<template>
  <aside class="community-aside" v-if="community">
    <div class="community-banner"></div>

    <div class="p-4">
      <h4 class="fw-black text-uppercase">{{ community.name }}</h4>

      <p class="small text-muted">{{ community.description }}</p>

      <hr />

      <p class="small fw-bold">
        <i class="bi bi-people-fill me-2"></i>
        {{ community.usersCount }} pesquisadores
      </p>

      <button class="btn btn-success w-100 fw-black mt-3">
        Solicitar Entrada
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ community: any | null }>();
</script>

<style scoped>
.community-aside {
  width: 360px;
  background: #fff;
  border-left: 4px solid #1a2f2b;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
}

.community-banner {
  height: 180px;
  background:
    linear-gradient(180deg, rgba(26, 47, 43, 0.9), rgba(0, 0, 0, 0.85)),
    url("/ingen-jurassic-banner.jpg");
  background-size: cover;
  background-position: center;
}

.fw-black {
  font-weight: 900;
}
</style>
