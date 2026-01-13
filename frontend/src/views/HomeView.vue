<template>
  <div class="home-layout min-vh-100 bg-concrete">
    
    <AppNavbar />

    <div class="danger-stripe shadow-sm">
      <div class="container-fluid d-flex justify-content-center align-items-center overflow-hidden py-1">
      </div>
    </div>

    <header class="hero-section py-5 mb-5 shadow-lg position-relative">
      <div class="overlay-grid"></div> 
      <div class="container position-relative z-1 text-center">
        <div class="d-inline-block border border-warning border-3 p-4 bg-dark-transparent backdrop-blur rounded-1">
          <h1 class="display-5 fw-black text-warning text-uppercase mb-0 tracking-widest text-shadow">
            <i class="bi bi-terminal-fill me-3"></i>Terminal Central
          </h1>
          <div class="d-flex align-items-center justify-content-center gap-2 mt-2">
            <span class="badge bg-danger rounded-0 text-uppercase">Restrito</span>
            <span class="text-light-fossil font-monospace small text-uppercase">Sistema Operacional v4.0</span>
          </div>
        </div>
      </div>
    </header>

    <div class="container pb-5">
      <div class="row g-4">
        
        <div class="col-lg-8">
          
          <div class="d-flex align-items-center mb-4 pb-2 border-bottom border-dark-subtle">
             <i class="bi bi-broadcast fs-3 text-danger me-3 animate-pulse"></i>
             <h4 class="fw-black text-uppercase m-0 text-dark-jungle tracking-wide">Relatórios de Campo</h4>
          </div>

          <div v-if="canCreatePost" class="card fossil-card mb-5 p-0 bg-white border-0 shadow-sm position-relative overflow-hidden">
            <div class="top-folder-tab bg-warning px-3 py-1 d-inline-block fw-bold small text-dark border-top border-start border-end border-dark">
              NOVO REGISTRO
            </div>
            <div class="card-body p-4 border border-dark bg-light-industrial">
              <h5 class="fw-black text-uppercase mb-3 text-dark-jungle">
                <i class="bi bi-file-earmark-medical-fill text-danger me-2"></i>Catalogar Descoberta
              </h5>
              <p class="text-secondary small font-monospace mb-3">
                > Insira os dados da observação para o banco de dados central...
              </p>
              
              <button 
                class="btn btn-dark w-100 py-2 fw-black text-uppercase border-warning btn-terminal"
                @click="isCreateModalOpen = true"
              >
                <i class="bi bi-upload me-2 text-warning"></i>Enviar Dados
              </button>
              </div>
          </div>

          <div v-else-if="!authStore.isAuthenticated" class="card fossil-card mb-5 bg-danger-subtle border-danger border-2 shadow-sm">
            <div class="card-body p-4 d-flex align-items-center gap-4">
              <div class="bg-danger text-white p-3 rounded-1 d-flex align-items-center justify-content-center shadow border border-white" style="width: 64px; height: 64px;">
                 <i class="bi bi-hand-index-thumb-fill fs-2"></i>
              </div>
              <div>
                <h5 class="fw-black text-danger text-uppercase m-0 mb-1">Acesso Negado</h5>
                <p class="small text-dark fw-bold m-0 mb-3 opacity-75 font-monospace">
                  "ERR_AUTH_FAIL: Credenciais de nível 1 necessárias."<br>
                  Identifique-se no terminal de segurança.
                </p>
                <router-link to="/login" class="btn btn-sm btn-dark text-warning fw-bold text-uppercase px-4 rounded-0 shadow">
                  <i class="bi bi-shield-lock me-2"></i>Inserir Senha
                </router-link>
              </div>
            </div>
          </div>

          <div v-else class="card fossil-card mb-5 bg-secondary-subtle border-secondary border-2 shadow-sm">
            <div class="card-body p-3 d-flex align-items-center gap-3">
               <i class="bi bi-eye-slash-fill fs-3 text-secondary"></i>
               <div>
                 <h6 class="fw-bold text-dark text-uppercase m-0">Modo Observador</h6>
                 <small class="text-muted font-monospace">Você não possui credenciais de pesquisador para catalogar novas descobertas.</small>
               </div>
            </div>
          </div>

          <!-- FEED Paginado (substitui o bloco antigo de feed) -->
          <div v-if="isLoading && posts.length === 0" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
            <p class="mt-2 text-muted font-monospace small">Sincronizando feed de dados...</p>
          </div>

          <div v-else class="d-flex flex-column gap-4">
            <div v-if="posts.length === 0 && !isLoading" class="text-center py-5 opacity-50 border border-secondary border-dashed rounded-1">
              <i class="bi bi-broadcast-pin fs-1 text-secondary"></i>
              <p class="mt-2 text-uppercase fw-bold text-secondary font-monospace">
                Nenhum registro encontrado no setor.
              </p>
            </div>

            <transition-group name="list" tag="div" class="d-flex flex-column gap-4">
              <PostCard
                v-for="post in posts"
                :key="post.id"
                :post="post"
              />
            </transition-group>

            <div v-if="page < totalPages" class="text-center mt-4 mb-5">
              <button
                @click="loadMore"
                class="btn btn-outline-dark rounded-pill px-5 py-2 fw-bold text-uppercase"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Processando...' : 'Carregar Arquivos Mais Antigos' }}
              </button>
            </div>

            <div v-else-if="posts.length > 0" class="text-center mt-4 mb-5 text-muted font-monospace small">
              --- FIM DOS REGISTROS ---
            </div>
          </div>

        </div>

        <div class="col-lg-4">
          <GameWidget />
          
          <div class="card fossil-card border-2 border-dark p-0 overflow-hidden mb-4 shadow-sm">
            <div class="card-header bg-dark text-warning fw-black text-uppercase border-bottom border-warning rounded-0 p-3">
              <i class="bi bi-cpu-fill me-2"></i>Status do Parque
            </div>
            <div class="card-body bg-light-industrial font-monospace small fw-bold">
              <ul class="list-unstyled m-0 text-dark-jungle">
                <li class="d-flex justify-content-between mb-2 pb-2 border-bottom border-secondary-subtle">
                  <span><i class="bi bi-lightning-charge me-1"></i>Rede Elétrica</span> 
                  <span class="text-success">98% [ESTÁVEL]</span>
                </li>
                <li class="d-flex justify-content-between mb-2 pb-2 border-bottom border-secondary-subtle">
                  <span><i class="bi bi-eye me-1"></i>Sensores</span> 
                  <span class="text-warning">FALHA SETOR 7</span>
                </li>
                <li class="d-flex justify-content-between">
                  <span><i class="bi bi-cone-striped me-1"></i>Paddock T-Rex</span> 
                  <span class="text-danger animate-pulse">ALERTA</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="text-center opacity-50 mt-4">
            <i class="bi bi-x-diamond-fill fs-1 text-secondary"></i>
            <p class="x-small text-uppercase fw-bold text-secondary mt-1">InGen Technologies</p>
          </div>
        </div>

      </div>
    </div>

    <AuthAlertModal />

    <CreatePostModal 
      v-if="canCreatePost"
      :is-open="isCreateModalOpen" 
      @close="isCreateModalOpen = false"
      @post-created="handlePostCreated"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import AppNavbar from '../components/AppNavbar.vue';
import GameWidget from '../components/widgets/GameWidget.vue';
import AuthAlertModal from '../components/modals/AuthAlertModal.vue';
import CreatePostModal from '../components/modals/CreatePostModal.vue'; 
import PostCard from '../components/feed/PostCard.vue';
import postService from '../services/postService';
import type { Post } from '../types/post';

const authStore = useAuthStore();

/* Feed paginado */
const posts = ref<Post[]>([]);
const page = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);
const itemsPerPage = 10;

/* Modal e permissões */
const isCreateModalOpen = ref(false);

const canCreatePost = computed(() => {
  return authStore.isAuthenticated && 
         (authStore.user?.role === 'researcher' || authStore.user?.role === 'admin');
});

/**
 * fetchFeed - carrega a página atual do feed
 * reset = true -> reinicia paginação e lista (útil ao logar/deslogar ou after-create)
 */
const fetchFeed = async (reset = false) => {
  if (isLoading.value) return;
  isLoading.value = true;

  if (reset) {
    page.value = 1;
    posts.value = [];
  }

  try {
    let response;
    // Se autenticado -> buscar feed do usuário (paginado)
    // Se não autenticado -> buscar feed público (paginado)
    if (authStore.isAuthenticated) {
      response = await postService.getUserFeed(page.value, itemsPerPage);
    } else {
      response = await postService.getPublicFeed(page.value, itemsPerPage);
    }

    // segurança: suporte a diferentes formatos de resposta
    const data = response?.data ?? [];
    const tp = response?.totalPages ?? response?.total_pages ?? 1;

    totalPages.value = tp;

    if (reset) {
      posts.value = data;
    } else {
      // evita duplicatas
      const newPosts = data.filter(
        newP => !posts.value.some(existingP => existingP.id === newP.id)
      );
      posts.value.push(...newPosts);
    }
  } catch (error) {
    console.error('Erro ao sincronizar feed:', error);
  } finally {
    isLoading.value = false;
  }
};

const loadMore = () => {
  if (page.value < totalPages.value && !isLoading.value) {
    page.value++;
    fetchFeed(false);
  }
};

const handlePostCreated = async () => {
  isCreateModalOpen.value = false;
  await fetchFeed(true);
};

onMounted(() => {
  fetchFeed(true);
});

watch(() => authStore.isAuthenticated, () => {
  fetchFeed(true);
});
</script>

<style scoped>
/* CORES DO TEMA */
.text-dark-jungle { color: #1a2f2b; }
.text-light-fossil { color: #e8e2d9; }
.bg-concrete { background-color: #dcdcdc; background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E"); }
.bg-light-industrial { background-color: #f0f0f0; }

.border-dashed { border-style: dashed !important; }

.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 3px; }
.tracking-wide { letter-spacing: 1px; }
.text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }

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

.hero-section {
  background-color: #2c3e50;
  background-image: linear-gradient(rgba(26, 47, 43, 0.9), rgba(26, 47, 43, 0.8)), url('https://www.transparenttextures.com/patterns/dark-matter.png');
  border-bottom: 4px solid #ffc107;
}

.overlay-grid {
  position: absolute;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center;
  opacity: 0.1;
  pointer-events: none;
}

.bg-dark-transparent { background-color: rgba(0, 0, 0, 0.6); }
.backdrop-blur { backdrop-filter: blur(5px); }

.btn-terminal {
  transition: all 0.3s;
}
.btn-terminal:hover {
  background-color: #1a1a1a;
  border-color: #ffc107;
  color: #ffc107;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}

.fossil-card {
  border-radius: 2px;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

.x-small { font-size: 0.7rem; letter-spacing: 1px; }

/* Animação de entrada da lista (do feed) */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
