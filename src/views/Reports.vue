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
          <template #title>Top 5 Productos Más Vendidos</template>
          <template #content>
            <DataTable :value="topSellingProducts" responsiveLayout="scroll">
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
            <DataTable :value="topFrequentCustomers" responsiveLayout="scroll">
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
import ReportService from '@/services/ReportService';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import type { TopSoldProductDto, TopCustomerDto } from '@/types';

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default defineComponent({
  name: 'ReportsView',
  components: { Card, DataTable, Column },
  setup() {
    const topSellingProducts = ref<TopSoldProductDto[]>([]);
    const topFrequentCustomers = ref<TopCustomerDto[]>([]);
    const authStore = useAuthStore();
    const router = useRouter();

    const fetchReports = async () => {
      try {
        const [soldProductsRes, frequentCustomersRes] = await Promise.all([
          ReportService.getTopSellingProductsReport(),
          ReportService.getTopFrequentCustomersReport()
        ]);
        topSellingProducts.value = soldProductsRes.data;
        topFrequentCustomers.value = frequentCustomersRes.data;
      } catch (error) {
        console.error("Error al cargar los reportes:", error);
        
        alert("Acceso denegado. No tienes los permisos de Administrador para ver esta sección.");
        router.push('/');
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

    return { topSellingProducts, topFrequentCustomers };
  },
});
</script>

<style scoped>
.reports-view {
  padding: 2rem;
}
</style>