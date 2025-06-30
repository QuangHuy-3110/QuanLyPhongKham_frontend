import { createWebHistory, createRouter } from "vue-router";
// import { useAuthStore } from '@/stores/authStore';

import Doctor from "@/views/doctor.vue";
import Patient from "@/views/patient.vue";
import Admin from "@/views/admin.vue";
import Register from "@/views/register.vue"
import Login from "@/views/Login.vue"

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
    meta: { requiresAuth: true },
  },

  {
    path: "/admin/",
    name: "admin",
    component: Admin,
    meta: { requiresAuth: true },
  },

  {
    path: "/",
    name: "patient",
    component: Patient,
    // meta: { requiresAuth: true },
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

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
  
//   if (to.meta.requiresAuth && !authStore.user) {
//     // Nếu trang yêu cầu đăng nhập nhưng người dùng chưa đăng nhập, chuyển hướng về trang login
//     next({ name: 'patient' });
//   } else {
//     next(); // Nếu không có yêu cầu đăng nhập hoặc người dùng đã đăng nhập, tiếp tục
//   }
// });

export default router;