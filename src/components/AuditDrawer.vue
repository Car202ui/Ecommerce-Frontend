<template>
  <Dialog v-model:visible="visible" :modal="true" :style="{ width: '900px' }" header="Historial de cambios">
    <div class="p-text-secondary p-mb-3">
      <b>Entidad:</b> {{ entity }} &nbsp;•&nbsp; <b>ID:</b> {{ entityId }}
    </div>

    <DataTable
      :value="rows"
      :loading="loading"
      dataKey="id"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="pageSize"
      :first="page * pageSize"
      :totalRecords="total"
      lazy
      @page="onPage"
    >
      <Column field="changeTimestamp" header="Fecha" :sortable="false">
        <template #body="{ data }">{{ formatDate(data.changeTimestamp) }}</template>
      </Column>
      <Column field="action" header="Acción" :sortable="false" style="width:110px">
        <template #body="{ data }">
          <Tag :value="data.action" :severity="severityFor(data.action)" />
        </template>
      </Column>
      <Column field="changedBy" header="Usuario" :sortable="false" />
      <Column header="Before / After" :sortable="false">
        <template #body="{ data }">
          <Button class="p-button-text p-button-sm" icon="pi pi-eye" label="Ver detalle" @click="openDetail(data)" />
        </template>
      </Column>
    </DataTable>

    <template #footer>
      <Button label="Cerrar" class="p-button-text" @click="close" />
    </template>

    <!-- Modal detalle JSON -->
    <Dialog v-model:visible="detailVisible" header="Detalle de cambio" :modal="true" :style="{ width: '700px' }">
      <div class="grid">
        <div class="col-12 md:col-6">
          <h4>Before</h4>
          <pre class="json-box">{{ pretty(detailBefore) }}</pre>
        </div>
        <div class="col-12 md:col-6">
          <h4>After</h4>
          <pre class="json-box">{{ pretty(detailAfter) }}</pre>
        </div>
      </div>
    </Dialog>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import AuditService from '@/services/AuditService';
import type { AuditLog } from '@/types';

export default defineComponent({
  name: 'AuditDrawer',
  components: { DataTable, Column, Dialog, Button, Tag },
  props: {
    modelValue: { type: Boolean, required: true },
    entity: { type: String, required: true },
    entityId: { type: [Number, String], required: true }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue);
    watch(() => props.modelValue, v => (visible.value = v));
    watch(visible, v => emit('update:modelValue', v));

    const page = ref(0);
    const pageSize = ref(10);
    const total = ref(0);
    const rows = ref<AuditLog[]>([]);
    const loading = ref(false);

    const detailVisible = ref(false);
    const detailBefore = ref<any>(null);
    const detailAfter = ref<any>(null);

    const pretty = (obj: any) => JSON.stringify(obj ?? {}, null, 2);
    const formatDate = (iso: string) => new Date(iso).toLocaleString();

    const severityFor = (action: string) => {
      if (action === 'CREATE') return 'success';
      if (action === 'UPDATE') return 'info';
      if (action === 'DELETE') return 'danger';
      return 'secondary';
    };

    const parseDetails = (d: string) => {
      try {
        const j = JSON.parse(d || '{}');
        return { before: j.before ?? null, after: j.after ?? null };
      } catch {
        return { before: null, after: null };
      }
    };

    const fetchPage = async () => {
      if (!props.entity || !props.entityId) return;
      loading.value = true;
      try {
        const { data } = await AuditService.byEntity({
          entity: String(props.entity),
          entityId: Number(props.entityId),
          page: page.value,
          size: pageSize.value,
          sort: 'changeTimestamp,desc'
        });
        rows.value = data.content;
        total.value = data.totalElements;
      } finally {
        loading.value = false;
      }
    };

    const onPage = (evt: any) => {
      page.value = Math.floor((evt.first || 0) / (evt.rows || pageSize.value));
      pageSize.value = evt.rows || pageSize.value;
      fetchPage();
    };

    const openDetail = (row: AuditLog) => {
      const { before, after } = parseDetails(row.details);
      detailBefore.value = before;
      detailAfter.value = after;
      detailVisible.value = true;
    };

    const close = () => (visible.value = false);

    watch([() => props.entity, () => props.entityId, visible], ([e, id, v]) => {
      if (v && e && id) {
        page.value = 0;
        fetchPage();
      }
    }, { immediate: true });

    return {
      visible, close, rows, loading, page, pageSize, total,
      onPage, openDetail, detailVisible, detailBefore, detailAfter,
      severityFor, pretty, formatDate
    };
    
  }
});
</script>

<style scoped>
.json-box {
  background: #0f172a0f;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 10px;
  max-height: 50vh;
  overflow: auto;
}
</style>
