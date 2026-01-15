<template>
  <div v-if="isOpen">
    <div
      class="modal-backdrop fade show d-block"
      style="background-color: rgba(0, 0, 0, 0.8)"
    ></div>

    <div class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div
          class="modal-content bg-light-industrial border-2 border-warning shadow-lg rounded-0"
        >
          <div
            class="modal-header bg-dark text-warning border-bottom border-warning rounded-0"
          >
            <h5 class="modal-title fw-black text-uppercase tracking-wide">
              <i class="bi bi-terminal-plus me-2"></i>Nova Descoberta
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
              :disabled="isSubmitting"
            ></button>
          </div>

          <div class="modal-body p-4">
            <div class="mb-4" v-if="!communityId">
              <label
                class="form-label fw-bold text-dark-jungle text-uppercase small"
              >
                <i class="bi bi-people-fill me-1"></i>Setor (Comunidade)
              </label>
              <select
                v-model="selectedCommunityId"
                class="form-select border-dark rounded-0 font-monospace shadow-sm"
                :disabled="isSubmitting"
              >
                <option value="" disabled>Selecione onde catalogar...</option>
                <option
                  v-for="community in myCommunities"
                  :key="community.id"
                  :value="community.id"
                >
                  {{ community.name }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label
                class="form-label fw-bold text-dark-jungle text-uppercase small"
              >
                <i class="bi bi-type-h1 me-1"></i>Título do Relatório
              </label>
              <input
                v-model="postTitle"
                type="text"
                class="form-control border-dark rounded-0 font-monospace shadow-sm"
                placeholder="Ex: Análise de Fósseis - Setor 7 (Mín. 5 caracteres)"
                :disabled="isSubmitting"
              />
            </div>

            <div class="mb-4">
              <label
                class="form-label fw-bold text-dark-jungle text-uppercase small"
              >
                <i class="bi bi-file-text-fill me-1"></i>Relatório de Campo
              </label>
              <textarea
                v-model="postContent"
                class="form-control border-dark rounded-0 font-monospace shadow-sm"
                rows="5"
                placeholder="Descreva sua descoberta científica..."
                :disabled="isSubmitting"
              ></textarea>
            </div>

            <div class="mb-4">
              <label
                class="form-label fw-bold text-dark-jungle text-uppercase small"
              >
                <i class="bi bi-camera-fill me-1"></i>Evidências Fotográficas
                (Máx: 5)
              </label>
              <input
                type="file"
                class="form-control border-dark rounded-0 font-monospace shadow-sm"
                multiple
                accept="image/*"
                @change="handleFileUpload"
                :disabled="isSubmitting"
              />
              <div class="mt-2 d-flex gap-2 flex-wrap">
                <span
                  v-for="file in selectedFiles"
                  :key="file.name"
                  class="badge bg-secondary rounded-0"
                >
                  {{ file.name }}
                </span>
              </div>
            </div>

            <div
              v-if="errorMessage"
              class="alert alert-danger rounded-0 small font-monospace"
            >
              <i class="bi bi-exclamation-triangle-fill me-2"></i
              >{{ errorMessage }}
            </div>
          </div>

          <div class="modal-footer bg-light border-top border-dark">
            <button
              type="button"
              class="btn btn-outline-dark rounded-0 fw-bold text-uppercase"
              @click="closeModal"
              :disabled="isSubmitting"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-warning border-dark rounded-0 fw-black text-uppercase px-4 shadow-sm"
              @click="submitPost"
              :disabled="isSubmitting || !isValid"
            >
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              <span v-else
                ><i class="bi bi-upload me-2"></i>Arquivar Dados</span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import communityService from "../../services/communityService";
import postService from "../../services/postService";
import type { Community } from "../../types/community";
import { isAxiosError } from "axios";

const props = defineProps<{
  isOpen: boolean;
  communityId?: string;
}>();

const emit = defineEmits(["close", "post-created"]);

const myCommunities = ref<Community[]>([]);
const selectedCommunityId = ref("");
const postTitle = ref("");
const postContent = ref("");
const selectedFiles = ref<File[]>([]);
const isSubmitting = ref(false);
const errorMessage = ref("");

const isValid = computed(() => {
  return (
    selectedCommunityId.value !== "" &&
    postTitle.value.trim().length >= 5 &&
    postContent.value.trim() !== ""
  );
});

onMounted(async () => {
  if (!props.communityId) {
    try {
      const response = await communityService.getMyCommunities();
      myCommunities.value = response.data;
    } catch (error) {
      console.error("Erro ao carregar comunidades", error);
      errorMessage.value = "Falha ao carregar lista de comunidades.";
    }
  } else {
    selectedCommunityId.value = props.communityId;
  }
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const filesArray = Array.from(target.files);
    if (filesArray.length > 5) {
      errorMessage.value = "Máximo de 5 imagens permitidas.";
      target.value = "";
      selectedFiles.value = [];
      return;
    }
    selectedFiles.value = filesArray;
    errorMessage.value = "";
  }
};

const submitPost = async () => {
  if (!isValid.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const newPost = await postService.createDraft(
      selectedCommunityId.value,
      postTitle.value,
      postContent.value
    );

    if (selectedFiles.value.length > 0) {
      await postService.uploadMedia(newPost.id, selectedFiles.value);
    }

    await postService.publishPost(newPost.id);

    emit("post-created");
    closeModal();
  } catch (error: any) {
    console.error("Erro ao criar post:", error);
    if (isAxiosError(error)) {
      console.log(error.message);
      errorMessage.value =
        error.response?.data?.message ||
        "Erro ao processar envio. Tente novamente.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  selectedCommunityId.value = props.communityId || "";
  postTitle.value = "";
  postContent.value = "";
  selectedFiles.value = [];
  errorMessage.value = "";
  emit("close");
};
</script>

<style scoped>
.bg-light-industrial {
  background-color: #f0f0f0;
}
.text-dark-jungle {
  color: #1a2f2b;
}
.modal-backdrop.show {
  opacity: 0.8;
}
</style>
