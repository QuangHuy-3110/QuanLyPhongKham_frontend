import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from '@/stores/authStore';

import Doctor from "@/views/doctor.vue";
import Patient from "@/views/patient.vue";
import Admin from "@/views/admin.vue";
import Register from "@/views/register.vue";
import Login from "@/views/Login.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/login",
    name: "loginform",
    component: Login,
  },
  {
    path: "/register",
    name: "registerform",
    component: Register,
  },
  {
    path: "/doctor/",
    name: "doctor",
    component: Doctor,
    meta: { requiresAuth: true, role: 'doctor' },
  },
  {
    path: "/admin/",
    name: "admin",
    component: Admin,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: "/",
    name: "patient",
    component: Patient,
    // meta: { requiresAuth: true, role: 'benhnhan' },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      next({ name: 'loginform' }); // Chuyển hướng về login nếu chưa đăng nhập
    } else if (to.meta.role && authStore.user.role !== to.meta.role) {
      // Chuyển hướng nếu vai trò không khớp
      next({ name: authStore.user.role === 'benhnhan' ? 'patient' : authStore.user.role });
    } else {
      next(); // Cho phép truy cập nếu đã đăng nhập và vai trò khớp
    }
  } else {
    next(); // Cho phép truy cập các trang không yêu cầu xác thực
  }
});

export default router;