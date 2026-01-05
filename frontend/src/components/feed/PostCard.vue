<template>
  <div class="card shadow-sm border-0 mb-4 post-card position-relative overflow-hidden">
    
    <div class="watermark">CONFIDENTIAL</div>

    <div class="classification-strip d-flex align-items-center justify-content-center">
      <span class="text-uppercase tracking-widest vertical-text">Top Secret // InGen DB</span>
    </div>
    
    <div class="card-body p-4 ps-5 bg-light-industrial">
      
      <div class="d-flex justify-content-between align-items-start mb-3 border-bottom border-dark-subtle pb-2">
        <div>
          <h5 class="card-title fw-black text-uppercase mb-0 tracking-wide">
            <a href="#" class="text-dark-jungle text-decoration-none hover-warning title-glitch">
              {{ title }}
            </a>
          </h5>
          <div class="d-flex gap-3 mt-1 align-items-center">
            <span class="badge bg-dark rounded-0 font-monospace text-warning x-small">
              ID: {{ generatedId }}
            </span>
            <span class="font-monospace x-small text-muted">
              <i class="bi bi-calendar-event me-1"></i> {{ date }}
            </span>
          </div>
        </div>
        
        <div class="text-end">
          <small class="text-muted x-small d-block text-uppercase fw-bold">Pesquisador</small>
          <span class="fw-bold text-dark-jungle">{{ author }}</span>
        </div>
      </div>

      <p class="card-text text-secondary mb-4 fst-italic position-relative z-1">
        {{ content }}
      </p>

      <div class="d-flex gap-2 flex-wrap pt-2 border-top border-secondary-subtle">
        <button @click="handleAction('comment')" class="btn btn-action btn-sm px-3">
          <i class="bi bi-chat-left-text-fill me-2"></i> {{ comments }}
        </button>
        
        <button @click="handleAction('like')" class="btn btn-action-danger btn-sm px-3">
          <i class="bi bi-heart-fill me-2"></i> {{ likes }}
        </button>
        
        <button @click="handleAction('collect')" class="btn btn-action-warning btn-sm px-3 ms-auto">
          <i class="bi bi-archive-fill me-2"></i> CATALOGAR
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/authStore';
// Importação direta do Bootstrap para manipular o Modal via JS
import * as bootstrap from 'bootstrap';

const authStore = useAuthStore();
const generatedId = Math.random().toString(36).substr(2, 6).toUpperCase();

defineProps<{
  title: string;
  author: string;
  date: string;
  content: string;
  comments: number;
  likes: number;
}>();

const handleAction = (actionType: string) => {
  if (!authStore.isAuthenticated) {
    // Tenta encontrar o Modal no DOM (ele está na HomeView)
    const modalElement = document.getElementById('authAlertModal');
    
    if (modalElement) {
      // Cria/Recupera a instância do Modal e exibe
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error("Erro: O modal de alerta não foi encontrado no DOM.");
    }
  } else {
    // Lógica futura de sucesso (ex: chamar API)
    // Usamos window.alert para evitar erro de 'cannot find name alert'
    if(actionType === 'collect') window.alert("Item adicionado à coleção!");
  }
};
</script>

<style scoped>
/* Tema e Cores */
.text-dark-jungle { color: #1a2f2b; }
.bg-light-industrial { background-color: #f4f4f4; } /* Cinza quase branco */
.fw-black { font-weight: 900; }
.x-small { font-size: 0.7rem; }
.tracking-wide { letter-spacing: 1px; }
.tracking-widest { letter-spacing: 3px; }

/* Estrutura do Card */
.post-card {
  border-left: 0;
  border-radius: 4px;
  background-color: #fff;
  /* Clip-path para dar um corte tecnológico no canto */
  clip-path: polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}

/* Marca d'água de fundo */
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

/* Faixa Lateral "Top Secret" */
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
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

/* Interatividade */
.hover-warning:hover { 
  color: #ffb400 !important; 
  text-shadow: 0 0 5px rgba(255, 180, 0, 0.3);
}

/* Botões */
.btn-action, .btn-action-danger, .btn-action-warning {
  border: 1px solid #ced4da;
  background-color: white;
  color: #6c757d;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background-color: #e9ecef;
  color: #212529;
}

.btn-action-danger:hover {
  background-color: #fff5f5;
  color: #dc3545;
  border-color: #dc3545;
}

.btn-action-warning:hover {
  background-color: #fff9e6;
  color: #b48900;
  border-color: #ffc107;
}
</style>