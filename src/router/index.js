import Home from "../views/Home.vue";
import { UI_ROUTES } from "../constants";
import Vue from "vue";
import VueRouter from "vue-router";

const { REGISTER, LOGIN } = UI_ROUTES;

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: REGISTER,
    name: [REGISTER],
    component: () => import("../views/register/index.vue")
  },
  {
    path: LOGIN,
    name: [LOGIN],
    component: () => import("../views/login/index.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
