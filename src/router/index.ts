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
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/Cart.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/products',
    name: 'products',
    component: () => import(/* webpackChunkName: "products" */ '../views/Products.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import(/* webpackChunkName: "reports" */ '../views/Reports.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/my-orders',
    name: 'my-orders',
    component: () => import(/* webpackChunkName: "my-orders" */ '../views/MyOrders.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !authStore.isLoggedIn) {
    next('/login');
  } else if (requiresAdmin && !authStore.user?.roles?.includes('ROLE_ADMIN')) {
    alert('Acceso denegado. Se requiere rol de Administrador.');
    next('/');
  } else {
    next();
  }
});

export default router