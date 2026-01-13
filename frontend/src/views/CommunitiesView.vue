<template>
  <div class="min-vh-100 bg-concrete">
    <div class="container-fluid py-4 d-flex gap-4">
      <!-- LISTA -->
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <input
            v-model="search"
            class="form-control w-50"
            placeholder="Buscar comunidade..."
          />

          <button
            v-if="isResearcher"
            class="btn btn-primary fw-black"
            @click="openCreateModal"
          >
            <i class="bi bi-plus-circle me-2"></i>Criar Comunidade
          </button>
        </div>

        <h6 class="fw-black text-uppercase mb-3">Comunidades Disponíveis</h6>

        <div class="row g-3">
          <div
            class="col-md-4"
            v-for="community in filteredCommunities"
            :key="community.id"
          >
            <CommunityCard :community="community" @select="selectCommunity" />
          </div>
        </div>

        <hr class="my-4" />

        <h6 class="fw-black text-uppercase mb-3">Minhas Comunidades</h6>

        <div class="row g-3">
          <div
            class="col-md-4"
            v-for="community in myCommunities"
            :key="community.id"
          >
            <CommunityCard :community="community" @select="selectCommunity" />
          </div>
        </div>
      </div>

      <!-- ASIDE -->
      <CommunityAside :community="selectedCommunity" />
    </div>

    <CreateCommunityModal ref="createModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";
import communityService from "../services/communityService";
import CommunityCard from "../components/community/CommunityCard.vue";
import CommunityAside from "../components/community/CommunityAside.vue";
import CreateCommunityModal from "../components/community/CreateCommunityModal.vue";

const authStore = useAuthStore();

const communities = ref<any[]>([]);
const myCommunities = ref<any[]>([]);
const selectedCommunity = ref<any | null>(null);
const search = ref("");

const createModal = ref();

const isResearcher = computed(() => authStore.user?.role === "researcher");

const filteredCommunities = computed(() =>
  communities.value.filter((c) =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const selectCommunity = (community: any) => {
  selectedCommunity.value = community;
};

const openCreateModal = () => {
  createModal.value?.open();
};

onMounted(async () => {
  // communities.value = (await communityService.getAll()).data;
  myCommunities.value = (await communityService.getMyCommunities()).data;
});
</script>

<style scoped>
.bg-concrete {
  background-color: #dcdcdc;
  background-image: radial-gradient(#1a2f2b 0.8px, transparent 0.8px);
  background-size: 18px 18px;
}
.fw-black {
  font-weight: 900;
}
</style>
