<template>
  <div class="p-6">
    <Card>
      <template #title><div class="text-2xl font-semibold">Inventario</div></template>
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

        <Card v-if="stock !== null" class="mt-3">
          <template #title>Resultado</template>
          <template #content>
            <p><b>Producto:</b> {{ productId }}</p>
            <p><b>Stock actual:</b>
              <Tag :value="String(stock)" :severity="(stock ?? 0) > 0 ? 'success':'danger'" />
            </p>
          </template>
        </Card>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable vue/multi-word-component-names */
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';
import InventoryService from '@/services/InventoryService';

const toast = useToast();
const productId = ref<number>(0);
const qty = ref<number>(0);
const stock = ref<number | null>(null);

const fetchStock = async () => {
  try { stock.value = (await InventoryService.getByProduct(productId.value)).data.quantity ?? 0;
        toast.add({ severity:'info', summary:'Consulta', detail:`Stock: ${stock.value}` }); }
  catch (e:any) { stock.value = null; toast.add({ severity:'error', summary:'Error', detail:e?.response?.data?.message || 'No encontrado' }); }
};
const setStock = async () => {
  try { await InventoryService.setQuantity(productId.value, qty.value); await fetchStock();
        toast.add({ severity:'success', summary:'Inventario', detail:'Cantidad establecida' }); }
  catch (e:any) { toast.add({ severity:'error', summary:'Error', detail:e?.response?.data?.message || '' }); }
};
const adjust = async (delta:number) => {
  try { await InventoryService.adjust(productId.value, delta); await fetchStock();
        toast.add({ severity:'success', summary:'Inventario', detail:`Ajuste ${delta>0?'+':''}${delta}` }); }
  catch (e:any) { toast.add({ severity:'error', summary:'Error', detail:e?.response?.data?.message || '' }); }
};
</script>

<style scoped>
.text-2xl { font-size: 1.5rem; }
.mt-3 { margin-top: 1rem; }
</style>
