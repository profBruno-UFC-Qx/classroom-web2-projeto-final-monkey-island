import CommunityView from "@/views/CommunityView.vue";
import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("../views/HomeView.vue");
const LoginView = () => import("../views/LoginView.vue");
const RegisterView = () => import("../views/RegisterView.vue");
const PublishPostView = () => import("../views/PublishPostView.vue");
const CommunitiesView = () => import("../views/CommunitiesView.vue");
const ProfileView = () => import("../views/ProfileView.vue");
const DinoGameView = () => import("../views/DinoGameView.vue");
const RankingsView = () => import("../views/RankingsView.vue");

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
