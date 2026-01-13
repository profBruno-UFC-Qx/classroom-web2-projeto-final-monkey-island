<template>
  <div class="min-vh-100 bg-concrete pb-5">
    <div class="container pt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="d-flex align-items-center mb-4">
            <i class="bi bi-person-circle fs-2 text-dark-jungle me-3"></i>
            <h3 class="fw-black text-uppercase m-0 text-dark-jungle">
              Ficha do Pesquisador
            </h3>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="mt-3 text-muted fw-bold small">
              Acessando banco de dados...
            </p>
          </div>

          <div
            v-else-if="error"
            class="alert alert-danger border-0 shadow-sm fw-bold text-center"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
            <br />
            <button
              class="btn btn-outline-danger btn-sm mt-3"
              @click="fetchProfile"
            >
              Tentar Novamente
            </button>
          </div>

          <ProfileCard
            v-else-if="user"
            :user="user"
            @openVault="handleOpenVault"
            @openCommunities="handleOpenCommunities"
            @requestResearcher="handleRequestResearcher"
            @openAdminRequests="handleOpenAdminRequests"
          />

          <ProfileFeed v-if="user" />
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
import ProfileCard from "../components/profile/ProfileCard.vue";
import ProfileFeed from "../components/profile/ProfileFeed.vue";
import RelicsVaultModal from "../components/modals/RelicsVaultModal.vue";
import MyCommunitiesModal from "../components/modals/MyCommunitiesModal.vue";
import ResearcherRequestModal from "../components/modals/ResearcherRequestModal.vue";
import ResearcherRequestsAdminModal from "../components/modals/ResearcherRequestsAdminModal.vue"; // Importação do modal admin
import userService from "../services/userService";
import type { User } from "../types/user";

const user = ref<User | null>(null);
const loading = ref(true);
const error = ref("");

const vaultModal = ref();
const communitiesModal = ref();
const requestModal = ref();
const adminRequestsModal = ref();

const fetchProfile = async () => {
  loading.value = true;
  error.value = "";
  try {
    user.value = await userService.getMyProfile();
  } catch (err: any) {
    error.value =
      "Falha ao carregar credenciais. Sessão expirada ou erro no servidor.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleOpenVault = () => {
  if (vaultModal.value) vaultModal.value.open();
};

const handleOpenCommunities = () => {
  if (communitiesModal.value) communitiesModal.value.open();
};

const handleRequestResearcher = () => {
  if (requestModal.value) requestModal.value.open();
};

const handleOpenAdminRequests = () => {
  if (adminRequestsModal.value) {
    adminRequestsModal.value.open();
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
/* Estética InGen Industrial */
.bg-concrete {
  background-color: #dcdcdc;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
}
.text-dark-jungle {
  color: #1a2f2b;
}
.fw-black {
  font-weight: 900;
}
</style>
