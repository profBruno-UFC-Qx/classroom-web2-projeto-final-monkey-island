<template>
  <div class="game-layout min-vh-100 bg-concrete">
    <div class="danger-stripe shadow-sm"></div>

    <DinoGameHero />

    <div class="container-fluid px-4 pb-5">
      <div class="row g-4 justify-content-center">
        <div class="col-xl-7 col-lg-8">
          <CrosswordBoard
            :grid="gameStore.grid"
            :rows="gameStore.ROWS"
            :cols="gameStore.COLS"
            :active-clue-id="gameStore.activeClueId"
            @reset="gameStore.resetGame"
            @check="gameStore.checkAnswers"
            @focus-clue="gameStore.setActiveClue($event)"
          />
        </div>

        <div class="col-xl-4 col-lg-4">
          <CluesPanel
            :clues="gameStore.clues"
            :active-clue-id="gameStore.activeClueId"
            @select-clue="handleSelectClue"
          />
        </div>
      </div>
    </div>

    <VictoryModal :show="gameStore.gameWon" @reset="gameStore.resetGame" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useDinoGameStore } from "../stores/dinoGameStore";

import DinoGameHero from "@/components/game/DinoGameHero.vue";
import CrosswordBoard from "@/components/game/CrosswordBoard.vue";
import CluesPanel from "@/components/game/CluesPanel.vue";
import VictoryModal from "@/components/game/VictoryModal.vue";

const gameStore = useDinoGameStore();

// Lógica de UI (manipulação do DOM) permanece na View ou Componente,
// pois a Store não deve saber que existe um "document" ou "focus".
const handleSelectClue = (id: number) => {
  gameStore.setActiveClue(id);

  const word = gameStore.getWordDefinition(id);
  if (word) {
    // Hack de foco mantido aqui, pois é responsabilidade visual
    const el = document.getElementById(`cell-${word.row}-${word.col}`);
    el?.focus();
  }
};

onMounted(() => {
  gameStore.initGrid();
});
</script>

<style scoped>
.bg-concrete {
  background-color: #dcdcdc;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
}
.danger-stripe {
  background: repeating-linear-gradient(
    45deg,
    #ffc107,
    #ffc107 20px,
    #1a1a1a 20px,
    #1a1a1a 40px
  );
  border-bottom: 2px solid #000;
  height: 20px;
}
</style>
