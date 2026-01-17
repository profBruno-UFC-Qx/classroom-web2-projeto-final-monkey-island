import CommunityView from "@/views/CommunityView.vue";
import PostDetailsView from '../views/PostDetailsView.vue';
import { createRouter, createWebHistory } from "vue-router";
import AdminUsersView from '../views/admin/AdminUsersView.vue';
import AdminArtifactsView from '../views/admin/AdminArtifactsView.vue';
import AdminRequestsView from '../views/admin/AdminRequestsView.vue';
import { useAuthStore } from '@/stores/authStore';
const HomeView = () => import("@/views/HomeView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const RegisterView = () => import("@/views/RegisterView.vue");
const PublishPostView = () => import("@/views/ProfileView.vue");
const CommunitiesView = () => import("@/views/CommunitiesView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const DinoGameView = () => import("@/views/DinoGameView.vue");
const RankingsView = () => import("@/views/RankingsView.vue");

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
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
    path: "/publicar",
    name: "publicar-post",
    component: PublishPostView,
  },
  {
    path: "/comunidades",
    name: "comunidades",
    component: CommunitiesView,
  },
  {
    path: "/comunidades/:id",
    name: "comunidade",
    component: CommunityView,
    props: true,
  },

  {
    path: "/perfil",
    name: "perfil",
    component: ProfileView,
  },
  {
  path: '/game',
  name: 'game',
  component: DinoGameView,
  },
  {
    path: "/rankings",
    name: "rankings",
    component: RankingsView,
  },
  {
      path: '/posts/:id',
      name: 'post-details',
      component: PostDetailsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/artifacts',
      name: 'admin-artifacts',
      component: AdminArtifactsView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/requests',
      name: 'admin-requests',
      component: AdminRequestsView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  const isAdmin = authStore.user?.role === 'ADMIN';

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
