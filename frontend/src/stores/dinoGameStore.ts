import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import type { Cell, WordDefinition, CluesState } from '../types/game';

// Dados estáticos das palavras (podem vir de uma API no futuro)
const WORDS: WordDefinition[] = [
  // horizontais
  { id: 1, word: 'PALEONTOLOGIA', direction: 'across', row: 8, col: 2, text: 'Ciência que estuda a vida do passado através de fósseis' },
  { id: 4, word: 'VELOCIRAPTOR', direction: 'across', row: 2, col: 2, text: 'Predador ágil famoso por caçar em bando (Jurassic Park)' },
  { id: 5, word: 'METEORO', direction: 'across', row: 5, col: 1, text: 'Causa provável da extinção em massa do Cretáceo' },
  { id: 6, word: 'FOSSIL', direction: 'across', row: 14, col: 5, text: 'Resto mineralizado de um ser vivo antigo' },
  // verticais
  { id: 2, word: 'TIRANOSSAURO', direction: 'down', row: 3, col: 6, text: 'O "Rei Lagarto Tirano", grande carnívoro do Cretáceo' },
  { id: 3, word: 'TRICERATOPS', direction: 'down', row: 1, col: 8, text: 'Herbívoro famoso por seus três chifres e escudo ósseo' }
];

export const useDinoGameStore = defineStore('dinoGame', () => {
  // --- Estado ---
  const ROWS = 18;
  const COLS = 18;
  
  const grid = reactive<Cell[][]>([]);
  const activeClueId = ref<number | null>(null);
  const gameWon = ref(false);
  
  const clues = reactive<CluesState>({
    across: [],
    down: []
  });

  // --- Actions ---

  const initGrid = () => {
    // 1. Limpa e cria o grid vazio
    grid.splice(0, grid.length);
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({ 
          isActive: false, 
          letter: '', 
          userInput: '', 
          status: 'neutral', 
          wordRefs: [] 
        });
      }
      grid.push(row);
    }

    // 2. Preenche com as palavras
    WORDS.forEach(w => {
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

    // 3. Inicializa as dicas
    clues.across = WORDS.filter(w => w.direction === 'across').map(w => ({ id: w.id, text: w.text, solved: false }));
    clues.down = WORDS.filter(w => w.direction === 'down').map(w => ({ id: w.id, text: w.text, solved: false }));
    
    gameWon.value = false;
    activeClueId.value = null;
  };

  const checkAnswers = () => {
    let allCorrect = true;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell.isActive) {
          if (cell.userInput.toUpperCase() === cell.letter) {
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
    const checkWord = (w: WordDefinition) => {
      const letters = w.word.split('');
      for (let i = 0; i < letters.length; i++) {
        let r = w.row;
        let c = w.col;
        if (w.direction === 'across') c += i; else r += i;
        if (grid[r][c].userInput.toUpperCase() !== grid[r][c].letter) return false;
      }
      return true;
    };

    [...clues.across, ...clues.down].forEach(clue => {
      const wordDef = WORDS.find(w => w.id === clue.id);
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

  const setActiveClue = (id: number | null) => {
    activeClueId.value = id;
  };

  // Helper para a view saber onde focar
  const getWordDefinition = (id: number) => WORDS.find(w => w.id === id);

  return {
    ROWS,
    COLS,
    grid,
    activeClueId,
    gameWon,
    clues,
    initGrid,
    checkAnswers,
    resetGame,
    setActiveClue,
    getWordDefinition
  };
});