import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import CommunitiesView from "../views/CommunitiesView.vue";
import CommunityView from "../views/CommunityView.vue";
import ProfileView from "../views/ProfileView.vue";
import RankingsView from "../views/RankingsView.vue";
import DinoGameView from "../views/DinoGameView.vue";
import PostDetailsView from "../views/PostDetailsView.vue";
// Importação das Views de Admin
import AdminUsersView from "../views/admin/AdminUsersView.vue";
import AdminArtifactsView from "../views/admin/AdminArtifactsView.vue";
import AdminRequestsView from "../views/admin/AdminRequestsView.vue";

import { useAuthStore } from "@/stores/authStore";
import NotFoundView from "@/views/NotFoundView.vue";

const router = createRouter({
  // CORREÇÃO: Usar import.meta.env.BASE_URL ou '/' em vez da URL do backend
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/home",
      redirect: "/",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/comunidades",
      name: "communities",
      component: CommunitiesView,
    },
    {
      path: "/comunidades/:id",
      name: "community-details",
      component: CommunityView,
      props: true,
    },
    {
      path: "/perfil",
      name: "profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/rankings",
      name: "rankings",
      component: RankingsView,
    },
    {
      path: "/dino-game",
      name: "dino-game",
      component: DinoGameView,
    },
    {
      path: "/posts/:id",
      name: "post-details",
      component: PostDetailsView,
      props: true,
    },
    // --- ROTAS DE ADMIN ---
    {
      path: "/admin/users",
      name: "admin-users",
      component: AdminUsersView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/artifacts",
      name: "admin-artifacts",
      component: AdminArtifactsView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/requests",
      name: "admin-requests",
      component: AdminRequestsView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    // ----------------------
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: NotFoundView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.token) {
    return next({ name: "login" });
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== "admin") {
    return next({ name: "home" });
  }

  next();
});

export default router;
