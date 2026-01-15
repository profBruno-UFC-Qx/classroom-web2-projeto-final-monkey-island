<template>
  <div class="min-vh-100 bg-concrete pb-5">
    
    <header class="bg-dark text-warning py-5 mb-5 shadow border-bottom border-warning">
      <div class="container text-center">
        <h1 class="display-4 fw-black text-uppercase tracking-widest text-shadow mb-2">
          <i class="bi bi-trophy-fill me-3"></i>Hall da Fama
        </h1>
        <p class="lead font-monospace text-light-fossil mb-0">
          > RELATÓRIO DE PRODUTIVIDADE E ENGAJAMENTO
        </p>
      </div>
    </header>

    <div class="container">
      
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3 text-muted font-monospace">Processando dados do sistema...</p>
      </div>

      <div v-else class="row g-5">
        
        <div class="col-lg-6">
          <div class="card fossil-card border-0 shadow-lg h-100 bg-dark-jungle">
            <div class="card-header bg-warning text-dark fw-black text-uppercase py-3">
              <i class="bi bi-person-lines-fill me-2"></i>Top Pesquisadores
            </div>
            <div class="card-body p-0">
              <ul class="list-group list-group-flush bg-transparent">
                <li 
                  v-for="(user, index) in topUsers" 
                  :key="user.id"
                  class="list-group-item bg-transparent border-bottom border-secondary py-3 px-4 d-flex align-items-center text-light"
                >
                  <div class="rank-badge me-3 fw-black font-monospace" :class="getRankClass(index)">
                    <span v-if="index < 3" class="fs-4"><i class="bi bi-trophy-fill"></i></span>
                    <span v-else>#{{ index + 1 }}</span>
                  </div>
                  
                  <div class="flex-grow-1">
                    <h5 class="fw-bold mb-1 text-warning">{{ user.name }}</h5>
                    <div class="progress" style="height: 6px; width: 100px;">
                      <div class="progress-bar bg-warning" :style="{ width: getPercentage(user.count, topUsers[0].count) + '%' }"></div>
                    </div>
                  </div>

                  <div class="text-end">
                    <div class="h4 mb-0 fw-black font-monospace">{{ user.count }}</div>
                    <small class="text-muted x-small text-uppercase">Posts</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card fossil-card border-0 shadow-lg h-100 bg-dark-jungle">
            <div class="card-header bg-primary text-white fw-black text-uppercase py-3 border-bottom border-dark">
              <i class="bi bi-collection-fill me-2"></i>Top Comunidades
            </div>
            <div class="card-body p-0">
              <ul class="list-group list-group-flush bg-transparent">
                <li 
                  v-for="(comm, index) in topCommunities" 
                  :key="comm.id"
                  class="list-group-item bg-transparent border-bottom border-secondary py-3 px-4 d-flex align-items-center text-light"
                >
                  <div class="rank-badge me-3 fw-black font-monospace" :class="getRankClass(index, true)">
                    <span v-if="index < 3" class="fs-4"><i class="bi bi-award-fill"></i></span>
                    <span v-else>#{{ index + 1 }}</span>
                  </div>
                  
                  <div class="flex-grow-1">
                    <h5 class="fw-bold mb-1 text-info">{{ comm.name }}</h5>
                    <div class="progress" style="height: 6px; width: 100px;">
                      <div class="progress-bar bg-info" :style="{ width: getPercentage(comm.count, topCommunities[0].count) + '%' }"></div>
                    </div>
                  </div>

                  <div class="text-end">
                    <div class="h4 mb-0 fw-black font-monospace">{{ comm.count }}</div>
                    <small class="text-muted x-small text-uppercase">Atividade</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <div v-if="!loading" class="text-center mt-5 opacity-50 font-monospace">
        <p class="small">
          <i class="bi bi-cpu me-2"></i>Análise baseada nos últimos {{ analyzedCount }} registros do banco de dados público.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import postService from '../services/postService';

interface RankItem { id: string; name: string; count: number; }

const loading = ref(true);
const topUsers = ref<RankItem[]>([]);
const topCommunities = ref<RankItem[]>([]);
const analyzedCount = ref(0);

// Helper para barra de progresso
const getPercentage = (value: number, max: number) => Math.round((value / max) * 100);

// Helper para cores das medalhas
const getRankClass = (index: number, isBlue = false) => {
  if (index === 0) return 'text-warning'; // Ouro
  if (index === 1) return 'text-light opacity-75'; // Prata
  if (index === 2) return 'text-danger'; // Bronze
  return isBlue ? 'text-info opacity-50' : 'text-light opacity-50';
};

const fetchRankings = async () => {
  try {
    loading.value = true;
    // Analisa uma amostra maior (ex: 200 posts) para a página dedicada
    const response = await postService.getPublicFeed(1, 200);
    const posts = response.data || [];
    analyzedCount.value = posts.length;

    const userMap = new Map<string, RankItem>();
    const commMap = new Map<string, RankItem>();

    posts.forEach(post => {
      // Users
      if (post.authorId && post.authorName) {
        const curr = userMap.get(post.authorId) || { id: post.authorId, name: post.authorName, count: 0 };
        curr.count++;
        userMap.set(post.authorId, curr);
      }
      // Communities
      if (post.communityId && post.communityName) {
        const curr = commMap.get(post.communityId) || { id: post.communityId, name: post.communityName, count: 0 };
        curr.count++;
        commMap.set(post.communityId, curr);
      }
    });

    // Ordenar e pegar Top 10
    topUsers.value = [...userMap.values()].sort((a, b) => b.count - a.count).slice(0, 10);
    topCommunities.value = [...commMap.values()].sort((a, b) => b.count - a.count).slice(0, 10);

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchRankings());
</script>

<style scoped>
.bg-concrete {
  background-color: #dcdcdc;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
}
.bg-dark-jungle { background-color: #1a2f2b; }
.fossil-card { border-radius: 4px; overflow: hidden; }
.text-light-fossil { color: #e8e2d9; }
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 3px; }
.text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); }
.x-small { font-size: 0.7rem; }
.rank-badge { width: 40px; text-align: center; }
</style>