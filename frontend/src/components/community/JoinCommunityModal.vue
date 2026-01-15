<template>
  <div class="modal fade" id="joinCommunityModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content fossil-card bg-dark border-warning shadow-sm">

        <div
          class="modal-header bg-dark text-warning fw-black border-bottom border-warning"
        >
          <h5 class="modal-title text-uppercase m-0">
            <i class="bi bi-diagram-3-fill me-2"></i> Comunidade
          </h5>
          <button
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>

        
        <div class="modal-body bg-light-industrial p-4">
          <h6 class="fw-black text-uppercase text-dark-jungle mb-2">
            {{ community?.name }}
          </h6>

          <p class="small text-muted font-monospace mb-4">
            >
            {{ community?.description || "Nenhuma descrição disponível." }}
          </p>

          <div
            v-if="checking"
            class="text-center small font-monospace text-muted"
          >
            <span class="spinner-border spinner-border-sm me-2"></span>
            Verificando credenciais...
          </div>

          <div v-else>
            <div
              v-if="isMember"
              class="alert alert-success fw-bold small text-center"
            >
              <i class="bi bi-check-circle-fill me-2"></i>
              Você já faz parte desta comunidade.
            </div>

            <div v-else class="alert alert-warning fw-bold small text-center">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Você ainda não faz parte desta comunidade.
            </div>
          </div>
        </div>

        <div class="modal-footer bg-dark border-top border-warning">
          <button
            v-if="!authStore.isAuthenticated"
            class="btn btn-warning w-100 py-2 fw-black text-uppercase"
            @click="goToLogin"
          >
            <i class="bi bi-shield-lock-fill me-2"></i>
            Fazer Login
          </button>

          <button
            v-else-if="isMember"
            class="btn btn-dark w-100 py-2 fw-black text-uppercase border-warning btn-terminal"
            @click="enterCommunity"
          >
            <i class="bi bi-box-arrow-in-right text-warning me-2"></i>
            Entrar na Comunidade
          </button>

          <button
            v-else
            class="btn btn-dark w-100 py-2 fw-black text-uppercase border-warning btn-terminal"
            @click="joinCommunity"
          >
            <i class="bi bi-plus-circle text-warning me-2"></i>
            Solicitar Entrada
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showToast"
    class="toast-success position-fixed bottom-0 start-50 translate-middle-x mb-4 p-3 rounded shadow-lg text-dark-jungle fw-bold"
  >
    {{ toastMessage }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as bootstrap from "bootstrap";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import communityService from "@/services/communityService";

const authStore = useAuthStore();
const router = useRouter();

const community = ref<any | null>(null);
const isMember = ref(false);
const checking = ref(false);

const showToast = ref(false);
const toastMessage = ref("");

const playDinoSound = () => {
  const audio = new Audio("/velociraptor.mp3");
  audio.play();
};

const open = async (data: any) => {
  community.value = data;
  isMember.value = false;
  checking.value = true;

  const modal = new bootstrap.Modal(
    document.getElementById("joinCommunityModal")!
  );
  modal.show();

  try {
    const res = await communityService.checkMembership(data.id);
    console.log(res.isMember);
    isMember.value = res.isMember;
  } catch {
    isMember.value = false;
  } finally {
    checking.value = false;
  }
};

const joinCommunity = async () => {
  await communityService.joinCommunity(community.value.id);

  toastMessage.value = `Você entrou na comunidade "${community.value.name}" 🦖`;
  showToast.value = true;
  playDinoSound();

  isMember.value = true;

  setTimeout(() => (showToast.value = false), 3000);
};

const enterCommunity = () => {
  const modalEl = document.getElementById("joinCommunityModal")!;
  bootstrap.Modal.getInstance(modalEl)?.hide();

  router.push(`/comunidades/${community.value.id}`);
};

const goToLogin = () => {
  router.push("/login");
};

defineExpose({ open });
</script>

<style scoped>
.fossil-card {
  border-radius: 2px;
  border-width: 2px;
}

.fw-black {
  font-weight: 900;
}

.bg-light-industrial {
  background-color: #f0f0f0;
}

.text-dark-jungle {
  color: #1a2f2b;
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

.modal {
  z-index: 1055 !important;
}

.modal-backdrop {
  z-index: 1050 !important;
}

.toast-success {
  background: linear-gradient(135deg, #ffc107, #fff);
  border: 2px solid #ffc107;
  animation: bounceIn 0.6s ease forwards;
  z-index: 1055;
  text-align: center;
  min-width: 250px;
}

@keyframes bounceIn {
  0% {
    transform: translateY(100%) scale(0.5);
    opacity: 0;
  }
  60% {
    transform: translateY(-10%) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
