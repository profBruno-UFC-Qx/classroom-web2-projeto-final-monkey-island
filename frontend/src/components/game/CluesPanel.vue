<template>
  <div class="card fossil-card bg-light-industrial border-dark shadow-sm h-100" style="max-height: 80vh; overflow-y: auto;">
    <div class="card-header bg-warning text-dark fw-black text-uppercase border-bottom border-dark p-3 sticky-top">
      <i class="bi bi-journal-text me-2"></i>Dicas
    </div>
    
    <div class="card-body font-monospace">
      <div class="mb-4">
        <h6 class="fw-bold text-danger text-uppercase border-bottom border-secondary pb-1 mb-2">
          <i class="bi bi-arrow-right me-1"></i>Horizontal
        </h6>
        <ul class="list-unstyled">
          <li 
            v-for="clue in clues.across" 
            :key="clue.id" 
            class="mb-2 clue-item p-2 rounded-1" 
            :class="{ 
              'text-decoration-line-through text-muted opacity-50': clue.solved,
              'bg-warning-subtle': activeClueId === clue.id
            }"
            @click="$emit('select-clue', clue.id)"
          >
            <span class="fw-bold me-2 badge bg-danger text-white rounded-0">{{ clue.id }}</span>
            {{ clue.text }}
          </li>
        </ul>
      </div>

      <div>
        <h6 class="fw-bold text-primary text-uppercase border-bottom border-secondary pb-1 mb-2">
          <i class="bi bi-arrow-down me-1"></i>Vertical
        </h6>
        <ul class="list-unstyled">
          <li 
            v-for="clue in clues.down" 
            :key="clue.id" 
            class="mb-2 clue-item p-2 rounded-1" 
            :class="{ 
              'text-decoration-line-through text-muted opacity-50': clue.solved,
              'bg-primary-subtle': activeClueId === clue.id
            }"
            @click="$emit('select-clue', clue.id)"
          >
            <span class="fw-bold me-2 badge bg-primary text-white rounded-0">{{ clue.id }}</span>
            {{ clue.text }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  clues: { across: any[], down: any[] };
  activeClueId: number | null;
}>();

defineEmits(['select-clue']);
</script>

<style scoped>
.bg-light-industrial { background-color: #f0f0f0; }
.fw-black { font-weight: 900; }
.clue-item {
  font-size: 0.85rem;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}
.clue-item:hover { background-color: rgba(0,0,0,0.05); border-color: #ccc; }
.bg-warning-subtle { background-color: #fff3cd; }
.bg-primary-subtle { background-color: #cfe2ff; }
</style>