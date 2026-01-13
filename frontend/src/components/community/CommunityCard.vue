<template>
  <div class="card community-card" @click="$emit('select', community)">
    <div class="card-body">
      <h5 class="fw-black text-uppercase mb-1">
        <i class="bi bi-diagram-3-fill me-2"></i>{{ community.name }}
      </h5>

      <p class="small text-muted mb-3">
        {{ community.description }}
      </p>

      <span class="badge bg-dark">
        <i class="bi bi-people-fill me-1"></i
        >{{ community.memberCount }} membros
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ community: any }>();
defineEmits(["select"]);
</script>

<style scoped>
.community-card {
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid #1a2f2b;
}
.community-card:hover {
  transform: translateY(-4px);
  background-color: #f8f9fa;
}
.fw-black {
  font-weight: 900;
}
</style>
