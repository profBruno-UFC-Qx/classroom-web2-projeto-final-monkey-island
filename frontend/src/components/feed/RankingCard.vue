<template>
  <div class="card border-0 shadow-lg h-100 bg-dark-custom">
    <div 
      class="card-header fw-bold text-uppercase py-3"
      :class="`bg-${headerColor} text-${headerTextColor}`"
    >
      <i :class="`bi ${icon} me-2`"></i>{{ title }}
    </div>

    <div class="card-body p-0">
      <ul class="list-group list-group-flush bg-transparent">
        <li 
          v-for="(item, index) in items" 
          :key="item.id"
          class="list-group-item bg-transparent border-bottom border-secondary py-3 px-4 d-flex align-items-center text-light"
        >
          <div class="rank-badge me-3 fw-bold font-monospace" :class="getRankClass(index)">
            <span v-if="index < 3" class="fs-4"><i class="bi bi-trophy-fill"></i></span>
            <span v-else>#{{ index + 1 }}</span>
          </div>
          
          <div class="flex-grow-1">
            <h5 class="fw-bold mb-1" :class="`text-${accentColor}`">{{ item.name }}</h5>
            <div class="progress" style="height: 6px; width: 100px;">
              <div 
                class="progress-bar" 
                :class="`bg-${accentColor}`"
                :style="{ width: getPercentage(item.count) + '%' }"
              ></div>
            </div>
          </div>

          <div class="text-end">
            <div class="h4 mb-0 fw-bold font-monospace">{{ item.count }}</div>
            <small class="text-muted small text-uppercase">{{ label }}</small>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// props para deixar o card genérico
const props = defineProps<{
  title: string;
  icon: string;
  items: { id: string; name: string; count: number }[];
  theme: 'yellow' | 'blue'; // define o tema de cores
  label: string; // ex: 'Posts', 'Atividade'
}>();

// computa as cores baseadas no tema escolhido
const headerColor = computed(() => props.theme === 'yellow' ? 'warning' : 'primary');
const headerTextColor = computed(() => props.theme === 'yellow' ? 'dark' : 'white');
const accentColor = computed(() => props.theme === 'yellow' ? 'warning' : 'info');

// calcula porcentagem para a barra (baseado no primeiro item que é o maior)
const getPercentage = (value: number) => {
  if (!props.items.length) return 0;
  const max = props.items[0].count;
  return Math.round((value / max) * 100);
};

// define a cor do ícone de ranking
const getRankClass = (index: number) => {
  if (index === 0) return 'text-warning'; // ouro
  if (index === 1) return 'text-light opacity-75'; // prata
  if (index === 2) return 'text-danger'; // bronze
  return props.theme === 'blue' ? 'text-info opacity-50' : 'text-light opacity-50';
};
</script>

<style scoped>
.bg-dark-custom { background-color: #1a2f2b; }
.rank-badge { width: 40px; text-align: center; }
.small { font-size: 0.7rem; }
</style>