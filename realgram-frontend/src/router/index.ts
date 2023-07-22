import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "@/components/views/LoginView.vue";
import RegisterView from "@/components/views/RegisterView.vue";
import RecoverPasswordView from "@/components/views/RecoverPasswordView.vue";
import DashboardView from "@/components/views/DashboardView.vue";
import TimelineView from "@/components/views/sessions/TimelineView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: LoginView,
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
    path: "/recover-password",
    name: "recover-password",
    component: RecoverPasswordView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    children: [
      {
        path: "",
        name: "timeline",
        component: TimelineView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
