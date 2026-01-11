<template>
  <div class="home-layout min-vh-100 bg-concrete">
    
    <AppNavbar />

    <div class="danger-stripe shadow-sm">
      <div class="container-fluid d-flex justify-content-center align-items-center overflow-hidden py-1">
      </div>
    </div>

    <header class="hero-section py-5 mb-5 shadow-lg position-relative">
      <div class="overlay-grid"></div> 
      <div class="container position-relative z-1 text-center">
        <div class="d-inline-block border border-warning border-3 p-4 bg-dark-transparent backdrop-blur rounded-1">
          <h1 class="display-5 fw-black text-warning text-uppercase mb-0 tracking-widest text-shadow">
            <i class="bi bi-terminal-fill me-3"></i>Terminal Central
          </h1>
          <div class="d-flex align-items-center justify-content-center gap-2 mt-2">
            <span class="badge bg-danger rounded-0 text-uppercase">Restrito</span>
            <span class="text-light-fossil font-monospace small text-uppercase">Sistema Operacional v4.0</span>
          </div>
        </div>
      </div>
    </header>

    <div class="container pb-5">
      <div class="row g-4">
        
        <div class="col-lg-8">
          
          <div class="d-flex align-items-center mb-4 pb-2 border-bottom border-dark-subtle">
             <i class="bi bi-broadcast fs-3 text-danger me-3 animate-pulse"></i>
             <h4 class="fw-black text-uppercase m-0 text-dark-jungle tracking-wide">Relatórios de Campo</h4>
          </div>

          <div v-if="authStore.isAuthenticated" class="card fossil-card mb-5 p-0 bg-white border-0 shadow-sm position-relative overflow-hidden">
            <div class="top-folder-tab bg-warning px-3 py-1 d-inline-block fw-bold small text-dark border-top border-start border-end border-dark">
              NOVO REGISTRO
            </div>
            <div class="card-body p-4 border border-dark bg-light-industrial">
              <h5 class="fw-black text-uppercase mb-3 text-dark-jungle">
                <i class="bi bi-file-earmark-medical-fill text-danger me-2"></i>Catalogar Descoberta
              </h5>
              <p class="text-secondary small font-monospace mb-3">
                > Insira os dados da observação para o banco de dados central...
              </p>
              <button class="btn btn-dark w-full py-2 fw-black text-uppercase border-warning btn-terminal">
                <i class="bi bi-upload me-2 text-warning"></i>Enviar Dados
              </button>
            </div>
          </div>

          <div v-else class="card fossil-card mb-5 bg-danger-subtle border-danger border-2 shadow-sm">
            <div class="card-body p-4 d-flex align-items-center gap-4">
              <div class="bg-danger text-white p-3 rounded-1 d-flex align-items-center justify-content-center shadow border border-white" style="width: 64px; height: 64px;">
                 <i class="bi bi-hand-index-thumb-fill fs-2"></i>
              </div>
              <div>
                <h5 class="fw-black text-danger text-uppercase m-0 mb-1">Acesso Negado</h5>
                <p class="small text-dark fw-bold m-0 mb-3 opacity-75 font-monospace">
                  "ERR_AUTH_FAIL: Credenciais de nível 1 necessárias."<br>
                  Identifique-se no terminal de segurança.
                </p>
                <router-link to="/login" class="btn btn-sm btn-dark text-warning fw-bold text-uppercase px-4 rounded-0 shadow">
                  <i class="bi bi-shield-lock me-2"></i>Inserir Senha
                </router-link>
              </div>
            </div>
          </div>

          <div class="text-center py-5 border border-secondary border-dashed rounded-1 opacity-50 bg-light-industrial">
            <i class="bi bi-dns fs-1 text-secondary mb-3"></i>
            <p class="font-monospace text-uppercase fw-bold text-secondary m-0">
              Sincronizando com o servidor principal...
            </p>
            <p class="x-small text-muted font-monospace mt-1">
              [STATUS: AGUARDANDO_DADOS_DE_CAMPO]
            </p>
          </div>

        </div>

        <div class="col-lg-4">
          <GameWidget />
          
          <div class="card fossil-card border-2 border-dark p-0 overflow-hidden mb-4 shadow-sm">
            <div class="card-header bg-dark text-warning fw-black text-uppercase border-bottom border-warning rounded-0 p-3">
              <i class="bi bi-cpu-fill me-2"></i>Status do Parque
            </div>
            <div class="card-body bg-light-industrial font-monospace small fw-bold">
              <ul class="list-unstyled m-0 text-dark-jungle">
                <li class="d-flex justify-content-between mb-2 pb-2 border-bottom border-secondary-subtle">
                  <span><i class="bi bi-lightning-charge me-1"></i>Rede Elétrica</span> 
                  <span class="text-success">98% [ESTÁVEL]</span>
                </li>
                <li class="d-flex justify-content-between mb-2 pb-2 border-bottom border-secondary-subtle">
                  <span><i class="bi bi-eye me-1"></i>Sensores</span> 
                  <span class="text-warning">FALHA SETOR 7</span>
                </li>
                <li class="d-flex justify-content-between">
                  <span><i class="bi bi-cone-striped me-1"></i>Paddock T-Rex</span> 
                  <span class="text-danger animate-pulse">ALERTA</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="text-center opacity-50 mt-4">
            <i class="bi bi-x-diamond-fill fs-1 text-secondary"></i>
            <p class="x-small text-uppercase fw-bold text-secondary mt-1">InGen Technologies</p>
          </div>
        </div>

      </div>
    </div>

    <AuthAlertModal />

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';
import AppNavbar from '../components/AppNavbar.vue';
import GameWidget from '../components/widgets/GameWidget.vue';
import AuthAlertModal from '../components/modals/AuthAlertModal.vue';

const authStore = useAuthStore();
// mockPosts removido para evitar conflitos com a integração real
</script>

<style scoped>
/* CORES DO TEMA */
.text-dark-jungle { color: #1a2f2b; }
.text-light-fossil { color: #e8e2d9; }
.bg-concrete { background-color: #dcdcdc; background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E"); }
.bg-light-industrial { background-color: #f0f0f0; }

.border-dashed { border-style: dashed !important; }

/* TIPOGRAFIA */
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 3px; }
.tracking-wide { letter-spacing: 1px; }
.text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }

/* FAIXA DE PERIGO */
.danger-stripe {
  background: repeating-linear-gradient(
    45deg,
    #ffc107,
    #ffc107 20px,
    #1a1a1a 20px,
    #1a1a1a 40px
  );
  border-bottom: 2px solid #000;
  height: 20px;
}

/* HERO SECTION */
.hero-section {
  background-color: #2c3e50;
  background-image: linear-gradient(rgba(26, 47, 43, 0.9), rgba(26, 47, 43, 0.8)), url('https://www.transparenttextures.com/patterns/dark-matter.png');
  border-bottom: 4px solid #ffc107;
}

.overlay-grid {
  position: absolute;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center;
  opacity: 0.1;
  pointer-events: none;
}

.bg-dark-transparent { background-color: rgba(0, 0, 0, 0.6); }
.backdrop-blur { backdrop-filter: blur(5px); }

/* BOTÕES E CARDS */
.btn-terminal {
  transition: all 0.3s;
}
.btn-terminal:hover {
  background-color: #1a1a1a;
  border-color: #ffc107;
  color: #ffc107;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}

.fossil-card {
  border-radius: 2px;
}

/* ANIMAÇÕES */
.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

.x-small { font-size: 0.7rem; letter-spacing: 1px; }
</style>