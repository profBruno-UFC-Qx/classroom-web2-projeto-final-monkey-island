<template>
  <div class="modal fade" id="createCommunityModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content fossil-card bg-dark border-warning shadow-sm">
        <div
          class="modal-header bg-dark text-warning fw-black border-bottom border-warning"
        >
          <h5 class="modal-title text-uppercase m-0">Criar Comunidade</h5>
          <button
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>

        <div class="modal-body bg-light-industrial p-4">
          <input
            v-model="name"
            class="form-control mb-3 text-dark-jungle fw-bold"
            placeholder="Nome da comunidade"
          />
          <textarea
            v-model="description"
            class="form-control text-dark-jungle fw-bold"
            placeholder="Descrição"
          ></textarea>
        </div>

        <div class="modal-footer bg-dark border-top border-warning">
          <button
            class="btn btn-dark w-100 py-2 fw-black text-uppercase border-warning btn-terminal"
            @click="submit"
          >
            <i class="bi bi-plus-circle text-warning me-2"></i> Criar
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
import communityService from "@/services/communityService";

const name = ref("");
const description = ref("");

const toastMessage = ref("");
const showToast = ref(false);

const playDinoSound = () => {
  const audio = new Audio("/velociraptor.mp3");
  audio.play();
};

const open = () => {
  const modal = new bootstrap.Modal(
    document.getElementById("createCommunityModal")!
  );
  modal.show();
};

const submit = async () => {
  if (!name.value.trim()) {
    alert("O nome da comunidade é obrigatório!");
    return;
  }

  await communityService.createCommunity({
    name: name.value,
    description: description.value,
  });

  toastMessage.value = `Comunidade "${name.value}" criada com sucesso! 🎉`;
  showToast.value = true;
  playDinoSound();

  name.value = "";
  description.value = "";

  setTimeout(() => {
    showToast.value = false;
  }, 3000);

  const modalEl = document.getElementById("createCommunityModal")!;
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  modalInstance?.hide();
};
defineExpose({ open });
</script>

<style scoped>
.fossil-card {
  border-radius: 2px;
  border-width: 2px;
  transition: all 0.2s ease;
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

.form-control {
  border: 2px solid #ffc107;
  border-radius: 2px;
  background-color: #f0f0f0;
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
  80% {
    transform: translateY(5%) scale(0.95);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
