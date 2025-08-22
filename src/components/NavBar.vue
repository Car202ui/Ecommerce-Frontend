<template>
  <div>
   <Menubar :model="items">
    <template #end>
        <Button icon="pi pi-shopping-cart" class="p-button-rounded p-button-text p-mr-2" :badge="cartItemCount > 0 ? cartItemCount.toString() : null" badgeClass="p-badge-danger" @click="goToCart" />

        <Button v-if="isLoggedIn" label="Logout" icon="pi pi-power-off" @click="handleLogout" class="p-button-text" />
    </template>
</Menubar>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed } from 'vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'NavBar',
  components: {
    Menubar,
    Button
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const isLoggedIn = computed(() => authStore.isLoggedIn);

    const items = computed(() => [
      {
        label: 'Productos',
        icon: 'pi pi-fw pi-box',
        to: '/products',
        visible: isLoggedIn.value
      },
      {
        label: 'Mis Órdenes',
        icon: 'pi pi-fw pi-shopping-cart',
        to: '/my-orders',
        visible: isLoggedIn.value
      },
      {
        label: 'Reportes',
        icon: 'pi pi-fw pi-chart-bar',
        to: '/reports',
        visible: isLoggedIn.value // Podríamos agregar una condición para rol de admin aquí
      }
    ]);

    const handleLogout = () => {
      authStore.logout();
      router.push('/login');
    };

    return { items, isLoggedIn, handleLogout };
  }
});
</script>