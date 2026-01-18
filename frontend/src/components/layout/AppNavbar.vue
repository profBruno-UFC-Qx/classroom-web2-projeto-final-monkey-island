<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-header sticky-top py-3">
    <div class="container-fluid px-4">
      
      <router-link to="/home" class="navbar-brand d-flex align-items-center gap-2">
        <i class="bi bi-intersect text-warning fs-3"></i>
        <span class="fw-black text-uppercase tracking-tighter fs-4 logo-text">
          The <span class="text-warning">Lost</span> World
        </span>
      </router-link>
      
      <div class="d-none d-lg-flex align-items-center gap-4 ms-auto me-4">
        <router-link to="/rankings" class="nav-lab-link">
          <i class="bi bi-bar-chart-steps"></i> Ranking
        </router-link>
        <router-link to="/comunidades" class="nav-lab-link">
          <i class="bi bi-shield-shaded"></i> Setores
        </router-link>
        </div>

      <div class="d-flex align-items-center gap-3">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="btn btn-link text-light text-decoration-none fw-bold">Entrar</router-link>
          <router-link to="/register" class="btn btn-warning px-4 fw-bold rounded-0 shadow-sm">
            INGRESSAR NO PARQUE
          </router-link>
        </template>
        
        <template v-else>
          <div class="dropdown">
            <button class="btn btn-dark d-flex align-items-center gap-2 border-secondary rounded-pill px-3" 
              type="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-badge text-warning"></i>
              <span class="small fw-bold">{{ authStore.user?.name || 'Explorador' }}</span>
            </button>
            
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark bg-dark border-secondary shadow-lg">
              <li>
                <router-link class="dropdown-item" to="/perfil">
                  <i class="bi bi-person me-2"></i>Perfil
                </router-link>
              </li>
              
              <template v-if="authStore.user?.role === 'admin'">
                <li><hr class="dropdown-divider border-secondary opacity-25"></li>
                <li><h6 class="dropdown-header text-warning opacity-75 small fw-bold tracking-wide">ADMINISTRAÇÃO</h6></li>
                
                <li>
                  <router-link class="dropdown-item d-flex justify-content-between align-items-center" to="/admin/requests">
                    <span><i class="bi bi-clipboard-check me-2"></i>Solicitações</span>
                    <span v-if="adminStore.pendingRequests.length > 0" class="badge bg-danger rounded-pill">
                      {{ adminStore.pendingRequests.length }}
                    </span>
                  </router-link>
                </li>
                
                <li>
                  <router-link class="dropdown-item" to="/admin/artifacts">
                    <i class="bi bi-gem me-2"></i>Artefatos
                  </router-link>
                </li>
                
                <li>
                  <router-link class="dropdown-item" to="/admin/users">
                    <i class="bi bi-people me-2"></i>Usuários
                  </router-link>
                </li>
              </template>

              <li><hr class="dropdown-divider border-secondary opacity-25"></li>
              <li>
                <button @click="handleLogout" class="dropdown-item text-danger fw-bold">
                  <i class="bi bi-box-arrow-right me-2"></i>Sair
                </button>
              </li>
            </ul>
          </div>
        </template>

        <div class="vr text-secondary mx-1" style="height: 25px;"></div>
        
        <div 
          class="status-indicator rounded-circle"
          :class="authStore.isAuthenticated ? 'bg-success status-online' : 'bg-danger status-offline'"
          :title="authStore.isAuthenticated ? 'Status: Conectado' : 'Status: Desconectado'"
        ></div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStore } from '@/stores/adminStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const adminStore = useAdminStore();
const router = useRouter();

onMounted(() => {
  // Mantemos o fetch para garantir que o badge do dropdown funcione
  if (authStore.user?.role === 'admin') {
    adminStore.fetchPendingRequests();
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.custom-header {
  background-color: #1a2f2b;
  border-bottom: 3px solid #ffb400;
}

.logo-text {
  letter-spacing: -1px;
  font-family: 'Segoe UI Black', sans-serif;
}

.nav-lab-link {
  color: #e8e2d9;
  text-decoration: none;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.nav-lab-link:hover {
  color: #ffb400;
  transform: translateY(-2px);
}

.status-indicator {
  width: 12px;
  height: 12px;
  transition: all 0.3s ease;
  cursor: help; 
}

.status-online {
  box-shadow: 0 0 8px rgba(25, 135, 84, 0.8);
}

.status-offline {
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.8);
}

/* Ajustes finos no dropdown */
.dropdown-item {
  color: #e8e2d9;
  transition: all 0.2s;
}
.dropdown-item:hover {
  background-color: rgba(255, 180, 0, 0.1);
  color: #ffb400;
}
.tracking-wide { letter-spacing: 1px; }
</style>