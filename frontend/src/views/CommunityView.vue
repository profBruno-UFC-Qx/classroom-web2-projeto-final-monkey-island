<template>
  <div class="min-vh-100 bg-light">
    
    <header class="bg-dark text-white py-5 mb-5 shadow-sm">
      <div class="container text-center">
        <h1 class="display-5 fw-bold text-uppercase">
          <i class="bi bi-people-fill me-3 text-secondary"></i>
          {{ communityStore.selectedCommunity?.name || "carregando..." }}
        </h1>
      </div>
    </header>

    <div class="container pb-5">
      <div class="row g-4">
        
        <div class="col-lg-8">
          
          <FeedStatusCard @open-create="isCreateModalOpen = true" />

          <CommunityFeed 
            :posts="postStore.posts"
            :is-loading="postStore.isLoading"
            :page="postStore.page"
            :total-pages="postStore.totalPages"
            @load-more="postStore.loadMore"
          />
        </div>

        <div class="col-lg-4">
          <CommunityInfoWidget :community="communityStore.selectedCommunity" />
        </div>
      </div>
    </div>

    <CreatePostModal
      v-if="canCreatePost"
      :is-open="isCreateModalOpen"
      :community-id="communityId"
      @close="isCreateModalOpen = false"
      @post-created="handlePostCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useAuthStore } from "../stores/authStore";
import { usePostStore } from "../stores/postStore";
import { useCommunityStore } from "../stores/communityStore";

// imports dos novos componentes
import FeedStatusCard from "../components/feed/FeedStatusCard.vue";
import CommunityFeed from "../components/community/CommunityFeed.vue";
import CommunityInfoWidget from "../components/community/CommunityInfoWidget.vue";
import CreatePostModal from "../components/modals/CreatePostModal.vue";

const props = defineProps<{ id: string }>();
const communityId = ref<string>(props.id || "");
const isCreateModalOpen = ref(false);

const authStore = useAuthStore();
const postStore = usePostStore();
const communityStore = useCommunityStore();

const canCreatePost = computed(() => authStore.isAuthenticated && authStore.user?.role === "researcher");

const handlePostCreated = async () => {
  isCreateModalOpen.value = false;
  await postStore.fetchPosts(false);
};

// inicialização dos dados
onMounted(async () => {
  postStore.setContext(communityId.value);
  await Promise.all([
    communityStore.fetchActiveCommunity(communityId.value),
    postStore.fetchPosts(false),
  ]);
});

// limpeza ao sair
onUnmounted(() => {
  communityStore.clearSelection();
  postStore.setContext(null);
});
</script>