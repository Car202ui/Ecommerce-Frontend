<template>
  <div>
    <Card>
      <template #title>Gestión de Productos</template>

      <template #content>
     
        <div class="searchbar">
          <div class="p-inputgroup w-full">
            <InputText
              v-model="searchText"
              placeholder="Buscar productos por nombre o descripción…"
              @keyup.enter="doSearch"
            />
            <Button icon="pi pi-times" class="p-button-text p-button-plain" @click="clearSearch" />
            <Button label="Buscar" icon="pi pi-search" @click="doSearch" />
            <Button
              label="Más filtros"
              icon="pi pi-sliders-h"
              class="p-button-outlined"
              @click="showAdvanced = !showAdvanced"
            />
            <Button
              v-if="isAdmin"
              label="Crear"
              icon="pi pi-plus"
              class="p-ml-2"
              @click="openCreate"
            />
          </div>

          <transition name="fade">
            <div v-if="showAdvanced" class="advanced grid">
              <div class="field col-12 md:col-3">
                <label>Precio mín.</label>
                <InputNumber v-model="filters.minPrice" mode="currency" currency="USD" />
              </div>
              <div class="field col-12 md:col-3">
                <label>Precio máx.</label>
                <InputNumber v-model="filters.maxPrice" mode="currency" currency="USD" />
              </div>
              <div class="field col-12 md:col-3">
                <label>Estado</label>
                <Dropdown v-model="filters.active" :options="activeOptions" optionLabel="label" optionValue="value" />
              </div>
              <div class="field col-12 md:col-3">
                <label>ID exacto</label>
                <InputNumber v-model="filters.id" :useGrouping="false" />
              </div>
              <div class="col-12 flex gap-2">
                <Button label="Aplicar filtros" icon="pi pi-filter" @click="doSearch" />
                <Button label="Limpiar" icon="pi pi-times" class="p-button-text" @click="resetFilters" />
              </div>
            </div>
          </transition>
        </div>

    
        <DataTable :value="products" :loading="loading" responsiveLayout="scroll" dataKey="id" rowHover>
          <Column field="id" header="ID" style="width:90px"  sortable/>
          <Column field="name" header="Nombre" sortable/>
          <Column field="description" header="Descripción" sortable />
          <Column field="price" header="Precio" style="width:160px" sortable>
            <template #body="{ data }">{{ formatCurrency(num(data.price)) }}</template>
          </Column>
          <Column field="stock" header="Stock" style="width:120px" sortable>
  <template #body="{ data }">
    <span :class="{ 'p-error font-semibold': (data.stock ?? 0) === 0 }">
      {{ (data.stock ?? 0).toLocaleString() }}
    </span>
  </template>
</Column>
          <Column field="active" header="Activo" style="width:120px" sortable>
            <template #body="{ data }">
              <i class="pi" :class="{ 'pi-check-circle': data.active, 'pi-times-circle': !data.active }"></i>
            </template>
          </Column>
          <Column header="Acciones" style="width:280px">
            <template #body="{ data }">
              <Button icon="pi pi-shopping-cart" label="Comprar" class="p-mr-2" @click="addToCart(data)" />
              <template v-if="isAdmin">
                <Button icon="pi pi-history" class="p-button-rounded p-button-help p-mr-2" @click="openAudit(data)" />
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editProduct(data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="askDelete(data)" />
              </template>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

 
    <Dialog v-model:visible="showDialog" :style="{width: '460px'}" header="Detalles del Producto" :modal="true" class="p-fluid">
      <div class="p-field">
        <label for="name">Nombre</label>
        <InputText id="name" v-model.trim="form.name" required autofocus />
      </div>
      <div class="p-field">
        <label for="description">Descripción</label>
        <Textarea id="description" v-model="form.description" rows="3" />
      </div>
      <div class="p-field">
        <label for="price">Precio</label>
        <InputNumber id="price" v-model="form.price" mode="currency" currency="USD" />
      </div>
      <div class="p-field-checkbox">
        <Checkbox id="active" v-model="form.active" :binary="true" />
        <label for="active">Activo</label>
      </div>
      <template #footer>
        <Button label="Cancelar" class="p-button-text" @click="showDialog = false" />
        <Button label="Guardar" icon="pi pi-check" @click="saveProduct" />
      </template>
    </Dialog>


    <Dialog v-model:visible="showDelete" :style="{width: '420px'}" header="Confirmar" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="current">¿Eliminar <b>{{ current.name }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" class="p-button-text" @click="showDelete = false" />
        <Button label="Sí" icon="pi pi-check" class="p-button-text" @click="deleteProductConfirmed" />
      </template>
    </Dialog>
  </div>
<AuditDrawer
  v-if="isAdmin && auditId"
  v-model="auditVisible"
  :entity="'Product'"
  :entityId="auditId"
/>
  
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import ProductService, { type ProductSearchFilters } from '@/services/ProductService';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import type { Product } from '@/types';
import AuditDrawer from '@/components/AuditDrawer.vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';

export default defineComponent({
  name: 'ProductsView',
  components: { DataTable, Column, Card, Button, InputText, Dialog, InputNumber, Textarea, Checkbox, Dropdown,AuditDrawer },
  setup() {
    const products = ref<Product[]>([]);
    const loading = ref(true);
    const cartStore = useCartStore();
    const authStore = useAuthStore();


const auditVisible = ref(false);
const auditId = ref<number | null>(null);
const openAudit = (p: Product) => {
  auditId.value = p.id;
  auditVisible.value = true;
};

  
    const searchText = ref('');
    const showAdvanced = ref(false);

    // filtros para el backend
    const filters = ref<ProductSearchFilters>({
      q: '',
      minPrice: undefined,
      maxPrice: undefined,
      active: null,
      id: undefined
    });

    const activeOptions = [
      { label: 'Todos', value: null },
      { label: 'Activos', value: true },
      { label: 'Inactivos', value: false }
    ];

    const isAdmin = computed(() => {
      const r = authStore.user?.roles;
      return Array.isArray(r) && r.some((x: any) => x === 'ROLE_ADMIN' || x?.name === 'ROLE_ADMIN');
    });

    const num = (v: any) => (typeof v === 'number' ? v : Number(v) || 0);
    const formatCurrency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    const fetchAll = async () => {
      loading.value = true;
      try {
        const { data } = await ProductService.search({});
        products.value = data;
      } finally {
        loading.value = false;
      }
    };

    const doSearch = async () => {
      loading.value = true;
      try {
        const payload: ProductSearchFilters = {
          ...filters.value,
          q: searchText.value?.trim() || undefined
        };
        const { data } = await ProductService.search(payload);
        products.value = data;
      } catch (e: any) {
        const code = e?.response?.status;
        if (code === 401) alert('Sesión expirada, inicia sesión de nuevo.');
        else if (code === 403) alert('No tienes permisos para buscar productos.');
        else alert('Error consultando productos.');
      } finally {
        loading.value = false;
      }
    };

    const clearSearch = async () => {
      searchText.value = '';
      await doSearch();
    };

    const resetFilters = async () => {
      filters.value = { q: '', minPrice: undefined, maxPrice: undefined, active: null, id: undefined };
      await doSearch();
    };

    onMounted(fetchAll);

    const addToCart = (p: Product) => cartStore.addItem(p);

    // CRUD
    const showDialog = ref(false);
    const showDelete = ref(false);
    const current = ref<Product | null>(null);
    const form = ref<Partial<Product>>({ name: '', description: '', price: 0, active: true });

    const openCreate = () => { current.value = null; form.value = { name: '', description: '', price: 0, active: true }; showDialog.value = true; };
    const editProduct = (p: Product) => { current.value = p; form.value = { ...p }; showDialog.value = true; };
    const askDelete = (p: Product) => { current.value = p; showDelete.value = true; };

    const saveProduct = async () => {
      if (current.value?.id) await ProductService.updateProduct(current.value.id, form.value);
      else await ProductService.createProduct(form.value);
      showDialog.value = false;
      await doSearch();
    };

    const deleteProductConfirmed = async () => {
      if (!current.value?.id) return;
      await ProductService.deleteProduct(current.value.id);
      showDelete.value = false;
      await doSearch();
    };

    return {
     
      products, loading, formatCurrency, num,
     
      searchText, showAdvanced, filters, activeOptions,
      doSearch, clearSearch, resetFilters,
     
      isAdmin, addToCart,

      auditVisible, auditId, openAudit,
   
      showDialog, showDelete, current, form, openCreate, editProduct, askDelete, saveProduct, deleteProductConfirmed
    };
  }
});
</script>

<style scoped>
.searchbar { margin-bottom: 1rem; }
.advanced { margin-top: .5rem; }
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
