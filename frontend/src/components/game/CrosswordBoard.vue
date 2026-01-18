<template>
  <div class="card fossil-card bg-dark-jungle border-secondary shadow-lg">
    <div class="card-header bg-black border-bottom border-secondary p-3 d-flex justify-content-between align-items-center">
      <span class="text-warning font-monospace fw-bold">
        <i class="bi bi-grid-3x3 me-2"></i>GRID {{ rows }}x{{ cols }}
      </span>
      <div class="d-flex gap-2">
        <button @click="$emit('reset')" class="btn btn-sm btn-outline-secondary fw-bold text-uppercase rounded-0">
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>
        <button @click="$emit('check')" class="btn btn-sm btn-warning fw-bold text-uppercase rounded-0">
          <i class="bi bi-check-lg me-1"></i>Verificar
        </button>
      </div>
    </div>
    
    <div class="card-body p-0 bg-grid-pattern overflow-auto">
      <div class="crossword-container p-4">
        <div class="crossword-grid" :style="{ '--rows': rows, '--cols': cols }">
          <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="grid-row">
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="grid-cell-wrapper">
              
              <template v-if="cell.isActive">
                <input 
                  type="text" 
                  maxlength="1" 
                  class="cell-input font-monospace fw-bold"
                  :class="{ 
                    'correct': cell.status === 'correct', 
                    'wrong': cell.status === 'wrong',
                    'active-word': isCellInActiveWord(cell)
                  }"
                  v-model="cell.userInput"
                  @input="handleInput($event, rowIndex, colIndex)"
                  @keydown="handleKeydown($event, rowIndex, colIndex)"
                  @focus="handleFocus(cell)"
                  :id="`cell-${rowIndex}-${colIndex}`"
                  autocomplete="off"
                />
                <span v-if="cell.number" class="cell-number">{{ cell.number }}</span>
              </template>
              
              <div v-else class="cell-block"></div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// recebe o estado do grid do pai
const props = defineProps<{
  grid: any[][];
  rows: number;
  cols: number;
  activeClueId: number | null;
}>();

const emit = defineEmits(['reset', 'check', 'focus-clue']);

// lógica de foco visual
const isCellInActiveWord = (cell: any) => {
  if (!props.activeClueId) return false;
  return cell.wordRefs.includes(props.activeClueId);
};

// ao focar, avisa o pai para destacar a dica correspondente
const handleFocus = (cell: any) => {
  if (cell.wordRefs[0]) {
    emit('focus-clue', cell.wordRefs[0]);
  }
};

// navegação automática ao digitar
const handleInput = (event: Event, r: number, c: number) => {
  const input = event.target as HTMLInputElement;
  const val = input.value.toUpperCase();
  
  // atualiza o valor no objeto reativo (passado por prop)
  props.grid[r][c].userInput = val;

  if (val) {
    // tenta mover para direita ou baixo
    let nextEl = document.getElementById(`cell-${r}-${c + 1}`);
    if (!nextEl || !props.grid[r][c+1]?.isActive) {
      nextEl = document.getElementById(`cell-${r + 1}-${c}`);
    }
    nextEl?.focus();
  }
};

// navegação com backspace
const handleKeydown = (event: KeyboardEvent, r: number, c: number) => {
  if (event.key === 'Backspace' && props.grid[r][c].userInput === '') {
    // tenta voltar para esquerda ou cima
    let prevEl = document.getElementById(`cell-${r}-${c - 1}`);
    if (!prevEl || !props.grid[r][c-1]?.isActive) {
      prevEl = document.getElementById(`cell-${r - 1}-${c}`);
    }
    prevEl?.focus();
  }
};
</script>

<style scoped>
/* estilos específicos do grid */
.bg-dark-jungle { background-color: #1a2f2b; }
.bg-grid-pattern {
  background-color: #111;
  background-image: radial-gradient(#333 1px, transparent 1px);
  background-size: 10px 10px;
}
.crossword-container { display: inline-block; min-width: 100%; }
.crossword-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #000;
  border: 4px solid #333;
  width: fit-content;
  margin: 0 auto;
}
.grid-row { display: flex; gap: 1px; }
.grid-cell-wrapper {
  width: 35px;
  height: 35px;
  position: relative;
  background-color: #222;
}
.cell-block { width: 100%; height: 100%; background-color: #1a1a1a; opacity: 0.8; }
.cell-input {
  width: 100%; height: 100%; border: none;
  text-align: center; text-transform: uppercase; font-size: 1rem;
  background-color: #fff; color: #000; padding: 0;
}
.cell-input:focus { outline: none; background-color: #fffde7; box-shadow: inset 0 0 0 2px #ffc107; z-index: 10; }
.cell-input.active-word { background-color: #fff8e1; }
.cell-input.correct { background-color: #4caf50; color: white; font-weight: bold; }
.cell-input.wrong { background-color: #f44336; color: white; animation: shake 0.3s; }
.cell-number {
  position: absolute; top: 1px; left: 2px;
  font-size: 0.55rem; color: #555; pointer-events: none; font-weight: 900; z-index: 5;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
</style>