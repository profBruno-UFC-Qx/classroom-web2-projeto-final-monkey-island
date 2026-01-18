<template>
  <div
    class="modal fade"
    id="communitiesModal"
    tabindex="-1"
    aria-hidden="true"
    ref="modalRef"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content bg-dark border-2 border-info shadow-lg">
        <div class="modal-header bg-black border-bottom border-info py-3">
          <div class="d-flex align-items-center gap-3">
            <div
              class="bg-info text-dark p-2 rounded-1 d-flex align-items-center justify-content-center"
              style="width: 45px; height: 45px"
            >
              <i class="bi bi-hdd-network-fill fs-3"></i>
            </div>
            <div>
              <h5
                class="modal-title fw-black text-uppercase text-light tracking-wide m-0 lh-1"
              >
                Rede de Setores
              </h5>
              <div class="d-flex align-items-center gap-2 mt-1">
                <span
                  class="badge bg-secondary font-monospace x-small rounded-0"
                >
                  <i class="bi bi-people-fill me-1"></i> ACCESS_LEVEL_1
                </span>
                <span class="text-secondary font-monospace x-small">
                  VINCULADO A:
                  <span class="text-info fw-bold"
                    >{{ totalItems }} SETORES</span
                  >
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body bg-concrete p-4">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-info mb-3" role="status"></div>
            <p class="text-muted font-monospace small blink-text">
              SINCRONIZANDO DADOS DA REDE...
            </p>
          </div>

          <div
            v-else-if="communities.length === 0"
            class="text-center py-5 opacity-50"
          >
            <i class="bi bi-diagram-2 display-1 text-secondary"></i>
            <h5 class="mt-3 text-uppercase fw-bold text-secondary">
              Sem afiliações
            </h5>
            <p class="small text-muted">
              Você ainda não ingressou em nenhum setor ou comunidade.
            </p>
          </div>

          <div v-else class="d-flex flex-column gap-3">
            <div
              v-for="community in communities"
              :key="community.id"
              @click="enterCommunity(community.id)"
              class="card bg-dark border-secondary community-card"
            >
              <div class="card-body d-flex align-items-center gap-3">
                <div
                  class="d-flex align-items-center justify-content-center bg-black border border-secondary rounded-1 position-relative"
                  style="width: 60px; height: 60px; min-width: 60px"
                >
                  <i class="bi bi-shield-shaded fs-3 text-info"></i>

                  <div
                    v-if="isOwner(community)"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark border border-dark shadow-sm"
                    title="Você é o administrador deste setor"
                  >
                    <i class="bi bi-crown-fill"></i>
                  </div>
                </div>

                <div class="flex-grow-1">
                  <div class="d-flex align-items-center gap-2">
                    <h6 class="text-white fw-bold text-uppercase m-0">
                      {{ community.name }}
                    </h6>
                    <span
                      v-if="isOwner(community)"
                      class="badge bg-warning text-dark x-small fw-bold"
                      >ADMIN</span
                    >
                  </div>

                  <p class="text-secondary x-small font-monospace mb-1">
                    REGISTRADO EM:
                    {{ new Date(community.createdAt).toLocaleDateString() }}
                  </p>
                  <p
                    class="text-light-50 small m-0 fst-italic text-truncate"
                    style="max-width: 400px"
                  >
                    {{ community.description }}
                  </p>
                </div>

                <button
                  class="btn btn-sm btn-outline-info rounded-0 fw-bold px-3"
                >
                  <i class="bi bi-box-arrow-in-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal-footer bg-black border-top border-secondary py-1 px-3"
        >
          <div class="d-flex w-100 justify-content-between align-items-center">
            <small class="text-muted font-monospace x-small text-uppercase">
              <i class="bi bi-broadcast me-1"></i> STATUS DA REDE: ONLINE
            </small>
            <button
              type="button"
              class="btn btn-sm btn-outline-light rounded-0 text-uppercase fw-bold px-4"
              data-bs-dismiss="modal"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as bootstrap from "bootstrap";
import communityService from "@/services/communityService";
import type { Community } from "@/types/community";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();

const authStore = useAuthStore();
const communities = ref<Community[]>([]);
const totalItems = ref(0);
const loading = ref(false);

const open = async () => {
  const modalEl = document.getElementById("communitiesModal");
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    await loadData();
  }
};

const enterCommunity = (communityId: string) => {
  const modalEl = document.getElementById("communitiesModal")!;
  bootstrap.Modal.getInstance(modalEl)?.hide();

  router.push(`/comunidades/${communityId}`);
};

const loadData = async () => {
  loading.value = true;
  try {
    const response = await communityService.getMyCommunities();
    communities.value = response.data;
    totalItems.value = response.totalItems;
  } catch (error) {
    console.error("Erro ao carregar comunidades:", error);
  } finally {
    loading.value = false;
  }
};

const isOwner = (community: Community) => {
  return community.ownerId === authStore.user?.id;
};

defineExpose({ open });
</script>

<style scoped>
.bg-concrete {
  background-color: #1a1a1a;
  background-image: radial-gradient(#2c3e50 1px, transparent 1px);
  background-size: 10px 10px;
}

.fw-black {
  font-weight: 900;
}
.x-small {
  font-size: 0.7rem;
  letter-spacing: 1px;
}

.community-card {
  transition: all 0.2s ease;
  border-left: 3px solid #0dcaf0;
}

.community-card:hover {
  transform: translateX(5px);
  border-color: #fff !important;
  background-color: #212529;
}

.blink-text {
  animation: blink 1.5s infinite;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
