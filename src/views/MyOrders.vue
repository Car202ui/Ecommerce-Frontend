<template>
  <div class="my-orders-view">
    <Card>
      <template #title>
        <h2>Mi Historial de Órdenes</h2>
      </template>
      <template #content>
        <div v-if="loading" class="text-center">
          <ProgressSpinner />
          <p>Cargando órdenes...</p>
        </div>
        <div v-else-if="orders.length > 0">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <Card>
              <template #title>
                Orden #{{ order.id }} - <small>({{ formatDate(order.orderDate) }})</small>
              </template>
              <template #content>
                <p><strong>Estado:</strong> {{ order.status }}</p>
                <p><strong>Total:</strong> {{ formatCurrency(order.finalAmount) }}</p>
                <DataTable :value="order.items" class="p-mt-3">
                  <Column field="productName" header="Producto"></Column>
                  <Column field="quantity" header="Cantidad"></Column>
                  <Column field="pricePerUnit" header="Precio Unitario">
                    <template #body="slotProps">
                      {{ formatCurrency(slotProps.data.pricePerUnit) }}
                    </template>
                  </Column>
                </DataTable>
              </template>
            </Card>
          </div>
        </div>
        <div v-else>
          <p>No tienes órdenes registradas.</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OrderService from '@/services/OrderService';
import type { OrderDto } from '@/types';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';

export default defineComponent({
  name: 'MyOrders',
  components: { Card, DataTable, Column, ProgressSpinner },
  setup() {
    const orders = ref<OrderDto[]>([]);
    const loading = ref(true);

    onMounted(async () => {
      try {
        const response = await OrderService.getOrdersForCurrentUser();
        orders.value = response.data;
      } catch (error) {
        console.error("Error al cargar las órdenes:", error);
      } finally {
        loading.value = false;
      }
    });

    const formatCurrency = (value: number) => {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const formatDate = (value: string) => {
      return new Date(value).toLocaleString();
    };

    return { orders, loading, formatCurrency, formatDate };
  },
});
</script>

<style scoped>
.my-orders-view {
  padding: 2rem;
}
.order-card {
  margin-bottom: 1rem;
}
.text-center {
  text-align: center;
}
</style>