<template>
  <div>
    <Card>
      <template #title>
        Gestión de Productos
      </template>
      <template #content>
        <DataTable :value="products" :loading="loading" responsiveLayout="scroll">
          <Column field="id" header="ID"></Column>
          <Column field="name" header="Nombre"></Column>
          <Column field="description" header="Descripción"></Column>
          <Column field="price" header="Precio">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.price) }}
            </template>
          </Column>
          <Column field="active" header="Activo">
              <template #body="slotProps">
                <i class="pi" :class="{'pi-check-circle': slotProps.data.active, 'pi-times-circle': !slotProps.data.active}"></i>
            </template>
          </Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <Button icon="pi pi-shopping-cart" label="Comprar" @click="addToCart(slotProps.data)"></Button>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ProductService from '@/services/ProductService';
import { useCartStore } from '../store/cart';
import type { Product } from '@/types'; 

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Button from 'primevue/button';

export default defineComponent({
  name: 'ProductsView',
  components: { DataTable, Column, Card, Button },
  setup() {
    const products = ref<Product[]>([]);
    const loading = ref(true);
    const cartStore = useCartStore();

    onMounted(async () => {
      try {
        const response = await ProductService.getAllProducts();
        products.value = response.data;
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        loading.value = false;
      }
    });

    const formatCurrency = (value: number) => {
      if (typeof value !== 'number') return '$0.00';
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const addToCart = (product: Product) => { 
      cartStore.addItem(product);
      console.log(`${product.name} añadido al carrito!`);
    };

    return { products, loading, formatCurrency, addToCart };
  }
});
</script>

<style>
.pi-check-circle {
    color: green;
}
.pi-times-circle {
    color: red;
}
</style>