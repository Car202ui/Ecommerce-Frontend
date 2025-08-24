<template>
  <div class="cart-view">
    <Card>
      <template #title><h2>Mi Carrito de Compras</h2></template>

      <template #content>
        <div v-if="cartStore.itemCount > 0">
          <DataTable :value="cartStore.items" responsiveLayout="scroll">
            <Column field="name" header="Producto" />
            <Column field="price" header="Precio Unitario">
              <template #body="{ data }">{{ formatCurrency(data.price) }}</template>
            </Column>
            <Column field="quantity" header="Cantidad">
              <template #body="{ data }">
                <InputNumber
                  :modelValue="data.quantity"
                  @update:modelValue="(qty) => onQtyChange(data.id, qty)"
                  showButtons
                  :min="1"
                />
              </template>
            </Column>
            <Column header="Subtotal">
              <template #body="{ data }">
                {{ formatCurrency(data.price * data.quantity) }}
              </template>
            </Column>
            <Column header="Acciones">
              <template #body="{ data }">
                <Button icon="pi pi-trash" class="p-button-danger" @click="cartStore.removeItem(data.id)" />
              </template>
            </Column>
          </DataTable>
       <div class="promo-row">
  <InputSwitch v-model="randomOrder" inputId="rand" />
  <label for="rand" class="promo-label">Orden aleatoria (50% OFF si la promo está activa)</label>
</div>

          <div class="cart-summary">
            <h3>Total: {{ formatCurrency(cartStore.totalAmount) }}</h3>
            <Button
              label="Finalizar Compra"
              icon="pi pi-check"
              :disabled="processing || cartStore.itemCount === 0"
              :loading="processing"
              @click="handleCheckout"
            />
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
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cart';
import OrderService from '@/services/OrderService';
import { useToast } from 'primevue/usetoast';

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';

export default defineComponent({
  name: 'CartView',
  components: { Card, DataTable, Column, Button, InputNumber,InputSwitch},
  setup() {
    const cartStore = useCartStore();
    const router = useRouter();
    const toast = useToast();
    const processing = ref(false);
    const randomOrder = ref(false);

    const formatCurrency = (value: number) =>
      typeof value === 'number' ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';

    const onQtyChange = (id: number, qty: number | null) => {
      const q = Math.max(1, Number(qty ?? 1));
      cartStore.updateQuantity(id, q);
    };

    const handleCheckout = async () => {
      if (processing.value || cartStore.itemCount === 0) return;
      processing.value = true;
      try {
      
        await OrderService.createOrder(cartStore.items,{ random: randomOrder.value });
        toast.add({ severity: 'success', summary: 'Pedido creado', detail: 'Gracias por tu compra' });
        cartStore.clearCart();
        router.push('/my-orders');
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.response?.data ||
          e?.message ||
          'Error procesando el pedido';
        toast.add({ severity: 'error', summary: 'No se pudo completar', detail: String(msg), life: 6000 });
        console.error('Checkout error:', e);
      } finally {
        processing.value = false;
      }
    };

    return { cartStore, formatCurrency, onQtyChange, handleCheckout, processing, randomOrder };
  }
});
</script>

<style scoped>
.cart-summary { text-align: right; margin-top: 2rem; }
.promo-row { display:flex; align-items:center; gap:.5rem; margin-top:1rem; }
.promo-label { user-select:none; }
</style>
