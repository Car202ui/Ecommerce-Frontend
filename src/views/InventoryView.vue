<template>
  <div class="inventory-view p-6">
    <Card>
      <template #title>
        <div class="text-2xl font-semibold">Inventario</div>
      </template>

      <template #content>
        <div class="grid">
          <div class="col-12 md:col-3">
            <label class="p-text-secondary">ID de Producto</label>
            <InputNumber v-model="productId" :useGrouping="false" class="w-full" />
          </div>

          <div class="col-12 md:col-3">
            <label class="p-text-secondary">Cantidad</label>
            <InputNumber v-model="qty" :useGrouping="false" class="w-full" />
          </div>

          <div class="col-12 md:col-6 flex align-items-end gap-2">
            <Button label="Consultar" icon="pi pi-search" @click="fetchStock" />
            <Button label="Establecer" icon="pi pi-save" class="p-button-success" @click="setStock" />
            <Button label="+1" icon="pi pi-plus" class="p-button-help" @click="adjust(+1)" />
            <Button label="-1" icon="pi pi-minus" class="p-button-warning" @click="adjust(-1)" />
          </div>
        </div>

        <Card v-if="stockRec" class="mt-3">
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span>Resultado</span>
              <Button
                icon="pi pi-history"
                class="p-button-rounded p-button-help"
                v-tooltip.top="'Historial (Inventory)'"
                @click="openAuditFromStock"
              />
            </div>
          </template>
          <template #content>
            <p><b>Inventory ID:</b> {{ stockRec.id }}</p>
            <p><b>Producto:</b> {{ productId }}</p>
            <p>
              <b>Stock actual:</b>
              <Tag :value="String(stockRec.quantity)" :severity="(stockRec.quantity ?? 0) > 0 ? 'success' : 'danger'" />
            </p>
          </template>
        </Card>

        <Card v-else-if="stock === 0 || stock === null" class="mt-3">
          <template #title>Resultado</template>
          <template #content>
            <p><b>Producto:</b> {{ productId }}</p>
            <p>
              <b>Stock actual:</b>
              <Tag :value="stock === null ? '—' : String(stock)" :severity="(stock ?? 0) > 0 ? 'success' : 'danger'" />
            </p>
          </template>
        </Card>
      </template>
    </Card>

    <AuditDrawer
      v-model="auditOpen"
      :entity="auditEntity"
      :entityId="auditId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';
import InventoryService from '@/services/InventoryService';
import AuditDrawer from '@/components/AuditDrawer.vue';

interface InventoryDto {
  id: number;
  productId?: number;
  quantity: number;
  updatedAt?: string;
}

const toast = useToast();


const productId = ref<number>(0);
const qty = ref<number>(0);


const stockRec = ref<InventoryDto | null>(null); // registro completo
const stock = ref<number | null>(null);          // sólo cantidad (fallback)


const auditOpen = ref(false);
const auditEntity = 'Inventory' as const; // nombre EXACTO de la entidad del backend
const auditId = ref<number>(0);

const openAuditFromStock = () => {
  if (stockRec.value?.id) {
    auditId.value = stockRec.value.id; // SIEMPRE número
    auditOpen.value = true;
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Auditoría',
      detail: 'Consulta primero el inventario para obtener el ID.'
    });
  }
};


const fetchStock = async () => {
  try {
    const res = await InventoryService.getByProduct(productId.value); // AxiosResponse<InventoryDto>
    const data = (res?.data ?? null) as InventoryDto | null;

    stockRec.value = data;
    stock.value = data?.quantity ?? 0;

    toast.add({ severity: 'info', summary: 'Consulta', detail: `Stock: ${stock.value}` });
  } catch (e: unknown) {
    stockRec.value = null;
    stock.value = null;
    const msg = (e as any)?.response?.data?.message ?? 'No encontrado';
    toast.add({ severity: 'error', summary: 'Error', detail: msg });
  }
};

const setStock = async () => {
  try {
    await InventoryService.setQuantity(productId.value, qty.value);
    await fetchStock();
    toast.add({ severity: 'success', summary: 'Inventario', detail: 'Cantidad establecida' });
  } catch (e: unknown) {
    const msg = (e as any)?.response?.data?.message ?? 'Error';
    toast.add({ severity: 'error', summary: 'Error', detail: msg });
  }
};

const adjust = async (delta: number) => {
  try {
    await InventoryService.adjust(productId.value, delta);
    await fetchStock();
    const sign = delta > 0 ? '+' : '';
    toast.add({ severity: 'success', summary: 'Inventario', detail: `Ajuste ${sign}${delta}` });
  } catch (e: unknown) {
    const msg = (e as any)?.response?.data?.message ?? 'Error';
    toast.add({ severity: 'error', summary: 'Error', detail: msg });
  }
};
</script>

<style scoped>
.inventory-view .text-2xl { font-size: 1.5rem; }
.mt-3 { margin-top: 1rem; }
</style>
