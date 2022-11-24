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
    component: () => import("../page/Home.vue"),
    children: [
      {
        path: "",
        name: "List",
        component: () => import("../components/List.vue"),
      },
      {
        path: "typeList/:type",
        name: "typeList",
        component: () => import("../components/TypeList.vue"),
      },
      {
        path: "shareList",
        name: "shareList",
        component: () => import("../components/ShareList.vue"),
      },
      {
        path: "sizeList",
        name: "sizeList",
        component: () => import("../components/SizeList.vue"),
      },
    ],
  },
  {
    path: "/share/:shareId",
    name: "Share",
    component: () => import("../page/Share.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let page = new Set<string>();
page.add("Login");
page.add("Share");

router.beforeEach((to, from, next) => {
  let token = store.state.token;
  if (token == "" && !page.has(String(to.name))) {
    next({ name: "Login" });
  } else next();
});

export default router;
