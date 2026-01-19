export interface Cell {
  isActive: boolean;
  letter: string;
  userInput: string;
  status: 'neutral' | 'correct' | 'wrong';
  number?: number;
  wordRefs: number[];
}

export interface WordDefinition {
  id: number;
  word: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
  text: string;
}

export interface Clue {
  id: number;
  text: string;
  solved: boolean;
}

export interface CluesState {
  across: Clue[];
  down: Clue[];
}