import { ACCOUNT_TYPES, UI_ROUTES } from "../constants";

import Home from "../views/home/index.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import { getters } from "../store";

const {
  REGISTER,
  LOGIN,
  HOME,
  CREATE_PRESCRIPTION,
  EDIT_PRESCRIPTION
} = UI_ROUTES;

const { PRESCRIBER } = ACCOUNT_TYPES;

Vue.use(VueRouter);

const routes = [
  {
    path: HOME,
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: CREATE_PRESCRIPTION,
    component: () => import("../views/prescription/create/index.vue"),
    meta: {
      requiresAuth: true,
      isCreator: true
    }
  },
  {
    path: EDIT_PRESCRIPTION,
    component: () => import("../views/prescription/edit/index.vue"),
    meta: {
      requiresAuth: true,
      isCreator: true,
      isOpen: true
    }
  },
  {
    path: "/about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      requiresNotAuth: true
    }
  },
  {
    path: REGISTER,
    name: [REGISTER],
    component: () => import("../views/register/index.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: LOGIN,
    component: () => import("../views/login/index.vue"),
    meta: {
      requiresAuth: false
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (getters.loggedIn()) {
      if (to.matched.some(record => record.meta.isCreator)) {
        if (getters.accountType() !== PRESCRIBER) next(HOME);
      }
      if (to.matched.some(record => record.meta.isAllowed)) {
        if (!getters.prescription()._id) next(HOME);
      }
      next();
    } else next(LOGIN); // path protected, go log in first
  } else if (to.matched.some(record => record.meta.requiresNotAuth)) next();
  // no auth path go on
  else if (to.matched.some(record => !record.meta.requiresNotAuth)) {
    if (getters.loggedIn()) next(HOME);
    // logged in already, can't go here
    next();
  }
  next();
});

export default router;
