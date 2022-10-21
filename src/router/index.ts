import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "Login",
    component: () => import("../page/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../page/home.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  let token = store.state.token;
  if (token == "" && to.name !== "Login") {
    next({ name: "Login" });
  } else next();
});

export default router;
