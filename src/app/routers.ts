import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "./auth.store";
import { routes } from "./routes";

const Movies = () => import("@/pages/Movies.vue");
const Movie = () => import("@/pages/Movie.vue");
const Cinemas = () => import("@/pages/Cinemas.vue");
const Cinema = () => import("@/pages/Cinema.vue");
const Login = () => import("@/pages/Login.vue");
const Register = () => import("@/pages/Register.vue");
const MyTickets = () => import("@/pages/MyTickets.vue");
const SeatSelection = () => import("@/pages/SeatSelection.vue");

const routesList = [
  { path: routes.root, name: "root", component: Movies },
  { path: routes.movie, name: "movie", component: Movie },
  { path: routes.cinemas, name: "cinemas", component: Cinemas },
  { path: routes.cinema, name: "cinema", component: Cinema },
  { path: routes.login, name: "login", component: Login },
  { path: routes.register, name: "register", component: Register },
  { path: routes.seatSelection, name: "seatSelection", component: SeatSelection },
  { path: routes.myTickets, name: "myTickets", component: MyTickets, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", name: "notFound", redirect: { name: "root" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routesList,
});

router.beforeEach((to, _, next) => {
  if (typeof window === "undefined") {
    return next();
  }

  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore?.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.public && authStore?.isAuthenticated) {
    next({ name: "root" });
    return;
  }

  next();
});

export default router;
