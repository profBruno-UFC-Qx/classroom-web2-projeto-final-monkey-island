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
            <a href="#" class="text-dark-jungle text-decoration-none hover-warning title-glitch">
              {{ post.title }}
            </a>
          </h5>
          <div class="d-flex gap-3 mt-1 align-items-center">
            <span class="badge bg-dark rounded-0 font-monospace text-warning x-small">
              ID: {{ post.id.slice(0, 8).toUpperCase() }}
            </span>
            <span class="font-monospace x-small text-muted">
              <i class="bi bi-calendar-event me-1"></i> {{ formattedDate }}
            </span>
            <span v-if="post.communityName" class="badge bg-secondary rounded-0 font-monospace x-small">
              <i class="bi bi-shield-shaded me-1"></i> {{ post.communityName }}
            </span>
          </div>
        </div>
        
        <div class="text-end">
          <small class="text-muted x-small d-block text-uppercase fw-bold">Pesquisador</small>
          <span class="fw-bold text-dark-jungle">{{ post.authorName }}</span>
        </div>
      </div>

      <div v-if="medias.length > 0" class="position-relative bg-black post-image-container">
        
        <div class="ratio ratio-16x9">
          <img 
            :src="getImageUrl(medias[currentImageIndex].image)" 
            class="object-fit-contain" 
            alt="Evidência Visual"
          >
        </div>

        <template v-if="medias.length > 1">
          <button @click.stop="prevImage" class="slider-control start-0">
            <i class="bi bi-chevron-left display-6"></i>
          </button>
          
          <button @click.stop="nextImage" class="slider-control end-0">
            <i class="bi bi-chevron-right display-6"></i>
          </button>

          <div class="position-absolute bottom-0 end-0 m-3 badge bg-dark-transparent font-monospace border border-secondary">
            CAM {{ currentImageIndex + 1 }} / {{ medias.length }}
          </div>
        </template>
      </div>

      <div class="p-4 ps-5">
        <p class="card-text text-secondary mb-4 fst-italic position-relative z-1 line-clamp-content">
          {{ post.content }}
        </p>

        <div class="d-flex gap-2 flex-wrap pt-2 border-top border-secondary-subtle">
          <button @click="handleAction('comment')" class="btn btn-action btn-sm px-3">
            <i class="bi bi-chat-left-text-fill me-2"></i> {{ post.commentCount }}
          </button>
          
          <button @click="handleAction('like')" class="btn btn-action-danger btn-sm px-3">
            <i class="bi bi-heart-fill me-2"></i> {{ post.likeCount }}
          </button>
          
          <button @click="handleAction('collect')" class="btn btn-action-warning btn-sm px-3 ms-auto">
            <i class="bi bi-archive-fill me-2"></i> CATALOGAR
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import postService from '../../services/postService';
import type { Post, PostMedia } from '../../types/post';
import * as bootstrap from 'bootstrap';

const props = defineProps<{
  post: Post
}>();

const authStore = useAuthStore();
const medias = ref<PostMedia[]>([]);
const currentImageIndex = ref(0);

// Formatação de data
const formattedDate = computed(() => {
  return new Date(props.post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
});

// Buscar Imagens ao montar o componente
onMounted(async () => {
  try {
    // Se o objeto post já vier com medias (futuro), usa elas. Senão, busca.
    if (props.post.medias && props.post.medias.length > 0) {
      medias.value = props.post.medias;
    } else {
      const fetchedMedias = await postService.getPostMedias(props.post.id);
      // Ordenar por 'order' para garantir a sequência correta
      medias.value = fetchedMedias.sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.error(`Erro ao carregar mídia do post ${props.post.id}`, error);
  }
});

// URL da imagem (Backend salva em public/media_posts, precisamos da URL completa)
const getImageUrl = (relativePath: string) => {
  // Ajuste a URL base conforme sua configuração do Vite/Backend
  // O backend salva como "media_posts/arquivo.png"
  // O express serve estático na raiz ou /images? 
  // No seu app.ts (enviado antes) estava: app.use("/images", express.static(...));
  // Então o caminho deve ser http://localhost:3000/images/nome_do_arquivo (se o relativePath for so nome)
  // Mas o seu service salva "media_posts/filename".
  // Vamos assumir que http://localhost:3000/images aponta para a pasta public.
  return `http://localhost:3000/images/${relativePath.replace('media_posts/', '')}`; 
  // Nota: Ajuste esse replace dependendo de como o static está configurado no Express
};

// Lógica do Slider (Loop Infinito)
const nextImage = () => {
  if (medias.value.length === 0) return;
  // Módulo (%) faz voltar ao 0 quando atinge o tamanho do array
  currentImageIndex.value = (currentImageIndex.value + 1) % medias.value.length;
};

const prevImage = () => {
  if (medias.value.length === 0) return;
  // Lógica para voltar do 0 para o último
  currentImageIndex.value = (currentImageIndex.value - 1 + medias.value.length) % medias.value.length;
};

const handleAction = (actionType: string) => {
  if (!authStore.isAuthenticated) {
    const modalElement = document.getElementById('authAlertModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  } else {
    if(actionType === 'collect') window.alert("Item adicionado à coleção!");
    // Futuro: chamar postService.likePost(props.post.id)
  }
};
</script>

<style scoped>
/* Tema e Cores */
.text-dark-jungle { color: #1a2f2b; }
.bg-light-industrial { background-color: #f4f4f4; }
.bg-dark-transparent { background-color: rgba(0,0,0,0.7); }
.fw-black { font-weight: 900; }
.x-small { font-size: 0.7rem; }
.tracking-wide { letter-spacing: 1px; }
.tracking-widest { letter-spacing: 3px; }

/* Estrutura do Card */
.post-card {
  border-left: 0;
  border-radius: 4px;
  background-color: #fff;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}

/* Slider Controls */
.post-image-container {
  min-height: 200px;
  border-bottom: 2px solid #ffc107;
}

.slider-control {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15%;
  background: transparent;
  border: none;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.slider-control:hover {
  opacity: 1;
  background: linear-gradient(90deg, rgba(0,0,0,0.5), transparent);
}
.slider-control.end-0:hover {
  background: linear-gradient(-90deg, rgba(0,0,0,0.5), transparent);
}

.object-fit-contain {
  object-fit: contain;
  background-color: #000;
}

/* Marca d'água */
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 4rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.03);
  pointer-events: none;
  z-index: 0;
  text-transform: uppercase;
}

/* Faixa Lateral */
.classification-strip {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 30px;
  background: repeating-linear-gradient(
    45deg,
    #1a2f2b,
    #1a2f2b 10px,
    #142421 10px,
    #142421 20px
  );
  border-right: 2px solid #ffc107;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.6rem;
  font-weight: bold;
  z-index: 2;
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

.hover-warning:hover { 
  color: #ffb400 !important; 
  text-shadow: 0 0 5px rgba(255, 180, 0, 0.3);
}

.btn-action, .btn-action-danger, .btn-action-warning {
  border: 1px solid #ced4da;
  background-color: white;
  color: #6c757d;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.btn-action:hover { background-color: #e9ecef; color: #212529; }
.btn-action-danger:hover { background-color: #fff5f5; color: #dc3545; border-color: #dc3545; }
.btn-action-warning:hover { background-color: #fff9e6; color: #b48900; border-color: #ffc107; }
</style>