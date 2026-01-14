<template>
  <div class="modal fade" id="createCommunityModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content fossil-card bg-dark border-warning shadow-sm">
        <!-- Header -->
        <div
          class="modal-header bg-dark text-warning fw-black border-bottom border-warning"
        >
          <h5 class="modal-title text-uppercase m-0">Criar Comunidade</h5>
          <button
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>

        <!-- Body -->
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

        <!-- Footer -->
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as bootstrap from "bootstrap";
import communityService from "../../services/communityService";

const name = ref("");
const description = ref("");

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

  await communityService.create({
    name: name.value,
    description: description.value,
  });

  location.reload();
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
</style>
