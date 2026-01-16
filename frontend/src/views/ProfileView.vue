<template>
  <div class="min-vh-100 bg-light pb-5">
    <div class="container pt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          
          <div class="d-flex align-items-center mb-4">
            <i class="bi bi-person-circle fs-2 me-3 text-secondary"></i>
            <h3 class="fw-bold text-uppercase m-0 text-dark">
              Ficha do Pesquisador
            </h3>
          </div>

          <div v-if="authStore.isLoading" class="text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="mt-3 text-muted small">
              carregando informações...
            </p>
          </div>

          <div
            v-else-if="authStore.error"
            class="alert alert-danger border-0 shadow-sm text-center"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ authStore.error }}
            <br />
            <button
              class="btn btn-outline-danger btn-sm mt-3"
              @click="authStore.refreshProfile()"
            >
              tentar novamente
            </button>
          </div>

          <template v-else-if="authStore.user">
            <ProfileCard
              :user="authStore.user"
              @openVault="handleOpenVault"
              @openCommunities="handleOpenCommunities"
              @requestResearcher="handleRequestResearcher"
              @openAdminRequests="handleOpenAdminRequests"
            />

            <ProfileFeed />
          </template>
        </div>
      </div>
    </div>

    <RelicsVaultModal ref="vaultModal" />
    <MyCommunitiesModal ref="communitiesModal" />
    <ResearcherRequestModal ref="requestModal" />
    <ResearcherRequestsAdminModal ref="adminRequestsModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";

// importação dos componentes visuais
import ProfileCard from "@/components/profile/ProfileCard.vue";
import ProfileFeed from "@/components/profile/ProfileFeed.vue";
import RelicsVaultModal from "@/components/game/RelicsVaultModal.vue";
import MyCommunitiesModal from "@/components/community/MyCommunitiesModal.vue";
import ResearcherRequestModal from "@/components/admin/ResearcherRequestModal.vue";
import ResearcherRequestsAdminModal from "@/components/admin/ResearcherRequestsAdminModal.vue";

// inicializa a store de autenticação
const authStore = useAuthStore();

// referencias para controlar os modais
const vaultModal = ref();
const communitiesModal = ref();
const requestModal = ref();
const adminRequestsModal = ref();

// funções simples para abrir cada modal
const handleOpenVault = () => {
  vaultModal.value?.open();
};

const handleOpenCommunities = () => {
  communitiesModal.value?.open();
};

const handleRequestResearcher = () => {
  requestModal.value?.open();
};

const handleOpenAdminRequests = () => {
  adminRequestsModal.value?.open();
};

// busca os dados mais recentes assim que a tela abre
onMounted(() => {
  authStore.refreshProfile();
});
</script>

<style scoped>
/* estilos simples para complementar o bootstrap */
.text-dark {
  color: #212529;
}
</style>