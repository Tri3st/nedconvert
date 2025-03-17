import {createRouter, createWebHistory} from "vue-router";
import type {RouteRecordRaw} from "vue-router";
import CreateView from "./views/CreateView.vue";
import ConvertView from "./views/ConvertView.vue";
import LoginView from "./views/LoginView.vue";
import LogoutView from "./views/LogoutView.vue";
import HomeView from "@/views/HomeView.vue";
import {useAuthStore} from "@/stores/auth.ts";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {requiresAuth: false}
  },
  {
    path: '/create',
    name: 'create',
    component: CreateView,
    meta: {requiresAuth: true}
  },
  {
    path: '/convert',
    name: 'convert',
    component: ConvertView,
    meta: {requiresAuth: true}
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {requiresAuth: false}
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutView,
    meta: {requiresAuth: true}
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});


// Navigation Guard
router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore();
  await authStore.checkSession(); // Ensure session is checked before each navigation

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated()) {
    // Redirect to login page if not authenticated
    next('/login');
  } else if (to.name === 'login' && authStore.isAuthenticated()) {
    // Redirect to home if already logged in and trying to access login
    next('/');
  } else {
    // Proceed to the route
    next();
  }
});