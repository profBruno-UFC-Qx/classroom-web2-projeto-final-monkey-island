<template>
  <div class="modal fade" id="adminRequestsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content bg-dark border-2 border-danger shadow-lg">
        
        <div class="modal-header bg-black border-bottom border-danger py-3">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-danger text-white p-2 rounded-1">
              <i class="bi bi-shield-lock-fill fs-4"></i>
            </div>
            <div>
              <h5 class="modal-title fw-black text-uppercase text-light tracking-wide m-0">
                Painel de Controle de Credenciais
              </h5>
              <small class="text-danger font-monospace x-small fw-bold">PENDÊNCIAS DE ACESSO NÍVEL 2</small>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body bg-concrete p-4">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-danger" role="status"></div>
            <p class="mt-2 text-muted font-monospace small">Consultando banco de dados confidencial...</p>
          </div>

          <div v-else-if="requests.length === 0" class="text-center py-5 opacity-50">
            <i class="bi bi-check2-all display-1 text-secondary"></i>
            <h5 class="mt-3 text-uppercase fw-bold text-secondary">Nenhuma solicitação pendente</h5>
          </div>

          <div v-else class="d-flex flex-column gap-3">
            <div v-for="req in requests" :key="req.id" class="card bg-dark border-secondary request-card overflow-hidden">
              <div class="card-body p-0">
                <div class="p-3 bg-black d-flex justify-content-between align-items-center border-bottom border-secondary">
                  <div>
                    <h6 class="text-white fw-bold m-0">{{ req.user?.name }}</h6>
                    <small class="text-muted font-monospace x-small">{{ req.user?.email }}</small>
                  </div>
                  <span class="badge bg-secondary font-monospace x-small">{{ new Date(req.createdAt).toLocaleDateString() }}</span>
                </div>
                
                <div class="p-3">
                  <label class="text-danger x-small fw-bold text-uppercase mb-2">Motivação Apresentada:</label>
                  <p class="text-light small fst-italic bg-black p-3 border border-secondary rounded-1">
                    "{{ req.motivation }}"
                  </p>
                  
                  <div class="d-flex gap-2 mt-3">
                    <button @click="handleAction(req.id, 'approve')" class="btn btn-sm btn-success flex-grow-1 fw-bold text-uppercase rounded-0">
                      <i class="bi bi-check-lg me-1"></i> Autorizar
                    </button>
                    <button @click="handleAction(req.id, 'reject')" class="btn btn-sm btn-outline-danger flex-grow-1 fw-bold text-uppercase rounded-0">
                      <i class="bi bi-x-lg me-1"></i> Negar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as bootstrap from 'bootstrap';
import researcherRequestService from '../../services/researcherRequestService';

const requests = ref<any[]>([]);
const loading = ref(false);

const open = async () => {
  const modalEl = document.getElementById('adminRequestsModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    await fetchRequests();
  }
};

const fetchRequests = async () => {
  loading.value = true;
  try {
    requests.value = await researcherRequestService.getPendingRequests();
  } catch (error) {
    console.error("Falha ao carregar pedidos:", error);
  } finally {
    loading.value = false;
  }
};

const handleAction = async (id: string, action: 'approve' | 'reject') => {
  if (!confirm(`Confirmar ação de ${action === 'approve' ? 'APROVAÇÃO' : 'REJEIÇÃO'}?`)) return;
  
  try {
    if (action === 'approve') {
      await researcherRequestService.approveRequest(id);
    } else {
      await researcherRequestService.rejectRequest(id);
    }
    await fetchRequests(); // Recarrega lista
  } catch (error) {
    alert("Erro ao processar solicitação.");
  }
};

defineExpose({ open });
</script>

<style scoped>
.bg-concrete { background-color: #1a1a1a; background-image: radial-gradient(#333 1px, transparent 1px); background-size: 10px 10px; }
.fw-black { font-weight: 900; }
.x-small { font-size: 0.7rem; letter-spacing: 1px; }
.request-card { border-left: 4px solid #dc3545; transition: transform 0.2s; }
.request-card:hover { transform: scale(1.01); border-color: #fff; }
</style>