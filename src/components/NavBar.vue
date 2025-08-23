<template>
  <nav class="navbar">
    <!-- Brand + Hamburguesa -->
    <div class="nav-start">
      <div class="brand" @click="$router.push('/products')">
        <i class="pi pi-shopping-bag"></i>
        <span>E-Commerce</span>
      </div>

      <Button
        class="hamburger p-button-text p-button-rounded"
        icon="pi pi-bars"
        @click="menuOpen = !menuOpen"
        aria-label="Abrir menú"
      />
    </div>

    <!-- Links -->
    <div class="nav-middle" :class="{ open: menuOpen }">
      <RouterLink to="/products" class="nav-link">
        <i class="pi pi-tags"></i><span>Productos</span>
      </RouterLink>

      <RouterLink to="/my-orders" class="nav-link">
        <i class="pi pi-receipt"></i><span>Mis Órdenes</span>
      </RouterLink>

      <RouterLink to="/reports" class="nav-link">
        <i class="pi pi-chart-bar"></i><span>Reportes</span>
      </RouterLink>

      <RouterLink v-if="isAdmin" to="/users" class="nav-link">
        <i class="pi pi-users"></i><span>Usuarios</span>
      </RouterLink>

      <!-- Inventario con más contraste para que no se pierda -->
      <RouterLink v-if="isAdmin" to="/inventory" class="nav-link strong">
        <i class="pi pi-database"></i><span>Inventario</span>
      </RouterLink>
    </div>

    <!-- Acciones -->
    <div class="nav-end">
      <Button
        icon="pi pi-shopping-cart"
        class="p-button-rounded p-button-text cart-btn"
        :badge="cartItemCount > 0 ? cartItemCount.toString() : undefined"
        badgeClass="p-badge-danger"
        @click="goToCart"
        aria-label="Carrito"
      />
      <Button
        v-if="isLoggedIn"
        label="Logout"
        icon="pi pi-power-off"
        class="p-button-text logout-btn"
        @click="handleLogout"
      />
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Button from 'primevue/button';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NavBar',
  components: { Button },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const router = useRouter();

    // roles puede venir como array de strings o de objetos
    const isAdmin = computed(() => {
      const r = authStore.user?.roles;
      if (!r) return false;
      return Array.isArray(r) && r.some((x: any) => x === 'ROLE_ADMIN' || x?.name === 'ROLE_ADMIN');
    });

    const isLoggedIn = computed(() => authStore.isLoggedIn);
    const cartItemCount = computed(() => cartStore.itemCount);

    const handleLogout = () => {
      authStore.logout();
      cartStore.clearCart();
      router.push('/login');
    };
    const goToCart = () => router.push('/cart');

    // menú responsive
    const menuOpen = ref(false);

    return { isAdmin, isLoggedIn, cartItemCount, handleLogout, goToCart, menuOpen };
  }
});
</script>

<style scoped>
/* Contenedor */
.navbar{
  position: sticky; top: 0; z-index: 50;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: .75rem;
  padding: .6rem 1rem;

  /* Fondo con leve gradiente + blur */
  background: linear-gradient(90deg, #0f172a 0%, #111827 60%, #0b1220 100%);
  backdrop-filter: saturate(140%) blur(6px);
  border-bottom: 1px solid rgba(255,255,255,.06);
  box-shadow: 0 4px 18px rgba(0,0,0,.25);
  color: #e5e7eb;
}

/* Brand */
.nav-start{ display:flex; align-items:center; gap: .5rem; }
.brand{
  display:flex; align-items:center; gap:.5rem; cursor:pointer; user-select:none;
  padding: .25rem .5rem; border-radius: 10px;
}
.brand .pi{ color:#60a5fa; font-size:1.1rem; }
.brand span{ font-weight:700; letter-spacing:.2px; }

/* Hamburguesa (solo móvil) */
.hamburger{ display:none; }

/* Links */
.nav-middle{
  display:flex; align-items:center; gap:.4rem; flex-wrap: wrap;
}
.nav-link{
  display:inline-flex; align-items:center; gap:.45rem;
  padding: .45rem .75rem;
  border-radius: 10px;
  color:#cbd5e1; text-decoration:none; font-weight:600; font-size:.95rem;
  transition: all .15s ease;
  opacity:.95;
}
.nav-link .pi{ font-size: 1rem; }
.nav-link:hover{ background: rgba(255,255,255,.06); color:#ffffff; opacity:1; }

/* Estado activo de router */
.nav-link.router-link-exact-active{
  background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
  color:#0b1220;
  box-shadow: 0 6px 20px rgba(56,189,248,.25);
}

/* Inventario con más énfasis para que no se “pierda” */
.nav-link.strong{
  border: 1px solid rgba(59,130,246,.35);
}

/* Acciones derecha */
.nav-end{ display:flex; align-items:center; gap:.25rem; }
.cart-btn :deep(.p-badge){ transform: translate(-4px, -6px); }
.logout-btn{ color:#fca5a5; }
.logout-btn:hover{ color:#fecaca; }

/* Responsive */
@media (max-width: 860px){
  .navbar{ grid-template-columns: 1fr auto; grid-auto-rows:auto; }
  .hamburger{ display:inline-flex; }
  .nav-middle{
    grid-column: 1 / -1;
    display:none;
    margin-top:.4rem; padding-top:.4rem;
    border-top:1px dashed rgba(255,255,255,.08);
  }
  .nav-middle.open{ display:flex; }
}
</style>
