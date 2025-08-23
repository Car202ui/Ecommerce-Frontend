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

                <div class="totals">
                  <p>
                    <strong>Total (antes):</strong>
                    {{ formatCurrency(num(order.totalAmount)) }}
                  </p>

                  <p>
                    <strong>Descuento:</strong>
                    <Tag
                      v-if="num(order.discountApplied) > 0"
                      :value="`- ${formatCurrency(num(order.discountApplied))}`"
                      severity="success"
                    />
                    <span v-else>—</span>
                  </p>

                  <p class="final">
                    <strong>Total a pagar:</strong>
                    <span>{{ formatCurrency(num(order.finalAmount)) }}</span>
                  </p>
                </div>

                <DataTable :value="order.items || []" class="p-mt-3" responsiveLayout="scroll">
                  <Column field="productName" header="Producto"></Column>
                  <Column field="quantity" header="Cantidad" style="width:120px"></Column>
                  <Column field="pricePerUnit" header="Precio Unitario" style="width:160px">
                    <template #body="slotProps">
                      {{ formatCurrency(num(slotProps.data.pricePerUnit)) }}
                    </template>
                  </Column>
                  <Column header="Subtotal" style="width:160px">
                    <template #body="slotProps">
                      {{ formatCurrency(num(slotProps.data.pricePerUnit) * num(slotProps.data.quantity)) }}
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
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';

export default defineComponent({
  name: 'MyOrders',
  components: { Card, DataTable, Column, ProgressSpinner, Tag },
  setup() {
    const orders = ref<any[]>([]);
    const loading = ref(true);

    onMounted(async () => {
      try { orders.value = (await OrderService.getOrdersForCurrentUser()).data || []; }
      catch (e) { console.error('Error al cargar las órdenes:', e); }
      finally { loading.value = false; }
    });

    const num = (v: any) => (typeof v === 'number' ? v : Number(v) || 0);
    const formatCurrency = (v: number) =>
      v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const formatDate = (iso: string) => {
      const d = new Date(iso); return isNaN(d.getTime()) ? iso : d.toLocaleString();
    };

    return { orders, loading, formatCurrency, formatDate, num };
  }
});
</script>

<style scoped>
.my-orders-view { padding: 2rem; }
.order-card { margin-bottom: 1rem; }
.text-center { text-align: center; }
.totals { margin-top: .5rem; }
.totals .final span { font-weight: 700; }
</style>
