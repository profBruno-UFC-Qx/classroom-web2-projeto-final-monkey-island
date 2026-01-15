<template>
  <div class="community-layout min-vh-100 bg-concrete">
    <header class="hero-section py-5 mb-5 shadow-lg position-relative">
      <div class="overlay-grid"></div>
      <div class="container position-relative z-1 text-center">
        <div
          class="d-inline-block border border-warning border-3 p-4 bg-dark-transparent backdrop-blur rounded-1"
        >
          <h1
            class="display-5 fw-black text-warning text-uppercase mb-0 tracking-widest text-shadow"
          >
            <i class="bi bi-diagram-3-fill me-3"></i
            >{{ community?.name || "Comunidade" }}
          </h1>
          <div class="mt-2">
            <span class="text-light-fossil font-monospace small text-uppercase">
              {{ community?.description || "Descrição não disponível." }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <div class="container pb-5">
      <div class="row g-4">
        <div class="col-lg-8">
          <div
            v-if="canCreatePost"
            class="card fossil-card mb-5 p-0 bg-white border-0 shadow-sm position-relative overflow-hidden"
          >
            <div
              class="top-folder-tab bg-warning px-3 py-1 d-inline-block fw-bold small text-dark border-top border-start border-end border-dark"
            >
              NOVO POST
            </div>
            <div class="card-body p-4 border border-dark bg-light-industrial">
              <h5 class="fw-black text-uppercase mb-3 text-dark-jungle">
                <i class="bi bi-file-earmark-medical-fill text-danger me-2"></i>
                Criar Novo Registro
              </h5>
              <p class="text-secondary small font-monospace mb-3">
                > Insira os dados da observação para esta comunidade...
              </p>
              <button
                class="btn btn-dark w-100 py-2 fw-black text-uppercase border-warning btn-terminal"
                @click="isCreateModalOpen = true"
              >
                <i class="bi bi-upload me-2 text-warning"></i>Enviar
              </button>
            </div>
          </div>

          <!-- Aviso para não autenticados -->
          <div
            v-else-if="!authStore.isAuthenticated"
            class="card fossil-card mb-5 bg-danger-subtle border-danger border-2 shadow-sm"
          >
            <div class="card-body p-4 d-flex align-items-center gap-4">
              <div
                class="bg-danger text-white p-3 rounded-1 d-flex align-items-center justify-content-center shadow border border-white"
                style="width: 64px; height: 64px"
              >
                <i class="bi bi-hand-index-thumb-fill fs-2"></i>
              </div>
              <div>
                <h5 class="fw-black text-danger text-uppercase m-0 mb-1">
                  Acesso Negado
                </h5>
                <p
                  class="small text-dark fw-bold m-0 mb-3 opacity-75 font-monospace"
                >
                  "ERR_AUTH_FAIL: Credenciais de nível 1 necessárias."<br />
                  Identifique-se no terminal de segurança.
                </p>
                <router-link
                  to="/login"
                  class="btn btn-sm btn-dark text-warning fw-bold text-uppercase px-4 rounded-0 shadow"
                >
                  <i class="bi bi-shield-lock me-2"></i>Inserir Senha
                </router-link>
              </div>
            </div>
          </div>

          <!-- Feed de Posts -->
          <div v-if="isLoading && posts.length === 0" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
            <p class="mt-2 text-muted font-monospace small">
              Sincronizando feed da comunidade...
            </p>
          </div>

          <div v-else class="d-flex flex-column gap-4">
            <div
              v-if="posts.length === 0 && !isLoading"
              class="text-center py-5 opacity-50 border border-secondary border-dashed rounded-1"
            >
              <i class="bi bi-broadcast-pin fs-1 text-secondary"></i>
              <p
                class="mt-2 text-uppercase fw-bold text-secondary font-monospace"
              >
                Nenhum registro encontrado nesta comunidade.
              </p>
            </div>

            <transition-group
              name="list"
              tag="div"
              class="d-flex flex-column gap-4"
            >
              <PostCard v-for="post in posts" :key="post.id" :post="post" />
            </transition-group>

            <div v-if="page < totalPages" class="text-center mt-4 mb-5">
              <button
                @click="loadMore"
                class="btn btn-outline-dark rounded-pill px-5 py-2 fw-bold text-uppercase"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ isLoading ? "Processando..." : "Carregar Mais" }}
              </button>
            </div>

            <div
              v-else-if="posts.length > 0"
              class="text-center mt-4 mb-5 text-muted font-monospace small"
            >
              --- FIM DOS REGISTROS ---
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div
            class="card fossil-card border-2 border-dark p-0 overflow-hidden mb-4 shadow-sm"
          >
            <div
              class="card-header bg-dark text-warning fw-black text-uppercase border-bottom border-warning rounded-0 p-3"
            >
              <i class="bi bi-info-circle-fill me-2"></i>Sobre a Comunidade
            </div>
            <div
              class="card-body bg-light-industrial font-monospace small fw-bold"
            >
              <p>
                <strong>Membros:</strong> {{ community?.memberCount ?? "—" }}
              </p>
              <p>
                <strong>Criada em:</strong>
                {{ formatDate(community?.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreatePostModal
      v-if="canCreatePost"
      :is-open="isCreateModalOpen"
      :community-id="communityId"
      @close="isCreateModalOpen = false"
      @post-created="handlePostCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import PostCard from "../components/feed/PostCard.vue";
import CreatePostModal from "../components/modals/CreatePostModal.vue";
import postService from "../services/postService";
import communityService from "../services/communityService";
import type { Post } from "../types/post";

const authStore = useAuthStore();
const route = useRoute();

const props = defineProps<{
  id: string;
}>();

const communityId = ref<string>(props.id || "");

const posts = ref<Post[]>([]);
const page = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);
const itemsPerPage = 10;

const community = ref<any>(null);

const isCreateModalOpen = ref(false);

const canCreatePost = computed(() => {
  return authStore.isAuthenticated && authStore.user?.role === "researcher";
});

const fetchCommunity = async () => {
  try {
    const res = await communityService.getCommunityById(communityId.value);
    community.value = res;
  } catch (err) {
    console.error("Erro ao buscar comunidade:", err);
  }
};

const fetchPosts = async (reset = false) => {
  if (isLoading.value) return;
  isLoading.value = true;

  if (reset) {
    page.value = 1;
    posts.value = [];
  }

  try {
    const res = await postService.recentPostsInCommunity(
      communityId.value,
      page.value,
      itemsPerPage
    );
    const data = res?.data ?? [];
    const tp = res?.totalPages ?? 1;
    totalPages.value = tp;

    if (reset) {
      posts.value = data;
    } else {
      const newPosts = data.filter(
        (p) => !posts.value.some((ep) => ep.id === p.id)
      );
      posts.value.push(...newPosts);
    }
  } catch (err) {
    console.error("Erro ao buscar posts:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadMore = () => {
  if (page.value < totalPages.value && !isLoading.value) {
    page.value++;
    fetchPosts(false);
  }
};

const handlePostCreated = async () => {
  isCreateModalOpen.value = false;
  await fetchPosts(true);
};

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pt-BR");
};

onMounted(async () => {
  await fetchCommunity();
  await fetchPosts(true);
});
</script>

<style scoped>
.bg-concrete {
  background-color: #dcdcdc;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
}
.bg-light-industrial {
  background-color: #f0f0f0;
}
.fw-black {
  font-weight: 900;
}
.fossil-card {
  border-radius: 2px;
}
.btn-terminal {
  transition: all 0.3s;
}
.btn-terminal:hover {
  background-color: #1a1a1a;
  border-color: #ffc107;
  color: #ffc107;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}
.tracking-widest {
  letter-spacing: 3px;
}
.tracking-wide {
  letter-spacing: 1px;
}
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}
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
