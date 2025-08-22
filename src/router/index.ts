// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/Login.vue'
import { useAuthStore } from '@/store/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    redirect: '/products'
  },
  // Un ejemplo de la futura página de productos
  {
    path: '/products',
    name: 'products',
    // Lazy loading: el componente solo se carga cuando se visita
    component: () => import(/* webpackChunkName: "products" */ '../views/Products.vue'),
    meta: { requiresAuth: true } // Marcamos que esta ruta requiere autenticación
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isLoggedIn) {
    // Si la ruta requiere auth y no está logueado, redirige a login
    next('/login');
  } else {
    // De lo contrario, permite el acceso
    next();
  }
});

export default router