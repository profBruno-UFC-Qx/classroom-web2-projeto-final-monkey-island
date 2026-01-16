<template>
  <div class="card shadow-sm border-0 mb-4 post-card position-relative overflow-hidden">
    <div class="watermark">CONFIDENTIAL</div>
    <div class="classification-strip d-flex align-items-center justify-content-center">
      <span class="text-uppercase tracking-widest vertical-text">Top Secret // InGen DB</span>
    </div>

    <div class="card-body p-0 pb-4 bg-light-industrial">
      <div class="p-4 ps-5 d-flex justify-content-between align-items-start border-bottom border-secondary-subtle">
        <div class="ps-2">
          <h5 class="card-title fw-black text-uppercase mb-0 tracking-wide">
            <span class="text-dark-jungle title-glitch">
              {{ postData.title }}
            </span>
          </h5>
          <div class="d-flex gap-3 mt-1 align-items-center">
            <span class="badge bg-dark rounded-0 font-monospace text-warning x-small">
              ID: {{ postData.id?.slice(0, 8).toUpperCase() || "S/ID" }}
            </span>
            <span class="font-monospace x-small text-muted">
              <i class="bi bi-calendar-event me-1"></i> {{ formatDate(postData.createdAt) }}
            </span>
            <span v-if="postData.communityName" class="badge bg-secondary rounded-0 font-monospace x-small">
              <i class="bi bi-shield-shaded me-1"></i> {{ postData.communityName }}
            </span>
          </div>
        </div>

        <div class="text-end">
          <small class="text-muted x-small d-block text-uppercase fw-bold">Autorizado por</small>
          <span class="fw-bold text-dark-jungle">
            {{ postData.authorName || "Ranger Desconhecido" }}
          </span>
        </div>
      </div>

      <div v-if="medias.length > 0" class="position-relative bg-black post-image-container">
        <div class="ratio ratio-16x9">
          <img
            :src="getImageUrl(medias[currentImageIndex].image)"
            class="object-fit-contain"
            alt="Evidência Visual"
          />
        </div>

        <template v-if="medias.length > 1">
          <button @click.stop="prevImage" class="slider-control start-0" aria-label="Anterior">
            <i class="bi bi-chevron-left display-6"></i>
          </button>
          <button @click.stop="nextImage" class="slider-control end-0" aria-label="Próxima">
            <i class="bi bi-chevron-right display-6"></i>
          </button>
          <div class="position-absolute bottom-0 end-0 m-3 badge bg-dark-transparent font-monospace border border-secondary shadow">
            CAM_DATA: {{ currentImageIndex + 1 }} / {{ medias.length }}
          </div>
        </template>
      </div>

      <div class="p-4 ps-5">
        <p class="card-text text-secondary mb-4 fst-italic position-relative z-1 line-clamp-content">
          "{{ postData.content }}"
        </p>

        <div class="d-flex gap-2 flex-wrap pt-2 border-top border-secondary-subtle">
          <button class="btn btn-action btn-sm px-3">
            <i class="bi bi-chat-left-text-fill me-2"></i>
            {{ postData.commentCount || 0 }}
          </button>

          <button @click="handleLike" class="btn btn-action-danger btn-sm px-3">
            <i class="bi bi-heart-fill me-2"></i> {{ postData.likeCount || 0 }}
          </button>

          <button @click="handleCollect" class="btn btn-action-warning btn-sm px-3 ms-auto">
            <i class="bi bi-archive-fill me-2"></i> CATALOGAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import * as bootstrap from "bootstrap";

import { useAuthStore } from "../../stores/authStore";
import { usePostStore } from "../../stores/postStore";

import postService from "../../services/postService";
import { getImageUrl } from "../../utils/mediaUtils";
import { formatDate } from "../../utils/formatters";
import type { PostMedia } from "../../types/post";

const props = defineProps<{
  post: any;
}>();

const authStore = useAuthStore();
const postStore = usePostStore();


const medias = ref<PostMedia[]>([]);
const currentImageIndex = ref(0);

const postData = computed(() => props.post?.post || props.post || {});


onMounted(async () => {
  const postId = postData.value?.id;
  if (!postId) return;
  try {
    const fetchedMedias = await postService.getPostMedias(postId);
    medias.value = fetchedMedias.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error(`Erro media post ${postId}`, error);
  }
});


const nextImage = () => {
  if (medias.value.length === 0) return;
  currentImageIndex.value = (currentImageIndex.value + 1) % medias.value.length;
};

const prevImage = () => {
  if (medias.value.length === 0) return;
  currentImageIndex.value = (currentImageIndex.value - 1 + medias.value.length) % medias.value.length;
};

const checkAuth = () => {
  if (!authStore.isAuthenticated) {
    const modalElement = document.getElementById("authAlertModal");
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
    return false;
  }
  return true;
};

const handleLike = async () => {
  if (!checkAuth()) return;
  await postStore.likePost(postData.value.id);
};

const handleCollect = () => {
  if (!checkAuth()) return;
  window.alert("Funcionalidade delegada para ArtifactStore (Em breve)");
};
</script>

<style scoped>
/* Mantive seus estilos originais */
.text-dark-jungle { color: #1a2f2b; }
.bg-light-industrial { background-color: #f4f4f4; }
.bg-dark-transparent { background-color: rgba(0, 0, 0, 0.7); }
.fw-black { font-weight: 900; }
.x-small { font-size: 0.7rem; }
.tracking-wide { letter-spacing: 1px; }
.tracking-widest { letter-spacing: 3px; }
.post-card { border-left: 0; border-radius: 4px; background-color: #fff; clip-path: polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
.post-image-container { min-height: 200px; border-bottom: 2px solid #ffc107; }
.slider-control { position: absolute; top: 0; bottom: 0; width: 15%; background: transparent; border: none; color: white; opacity: 0; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; }
.post-image-container:hover .slider-control { opacity: 1; }
.slider-control:hover { background: rgba(0, 0, 0, 0.4); color: #ffc107; }
.object-fit-contain { object-fit: contain; background-color: #000; width: 100%; height: 100%; }
.watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 4rem; font-weight: 900; color: rgba(0, 0, 0, 0.03); pointer-events: none; z-index: 0; text-transform: uppercase; }
.classification-strip { position: absolute; left: 0; top: 0; bottom: 0; width: 30px; background: repeating-linear-gradient(45deg, #1a2f2b, #1a2f2b 10px, #142421 10px, #142421 20px); border-right: 2px solid #ffc107; color: rgba(255, 255, 255, 0.5); font-size: 0.6rem; font-weight: bold; z-index: 2; }
.vertical-text { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); }
.btn-action, .btn-action-danger, .btn-action-warning { border: 1px solid #ced4da; background-color: white; color: #6c757d; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; transition: all 0.2s ease; }
.btn-action:hover { background-color: #e9ecef; color: #212529; }
.btn-action-danger:hover { background-color: #fff5f5; color: #dc3545; border-color: #dc3545; }
.btn-action-warning:hover { background-color: #fff9e6; color: #b48900; border-color: #ffc107; }
.title-glitch:hover { text-shadow: 2px 0 #ffc107, -2px 0 #dc3545; }
</style>