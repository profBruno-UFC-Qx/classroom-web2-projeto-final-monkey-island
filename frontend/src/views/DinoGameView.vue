<template>
  <div class="game-layout min-vh-100 bg-concrete">
    <div class="danger-stripe shadow-sm"></div>
    
    <DinoGameHero />

    <div class="container-fluid px-4 pb-5">
      <div class="row g-4 justify-content-center">
        
        <div class="col-xl-7 col-lg-8">
          <CrosswordBoard 
            :grid="grid"
            :rows="ROWS"
            :cols="COLS"
            :active-clue-id="activeClueId"
            @reset="resetGame"
            @check="checkAnswers"
            @focus-clue="activeClueId = $event"
          />
        </div>

        <div class="col-xl-4 col-lg-4">
          <CluesPanel 
            :clues="clues"
            :active-clue-id="activeClueId"
            @select-clue="highlightWordFromClue"
          />
        </div>

      </div>
    </div>

    <VictoryModal :show="gameWon" @reset="resetGame" />

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

// imports dos novos componentes
import DinoGameHero from '../components/game/DinoGameHero.vue';
import CrosswordBoard from '../components/game/CrosswordBoard.vue';
import CluesPanel from '../components/game/CluesPanel.vue';
import VictoryModal from '../components/game/VictoryModal.vue';

// --- configuração do grid ---
interface Cell {
  isActive: boolean;
  letter: string;
  userInput: string;
  status: 'neutral' | 'correct' | 'wrong';
  number?: number;
  wordRefs: number[];
}

const ROWS = 18;
const COLS = 18;
const grid = reactive<Cell[][]>([]);
const activeClueId = ref<number | null>(null);
const gameWon = ref(false);

// dados das palavras
const words = [
  // horizontais
  { id: 1, word: 'PALEONTOLOGIA', direction: 'across', row: 8, col: 2, text: 'Ciência que estuda a vida do passado através de fósseis' },
  { id: 4, word: 'VELOCIRAPTOR', direction: 'across', row: 2, col: 2, text: 'Predador ágil famoso por caçar em bando (Jurassic Park)' },
  { id: 5, word: 'METEORO', direction: 'across', row: 5, col: 1, text: 'Causa provável da extinção em massa do Cretáceo' },
  { id: 6, word: 'FOSSIL', direction: 'across', row: 14, col: 5, text: 'Resto mineralizado de um ser vivo antigo' },
  // verticais
  { id: 2, word: 'TIRANOSSAURO', direction: 'down', row: 3, col: 6, text: 'O "Rei Lagarto Tirano", grande carnívoro do Cretáceo' },
  { id: 3, word: 'TRICERATOPS', direction: 'down', row: 1, col: 8, text: 'Herbívoro famoso por seus três chifres e escudo ósseo' }
];

const clues = reactive({
  across: words.filter(w => w.direction === 'across').map(w => ({ id: w.id, text: w.text, solved: false })),
  down: words.filter(w => w.direction === 'down').map(w => ({ id: w.id, text: w.text, solved: false }))
});

// inicializa a matriz do grid
const initGrid = () => {
  grid.splice(0, grid.length);
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < COLS; c++) {
      row.push({ isActive: false, letter: '', userInput: '', status: 'neutral', wordRefs: [] });
    }
    grid.push(row);
  }

  // preenche com as palavras definidas
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

// destaca a palavra ao clicar na dica
const highlightWordFromClue = (id: number) => {
  activeClueId.value = id;
  const word = words.find(w => w.id === id);
  if (word) {
    // força o foco via dom (hack necessário pois o grid é complexo)
    const el = document.getElementById(`cell-${word.row}-${word.col}`);
    el?.focus();
  }
};

// verifica se o usuário acertou tudo
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

// risca as dicas já resolvidas
const updateClueStatus = () => {
  const checkWord = (w: any) => {
    const letters = w.word.split('');
    for (let i = 0; i < letters.length; i++) {
      let r = w.row;
      let c = w.col;
      if (w.direction === 'across') c += i; else r += i;
      if (grid[r][c].userInput !== grid[r][c].letter) return false;
    }
    return true;
  };

  [...clues.across, ...clues.down].forEach(clue => {
    const wordDef = words.find(w => w.id === clue.id);
    if (wordDef) clue.solved = checkWord(wordDef);
  });
};

// reinicia o jogo
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
.bg-concrete {
  background-color: #dcdcdc;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
}
.danger-stripe {
  background: repeating-linear-gradient(45deg, #ffc107, #ffc107 20px, #1a1a1a 20px, #1a1a1a 40px);
  border-bottom: 2px solid #000;
  height: 20px;
}
</style>