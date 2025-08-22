<template>
  <div class="navbar-container">
    <div class="navbar-links">
      <router-link to="/products" class="navbar-link">Productos</router-link>
      <router-link to="/my-orders" class="navbar-link">Mis Órdenes</router-link>
      <router-link to="/reports" class="navbar-link">Reportes</router-link>
    </div>
    <div class="navbar-end">
      <Button icon="pi pi-shopping-cart" class="p-button-rounded p-button-text p-mr-2" :badge="cartItemCount > 0 ? cartItemCount.toString() : undefined" badgeClass="p-badge-danger" @click="goToCart" />
      <Button v-if="isLoggedIn" label="Logout" icon="pi pi-power-off" @click="handleLogout" class="p-button-text" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Button from 'primevue/button';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NavBar',
  components: {
    Button
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const router = useRouter();

    const isLoggedIn = computed(() => authStore.isLoggedIn);
    const cartItemCount = computed(() => cartStore.itemCount);

    const handleLogout = () => {
      authStore.logout();
      cartStore.clearCart();
      router.push('/login');
    };

    const goToCart = () => {
      router.push('/cart');
    };

    return { isLoggedIn, handleLogout, cartItemCount, goToCart };
  }
});
</script>

<style scoped>
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
}

.navbar-link {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
}

.navbar-link.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.navbar-end {
  display: flex;
  align-items: center;
}
</style>