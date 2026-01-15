<template>
  <div class="game-layout min-vh-100 bg-concrete">
    <div class="danger-stripe shadow-sm"></div>
    
    <header class="hero-section py-3 mb-4 shadow-lg position-relative">
      <div class="overlay-grid"></div>
      <div class="container position-relative z-1 text-center">
        <div class="d-inline-block border border-warning border-2 p-3 bg-dark-transparent backdrop-blur rounded-1">
          <h1 class="h4 fw-black text-warning text-uppercase mb-0 tracking-widest text-shadow">
            <i class="bi bi-controller me-2"></i>Simulação Tática: Paleo-Code v2.0
          </h1>
          <div class="d-flex align-items-center justify-content-center gap-2 mt-1">
            <span class="badge bg-danger rounded-0 text-uppercase">Nível Avançado</span>
            <span class="text-light-fossil font-monospace x-small text-uppercase">Banco de Dados Expandido</span>
          </div>
        </div>
      </div>
    </header>

    <div class="container-fluid px-4 pb-5">
      <div class="row g-4 justify-content-center">
        <div class="col-xl-7 col-lg-8">
          <div class="card fossil-card bg-dark-jungle border-secondary shadow-lg">
            <div class="card-header bg-black border-bottom border-secondary p-3 d-flex justify-content-between align-items-center">
              <span class="text-warning font-monospace fw-bold"><i class="bi bi-grid-3x3 me-2"></i>GRID 18x18</span>
              <div class="d-flex gap-2">
                <button @click="resetGame" class="btn btn-sm btn-outline-secondary fw-bold text-uppercase rounded-0">
                  <i class="bi bi-arrow-counterclockwise"></i>
                </button>
                <button @click="checkAnswers" class="btn btn-sm btn-warning fw-bold text-uppercase rounded-0">
                  <i class="bi bi-check-lg me-1"></i>Verificar
                </button>
              </div>
            </div>
            
            <div class="card-body p-0 bg-grid-pattern overflow-auto">
              <div class="crossword-container p-4">
                <div class="crossword-grid" :style="{ '--rows': ROWS, '--cols': COLS }">
                  <div 
                    v-for="(row, rowIndex) in grid" 
                    :key="rowIndex" 
                    class="grid-row"
                  >
                    <div 
                      v-for="(cell, colIndex) in row" 
                      :key="colIndex" 
                      class="grid-cell-wrapper"
                    >
                      <template v-if="cell.isActive">
                        <input 
                          type="text" 
                          maxlength="1" 
                          class="cell-input font-monospace fw-bold"
                          :class="{ 
                            'correct': cell.status === 'correct', 
                            'wrong': cell.status === 'wrong',
                            'active-word': isCellInActiveWord(rowIndex, colIndex)
                          }"
                          v-model="cell.userInput"
                          @input="handleInput($event, rowIndex, colIndex)"
                          @keydown="handleKeydown($event, rowIndex, colIndex)"
                          @focus="handleFocus(rowIndex, colIndex)"
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
        </div>

        <div class="col-xl-4 col-lg-4">
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
                    @click="highlightWordFromClue(clue.id, 'across')"
                    style="cursor: pointer;"
                  >
                    <span class="fw-bold me-2 badge bg-danger text-white rounded-0">{{ clue.id }}</span>{{ clue.text }}
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
                    @click="highlightWordFromClue(clue.id, 'down')"
                    style="cursor: pointer;"
                  >
                    <span class="fw-bold me-2 badge bg-primary text-white rounded-0">{{ clue.id }}</span>{{ clue.text }}
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="gameWon" class="modal-backdrop-custom d-flex justify-content-center align-items-center">
      <div class="card fossil-card border-warning border-3 bg-dark text-light p-5 text-center shadow-lg animate-pop" style="max-width: 500px;">
        <div class="display-1 text-warning mb-3"><i class="bi bi-trophy-fill"></i></div>
        <h2 class="text-uppercase fw-black text-warning">Sistema Desbloqueado!</h2>
        <div class="bg-secondary bg-opacity-25 p-3 rounded mb-4 mt-3">
          <p class="font-monospace mb-0 text-light-fossil">
            > ANÁLISE COMPLETA.<br>
            > DNA SEQUENCIADO: 100%<br>
            > STATUS: OPERACIONAL
          </p>
        </div>
        <button @click="resetGame" class="btn btn-warning text-uppercase fw-bold rounded-0 px-5 py-2 shadow hover-scale">
          Reiniciar Simulação
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

// --- CONFIGURAÇÃO ---
interface Cell {
  isActive: boolean;
  letter: string;
  userInput: string;
  status: 'neutral' | 'correct' | 'wrong';
  number?: number;
  wordRefs: number[]; // IDs das palavras que passam por essa célula
}

// Grid Gigante 18x18
const ROWS = 18;
const COLS = 18;
const grid = reactive<Cell[][]>([]);
const activeClueId = ref<number | null>(null);
const gameWon = ref(false);

// --- DADOS DAS PALAVRAS (VALIDADOS) ---
/*
  LAYOUT PLANEJADO:
  1. PALEONTOLOGIA (H) - Linha 8, Col 2
  2. TIRANOSSAURO (V) - Cruza 'O' de PALEONTOLOGIA (Linha 8, Col 6)
  3. TRICERATOPS (V) - Cruza 'T' de PALEONTOLOGIA (Linha 8, Col 8)
  4. VELOCIRAPTOR (H) - Cruza 'R' de TRICERATOPS (Linha 2, Col 8)
  5. METEORO (H) - Cruza 'R' de TIRANOSSAURO (Linha 5, Col 6)
  6. FOSSIL (H) - Cruza 'O' final de TIRANOSSAURO (Linha 14, Col 6)
*/

const words = [
  // HORIZONTAIS
  { id: 1, word: 'PALEONTOLOGIA', direction: 'across', row: 8, col: 2, text: 'Ciência que estuda a vida do passado através de fósseis' },
  { id: 4, word: 'VELOCIRAPTOR', direction: 'across', row: 2, col: 2, text: 'Predador ágil famoso por caçar em bando (Jurassic Park)' },
  { id: 5, word: 'METEORO', direction: 'across', row: 5, col: 1, text: 'Causa provável da extinção em massa do Cretáceo' },
  { id: 6, word: 'FOSSIL', direction: 'across', row: 14, col: 5, text: 'Resto mineralizado de um ser vivo antigo' },
  
  // VERTICAIS
  { id: 2, word: 'TIRANOSSAURO', direction: 'down', row: 3, col: 6, text: 'O "Rei Lagarto Tirano", grande carnívoro do Cretáceo' },
  { id: 3, word: 'TRICERATOPS', direction: 'down', row: 1, col: 8, text: 'Herbívoro famoso por seus três chifres e escudo ósseo' }
];

const clues = reactive({
  across: words.filter(w => w.direction === 'across').map(w => ({ id: w.id, text: w.text, solved: false })),
  down: words.filter(w => w.direction === 'down').map(w => ({ id: w.id, text: w.text, solved: false }))
});

// --- INICIALIZAÇÃO ---
const initGrid = () => {
  grid.splice(0, grid.length);
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < COLS; c++) {
      row.push({ isActive: false, letter: '', userInput: '', status: 'neutral', wordRefs: [] });
    }
    grid.push(row);
  }

  words.forEach(w => {
    const letters = w.word.toUpperCase().split('');
    for (let i = 0; i < letters.length; i++) {
      let r = w.row;
      let c = w.col;
      if (w.direction === 'across') c += i;
      else r += i;

      if (r < ROWS && c < COLS) {
        grid[r][c].isActive = true;
        grid[r][c].letter = letters[i];
        grid[r][c].wordRefs.push(w.id);
        
        if (i === 0) grid[r][c].number = w.id;
      }
    }
  });
};

// --- INTERAÇÃO ---
const handleInput = (event: Event, r: number, c: number) => {
  const input = event.target as HTMLInputElement;
  const val = input.value.toUpperCase();
  grid[r][c].userInput = val;

  if (val) {
    // Tenta mover para a direita (se for horizontal) ou baixo (se vertical)
    // Lógica simples: Prioriza horizontal se não houver conflito óbvio
    let nextId = `cell-${r}-${c + 1}`;
    let nextEl = document.getElementById(nextId);
    
    // Se não houver célula à direita ou se a palavra atual for vertical (heuristicamente)
    if (!nextEl || !grid[r][c+1]?.isActive) {
      nextId = `cell-${r + 1}-${c}`;
      nextEl = document.getElementById(nextId);
    }
    
    if (nextEl) nextEl.focus();
  }
};

const handleKeydown = (event: KeyboardEvent, r: number, c: number) => {
  if (event.key === 'Backspace' && grid[r][c].userInput === '') {
    // Tenta voltar
    let prevId = `cell-${r}-${c - 1}`;
    let prevEl = document.getElementById(prevId);
    
    if (!prevEl || !grid[r][c-1]?.isActive) {
      prevId = `cell-${r - 1}-${c}`;
      prevEl = document.getElementById(prevId);
    }
    
    if (prevEl) prevEl.focus();
  }
};

const handleFocus = (r: number, c: number) => {
  // Destaca a dica baseada na palavra que passa aqui
  // Pega o primeiro ID de palavra associado a esta célula
  const wordId = grid[r][c].wordRefs[0];
  if (wordId) activeClueId.value = wordId;
};

const highlightWordFromClue = (id: number, direction: string) => {
  activeClueId.value = id;
  const word = words.find(w => w.id === id);
  if (word) {
    const elId = `cell-${word.row}-${word.col}`;
    const el = document.getElementById(elId);
    if (el) el.focus();
  }
};

const isCellInActiveWord = (r: number, c: number) => {
  if (!activeClueId.value) return false;
  return grid[r][c].wordRefs.includes(activeClueId.value);
};

// --- VERIFICAÇÃO ---
const checkAnswers = () => {
  let allCorrect = true;
  
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c];
      if (cell.isActive) {
        if (cell.userInput === cell.letter) {
          cell.status = 'correct';
        } else {
          cell.status = 'wrong';
          allCorrect = false;
        }
      }
    }
  }

  updateClueStatus();
  if (allCorrect) gameWon.value = true;
};

const updateClueStatus = () => {
  const checkWord = (w: any) => {
    const letters = w.word.split('');
    for (let i = 0; i < letters.length; i++) {
      let r = w.row;
      let c = w.col;
      if (w.direction === 'across') c += i;
      else r += i;
      if (grid[r][c].userInput !== grid[r][c].letter) return false;
    }
    return true;
  };

  [...clues.across, ...clues.down].forEach(clue => {
    const wordDef = words.find(w => w.id === clue.id);
    if (wordDef) clue.solved = checkWord(wordDef);
  });
};

const resetGame = () => {
  grid.forEach(row => row.forEach(cell => {
    if (cell.isActive) {
      cell.userInput = '';
      cell.status = 'neutral';
    }
  }));
  [...clues.across, ...clues.down].forEach(c => c.solved = false);
  gameWon.value = false;
  activeClueId.value = null;
};

onMounted(() => {
  initGrid();
});
</script>

<style scoped>
/* CORES DO TEMA */
.bg-concrete {
  background-color: #dcdcdc;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
}

.danger-stripe {
  background: repeating-linear-gradient(45deg, #ffc107, #ffc107 20px, #1a1a1a 20px, #1a1a1a 40px);
  border-bottom: 2px solid #000;
  height: 20px;
}

.hero-section {
  background-color: #2c3e50;
  border-bottom: 4px solid #ffc107;
}

.bg-dark-transparent { background-color: rgba(0, 0, 0, 0.6); }
.backdrop-blur { backdrop-filter: blur(5px); }
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 3px; }
.text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); }
.bg-dark-jungle { background-color: #1a2f2b; }
.bg-light-industrial { background-color: #f0f0f0; }

/* ESTILOS GRID GIGANTE */
.bg-grid-pattern {
  background-color: #111;
  background-image: radial-gradient(#333 1px, transparent 1px);
  background-size: 10px 10px;
}

.crossword-container {
  display: inline-block; /* Permite que o container cresça com o conteúdo dentro do scroll */
  min-width: 100%;
}

.crossword-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #000;
  border: 4px solid #333;
  width: fit-content; /* Grid se ajusta ao tamanho das células */
  margin: 0 auto;
}

.grid-row {
  display: flex;
  gap: 1px;
}

.grid-cell-wrapper {
  width: 35px; /* Células um pouco menores para caber mais */
  height: 35px;
  position: relative;
  background-color: #222;
}

.cell-block {
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  opacity: 0.8;
}

.cell-input {
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
  text-transform: uppercase;
  font-size: 1rem;
  background-color: #fff;
  color: #000;
  transition: all 0.2s;
  cursor: pointer;
  padding: 0;
}

.cell-input:focus {
  outline: none;
  background-color: #fffde7;
  box-shadow: inset 0 0 0 2px #ffc107;
  z-index: 10;
}

.cell-input.active-word {
  background-color: #fff8e1; /* Leve destaque quando a dica está selecionada */
}

.cell-input.correct {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.cell-input.wrong {
  background-color: #f44336;
  color: white;
  animation: shake 0.3s;
}

.cell-number {
  position: absolute;
  top: 1px;
  left: 2px;
  font-size: 0.55rem;
  color: #555;
  pointer-events: none;
  font-weight: 900;
  z-index: 5;
}

/* DICAS */
.clue-item {
  font-size: 0.85rem;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.clue-item:hover {
  background-color: rgba(0,0,0,0.05);
  border-color: #ccc;
}
.bg-warning-subtle { background-color: #fff3cd; }
.bg-primary-subtle { background-color: #cfe2ff; }

/* MODAL */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.animate-pop { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.hover-scale:hover { transform: scale(1.05); }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes popIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>