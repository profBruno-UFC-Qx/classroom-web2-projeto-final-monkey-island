<template>
  <aside class="community-aside" v-if="community">
    <!-- Banner -->
    <div class="aside-banner">
      <span class="dino">🦖</span>

      <!-- Botão fechar -->
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <!-- Conteúdo -->
    <div class="aside-content">
      <h5 class="fw-black mb-2">{{ community.name }}</h5>

      <p class="description">
        {{
          community.description || "Essa comunidade ainda não possui descrição."
        }}
      </p>

      <div class="meta">
        <div class="meta-item">
          <strong>Membros</strong>
          <span>{{ community.memberCount ?? "—" }}</span>
        </div>

        <div class="meta-item">
          <strong>Criada em</strong>
          <span>{{ formatDate(community.createdAt) }}</span>
        </div>
      </div>

      <button class="btn btn-primary fw-black w-100 mt-3">
        Entrar na Comunidade
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  community: any | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pt-BR");
};
</script>

<style scoped>
.community-aside {
  width: 320px;
  background-color: #dcdcdc;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

/* Banner */
.aside-banner {
  height: 110px;
  background: linear-gradient(135deg, #1a2f2b, #243f3a);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.dino {
  font-size: 48px;
}

/* Botão fechar */
.close-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
}

.close-btn:hover {
  opacity: 1;
}

/* Conteúdo */
.aside-content {
  padding: 20px;
}

.description {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 16px;
}

/* Metadados */
.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
}

.meta-item strong {
  font-weight: 900;
  text-transform: uppercase;
  color: #1a2f2b;
}

.meta-item span {
  color: #555;
}
</style>
