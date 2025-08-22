<template>
  <div class="cart-view">
    <Card>
      <template #title>
        <h2>Mi Carrito de Compras</h2>
      </template>
      <template #content>
        <div v-if="cartStore.itemCount > 0">
          <DataTable :value="cartStore.items" responsiveLayout="scroll">
            <Column field="name" header="Producto"></Column>
            <Column field="price" header="Precio Unitario">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.price) }}
              </template>
            </Column>
            <Column field="quantity" header="Cantidad">
               <template #body="slotProps">
                 <InputNumber :modelValue="slotProps.data.quantity" @update:modelValue="qty => cartStore.updateQuantity(slotProps.data.id, qty)" showButtons :min="0" />
               </template>
            </Column>
            <Column header="Subtotal">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.price * slotProps.data.quantity) }}
              </template>
            </Column>
             <Column header="Acciones">
              <template #body="slotProps">
                <Button icon="pi pi-trash" class="p-button-danger" @click="cartStore.removeItem(slotProps.data.id)"></Button>
              </template>
            </Column>
          </DataTable>
          <div class="cart-summary">
            <h3>Total: {{ formatCurrency(cartStore.totalAmount) }}</h3>
            <Button label="Finalizar Compra" icon="pi pi-check" @click="handleCheckout"></Button>
          </div>
        </div>
        <div v-else>
          <p>Tu carrito está vacío.</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCartStore } from '@/store/cart';
import OrderService from '@/services/OrderService';
import { useRouter } from 'vue-router';


import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';


export default defineComponent({
  name: 'CartView',
  components: { Card, DataTable, Column, Button, InputNumber },
  setup() {
    const cartStore = useCartStore();
    const router = useRouter();

    const formatCurrency = (value: number) => {
      if (typeof value !== 'number') return '$0.00';
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const handleCheckout = async () => {
      try {
        await OrderService.createOrder(cartStore.items);
        alert('¡Pedido realizado con éxito!');
        cartStore.clearCart();
        router.push('/my-orders'); // Lo redirigimos a la futura página de "Mis Órdenes"
      } catch (error) {
        console.error("Error al crear la orden:", error);
        alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
      }
    };

    return {
      cartStore,
      formatCurrency,
      handleCheckout
    };
  }
});
</script>

<style scoped>
.cart-summary {
  text-align: right;
  margin-top: 2rem;
}
</style>