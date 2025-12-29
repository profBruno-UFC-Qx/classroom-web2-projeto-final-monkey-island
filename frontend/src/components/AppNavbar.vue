<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-header sticky-top py-3">
    <div class="container-fluid px-4">
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
        <i class="bi bi-intersect text-warning fs-3"></i>
        <span class="fw-black text-uppercase tracking-tighter fs-4 logo-text">
          The <span class="text-warning">Lost</span> World
        </span>
      </router-link>
      
      <div class="d-none d-lg-flex align-items-center gap-4 ms-auto me-4">
        <router-link to="/ranking" class="nav-lab-link">
          <i class="bi bi-bar-chart-steps"></i> Ranking
        </router-link>
        <router-link to="/comunidades" class="nav-lab-link">
          <i class="bi bi-shield-shaded"></i> Setores
        </router-link>
        <router-link to="/minigames" class="nav-lab-link">
          <i class="bi bi-dpad"></i> Minigames
        </router-link>
        <router-link v-if="authStore.user?.role === 'researcher' || authStore.user?.role === 'admin'" 
          to="/area-pesquisador" class="nav-lab-link text-warning">
          <i class="bi bi-microscope"></i> Laboratório
        </router-link>
      </div>

      <div class="d-flex align-items-center gap-3">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="btn btn-link text-light text-decoration-none fw-bold">Entrar</router-link>
          <router-link to="/registro" class="btn btn-warning px-4 fw-bold rounded-0 shadow-sm">
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
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark bg-dark border-secondary">
              <li><router-link class="dropdown-item" to="/perfil"><i class="bi bi-person me-2"></i>Perfil</router-link></li>
              <li><router-link class="dropdown-item" to="/colecao"><i class="bi bi-archive me-2"></i>Minha Coleção</router-link></li>
              <li><hr class="dropdown-divider border-secondary"></li>
              <li><button @click="handleLogout" class="dropdown-item text-danger"><i class="bi bi-box-arrow-right me-2"></i>Sair</button></li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.custom-header {
  background-color: #1a2f2b; /* Verde Selva Escuro */
  border-bottom: 3px solid #ffb400; /* Linha de perigo amarela */
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
</style>