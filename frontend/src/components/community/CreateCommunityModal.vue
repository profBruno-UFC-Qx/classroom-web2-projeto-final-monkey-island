<template>
  <div class="modal fade" id="createCommunityModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header">
          <h5 class="fw-black text-uppercase">Criar Comunidade</h5>
          <button
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>

        <div class="modal-body">
          <input v-model="name" class="form-control mb-3" placeholder="Nome" />
          <textarea
            v-model="description"
            class="form-control"
            placeholder="Descrição"
          ></textarea>
        </div>

        <div class="modal-footer">
          <button class="btn btn-success fw-black" @click="submit">
            Criar
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
  await communityService.create({
    name: name.value,
    description: description.value,
  });
  location.reload();
};

defineExpose({ open });
</script>

<style scoped>
.fw-black {
  font-weight: 900;
}
</style>
