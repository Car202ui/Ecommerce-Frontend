<template>
  <div class="reports-view">
    <Card class="p-mb-4">
      <template #title>Reportes</template>
      <template #subtitle>Información gerencial del e-commerce</template>
      <template #content>
        <p>Esta sección contiene reportes solo para administradores.</p>
      </template>
    </Card>

    <div class="p-grid">
      <div class="p-col-12 p-md-6 p-lg-4">
        <Card class="p-mb-4">
          <template #title>Productos Activos</template>
          <template #content>
            <DataTable :value="activeProducts" :loading="loading" responsiveLayout="scroll" :rows="5" paginator>
              <Column field="name" header="Producto"></Column>
              <Column field="price" header="Precio">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.price) }}
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <div class="p-col-12 p-md-6 p-lg-4">
        <Card class="p-mb-4">
          <template #title>Top 5 Productos Más Vendidos</template>
          <template #content>
            <DataTable :value="topSellingProducts" :loading="loading" responsiveLayout="scroll">
              <Column field="productName" header="Producto"></Column>
              <Column field="totalSold" header="Cantidad Vendida"></Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <div class="p-col-12 p-md-6 p-lg-4">
        <Card class="p-mb-4">
          <template #title>Top 5 Clientes Frecuentes</template>
          <template #content>
            <DataTable :value="topFrequentCustomers" :loading="loading" responsiveLayout="scroll">
              <Column field="username" header="Cliente"></Column>
              <Column field="orderCount" header="Órdenes"></Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReportService from '@/services/ReportService';
import { useAuthStore } from '@/store/auth';
import type { TopSoldProductDto, TopCustomerDto, Product } from '@/types';

// PrimeVue Components
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default defineComponent({
  name: 'ReportsView',
  components: { Card, DataTable, Column },
  setup() {
    const loading = ref(true);
    const topSellingProducts = ref<TopSoldProductDto[]>([]);
    const topFrequentCustomers = ref<TopCustomerDto[]>([]);
    const activeProducts = ref<Product[]>([]);
    const authStore = useAuthStore();
    const router = useRouter();

    const fetchReports = async () => {
      try {
        loading.value = true;
        // Hacemos todas las llamadas a la API en paralelo
        const [
          activeProductsRes,
          soldProductsRes,
          frequentCustomersRes
        ] = await Promise.all([
          ReportService.getActiveProductsReport(),
          ReportService.getTopSellingProductsReport(),
          ReportService.getTopFrequentCustomersReport()
        ]);
        
        activeProducts.value = activeProductsRes.data;
        topSellingProducts.value = soldProductsRes.data;
        topFrequentCustomers.value = frequentCustomersRes.data;

      } catch (error) {
        console.error("Error al cargar los reportes:", error);
        alert("Acceso denegado o error al cargar los reportes. Asegúrate de tener permisos de Administrador.");
        router.push('/');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      if (authStore.user?.roles?.includes('ROLE_ADMIN')) {
        fetchReports();
      } else {
        alert("Acceso denegado. Se requiere rol de Administrador.");
        router.push('/');
      }
    });
    
    const formatCurrency = (value: number) => {
      if (typeof value !== 'number') return '$0.00';
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return { 
        loading,
        topSellingProducts, 
        topFrequentCustomers, 
        activeProducts,
        formatCurrency
    };
  },
});
</script>

<style scoped>
.reports-view {
  padding: 2rem;
}
.p-grid {
    display: flex;
    flex-wrap: wrap;
    margin-right: -0.5rem;
    margin-left: -0.5rem;
    margin-top: -0.5rem;
}
.p-col-12, .p-md-6, .p-lg-4 {
    padding: 0.5rem;
}
@media screen and (min-width: 768px) {
    .p-md-6 {
        width: 50%;
    }
}
@media screen and (min-width: 992px) {
    .p-lg-4 {
        width: 33.3333%;
    }
}
</style>