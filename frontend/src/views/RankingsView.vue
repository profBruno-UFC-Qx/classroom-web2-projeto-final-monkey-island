<template>
  <div class="ranking-layout min-vh-100 pb-5">
    
    <header class="bg-dark text-warning py-5 mb-5 shadow border-bottom border-warning">
      <div class="container text-center">
        <h1 class="display-4 fw-bold text-uppercase mb-2">
          <i class="bi bi-trophy-fill me-3"></i>Hall da Fama
        </h1>
        <p class="lead font-monospace text-light mb-0">
          > RELATÓRIO DE PRODUTIVIDADE E ENGAJAMENTO
        </p>
      </div>
    </header>

    <div class="container">
      
      <div v-if="postStore.loadingRankings" class="text-center py-5">
        <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3 text-muted font-monospace">processando dados do sistema...</p>
      </div>

      <div v-else class="row g-5">
        
        <div class="col-lg-6">
          <RankingCard 
            title="Top Pesquisadores" 
            icon="bi-person-lines-fill" 
            theme="yellow"
            label="Posts"
            :items="postStore.topUsers" 
          />
        </div>

        <div class="col-lg-6">
          <RankingCard 
            title="Top Comunidades" 
            icon="bi-collection-fill" 
            theme="blue"
            label="Atividade"
            :items="postStore.topCommunities" 
          />
        </div>

      </div>

      <div v-if="!postStore.loadingRankings" class="text-center mt-5 opacity-50 font-monospace">
        <p class="small">
          <i class="bi bi-cpu me-2"></i>análise baseada nos últimos {{ postStore.analyzedCount }} registros.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePostStore } from '../stores/postStore';
import RankingCard from '../components/RankingCard.vue';

const postStore = usePostStore();

onMounted(() => {
  postStore.fetchRankings();
});
</script>

<style scoped>
.ranking-layout {
  background-color: #dcdcdc;
}
</style>