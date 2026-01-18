<template>
  <div class="card border-0 shadow-sm mb-4" v-if="community">
    <div class="card-header bg-white fw-bold border-bottom py-3">
      <i class="bi bi-info-circle me-2 text-primary"></i>Sobre a Comunidade
    </div>
    
    <div class="card-body">
      <p class="text-secondary small mb-4">
        {{ community.description || "sem descrição disponível." }}
      </p>

      <ul class="list-unstyled text-secondary small mb-0">
        <li class="d-flex justify-content-between mb-2">
          <strong><i class="bi bi-people me-2"></i>Membros:</strong>
          <span>{{ community.memberCount ?? "—" }}</span>
        </li>
        <li class="d-flex justify-content-between">
          <strong><i class="bi bi-calendar me-2"></i>Criada em:</strong>
          <span>{{ formatDate(community.createdAt) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  community: any | null;
}>();

// formata a data para padrão br
const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pt-BR");
};
</script>