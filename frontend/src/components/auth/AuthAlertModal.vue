<template>
  <div class="modal fade" id="authAlertModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark border-danger border-2 shadow-lg">
        <div class="modal-header border-bottom border-secondary-subtle py-2">
          <span class="text-danger fw-black small tracking-widest">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>SISTEMA DE SEGURANÇA
          </span>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center p-5">
          <div class="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-glow" style="width: 80px; height: 80px;">
            <i class="bi bi-shield-lock-fill display-5"></i>
          </div>
          <h4 class="text-white fw-black text-uppercase tracking-wide mb-3">Acesso Bloqueado</h4>
          <p class="text-light-fossil font-monospace small mb-4">
            Ação não autorizada para usuários anônimos. <br>
            É necessário realizar o credenciamento de Nível 1 para interagir com o terminal.
          </p>
          <div class="d-grid gap-2">
            <button type="button" class="btn btn-outline-light btn-sm fw-bold border-0 opacity-50" data-bs-dismiss="modal">
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-light-fossil { color: #e8e2d9; }
.fw-black { font-weight: 900; }
.tracking-widest { letter-spacing: 3px; }
.tracking-wide { letter-spacing: 1px; }
.shadow-glow { box-shadow: 0 0 15px rgba(220, 53, 69, 0.5); }
.modal-content { border-radius: 4px; }
</style>