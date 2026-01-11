import { createRouter, createWebHistory } from "vue-router";

// Importações Lazy Loading
const HomeView = () => import("../views/HomeView.vue");
const LoginView = () => import("../views/LoginView.vue");
const RegisterView = () => import("../views/RegisterView.vue");
const PublishPostView = () => import("../views/PublishPostView.vue");
const CommunitiesView = () => import("../views/CommunitiesView.vue");
// Adicionada a view de Perfil
const ProfileView = () => import("../views/ProfileView.vue");

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
  // --- NOVA ROTA ADICIONADA ---
  {
    path: "/perfil",
    name: "perfil",
    component: ProfileView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;