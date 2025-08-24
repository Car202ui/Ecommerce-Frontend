<template>
  <div class="users-view">
    <Card>
      <template #title>Gestión de Usuarios</template>

      <template #content>
        <div class="p-d-flex p-ai-center p-jc-between p-mb-3">
          <Button label="Nuevo usuario" icon="pi pi-user-plus" @click="openCreateDialog" />
        </div>

        <DataTable :value="users" :loading="loading" dataKey="id" responsiveLayout="scroll" rowHover>
          <Column field="id" header="ID" style="width: 80px" />
          <Column field="username" header="Usuario" />
          <Column field="email" header="Email" />
          <Column field="firstName" header="Nombre" />
          <Column field="lastName" header="Apellido" />

          <Column header="Frecuente">
            <template #body="{ data }">
              <Tag :value="isFrequent(data) ? 'Sí' : 'No'" :severity="isFrequent(data) ? 'success' : 'warning'" />
            </template>
          </Column>

          <Column header="Roles">
            <template #body="{ data }">
              <Tag v-for="r in asRoleNames(data.roles)" :key="r" class="p-mr-1" :value="r" severity="info" />
            </template>
          </Column>

          <Column header="Acciones" style="width: 180px">
            <template #body="{ data }">
          <Button
  icon="pi pi-history"
  class="p-button-rounded p-button-help p-mr-2"
  v-tooltip.top="'Historial'"
  @click="openUserHistory(data.id)"
/>
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-mr-2" @click="openEditDialog(data)" />
              
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteUser(data)" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Crear -->
    <Dialog v-model:visible="createDialog" header="Nuevo usuario" :modal="true" :style="{ width: '30rem' }">
      <div class="p-fluid">
        <div class="p-field"><label for="c_username">Usuario</label><InputText id="c_username" v-model="createForm.username" /></div>
        <div class="p-field"><label for="c_email">Email</label><InputText id="c_email" v-model="createForm.email" /></div>
        <div class="p-field"><label for="c_password">Contraseña</label><InputText id="c_password" v-model="createForm.password" type="password" /></div>
        <div class="p-field"><label for="c_firstName">Nombre</label><InputText id="c_firstName" v-model="createForm.firstName" /></div>
        <div class="p-field"><label for="c_lastName">Apellido</label><InputText id="c_lastName" v-model="createForm.lastName" /></div>
        <div class="p-field">
          <label for="c_roles">Roles</label>
          <MultiSelect id="c_roles"
                       v-model="createForm.roles"
                       :options="rolesList"
                       optionLabel="name"
                       optionValue="name"
                       placeholder="Selecciona roles"
                       display="chip" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" class="p-button-text" @click="createDialog=false" />
        <Button label="Crear" icon="pi pi-check" @click="createUser" />
      </template>
    </Dialog>

    <!-- Editar -->
    <Dialog v-model:visible="editDialog" header="Editar usuario" :modal="true" :style="{ width: '30rem' }">
      <div class="p-fluid">
        <div class="p-field"><label for="e_username">Usuario</label><InputText id="e_username" v-model="editForm.username" /></div>
        <div class="p-field"><label for="e_email">Email</label><InputText id="e_email" v-model="editForm.email" /></div>
        <div class="p-field"><label for="e_firstName">Nombre</label><InputText id="e_firstName" v-model="editForm.firstName" /></div>
        <div class="p-field"><label for="e_lastName">Apellido</label><InputText id="e_lastName" v-model="editForm.lastName" /></div>
        <div class="p-field-checkbox">
          <Checkbox inputId="e_frequent" v-model="editForm.frequent" :binary="true" />
          <label for="e_frequent" class="p-ml-2">Cliente frecuente</label>
        </div>
        <div class="p-field">
          <label for="e_roles">Roles</label>
          <MultiSelect id="e_roles"
                       v-model="editForm.roles"
                       :options="rolesList"
                       optionLabel="name"
                       optionValue="name"
                       placeholder="Selecciona roles"
                       display="chip" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" class="p-button-text" @click="editDialog=false" />
        <Button label="Guardar" icon="pi pi-check" @click="updateUser" />
      </template>
    </Dialog>

   
    <Dialog v-model:visible="deleteDialog" header="Confirmar" :modal="true" :style="{ width: '25rem' }">
      <p>¿Eliminar al usuario <b>{{ selectedUser?.username }}</b>?</p>
      <template #footer>
        <Button label="Cancelar" class="p-button-text" @click="deleteDialog=false" />
        <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="deleteUser" />
      </template>
    </Dialog>
    

  </div>
  <AuditDrawer
  v-if="auditOpen && auditId !== null"
  v-model="auditOpen"
  :entity="auditEntity"
  :entityId="auditId"
/>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import MultiSelect from 'primevue/multiselect';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import AuditDrawer from '@/components/AuditDrawer.vue';

import UserService from '@/services/UserService';
import RoleService from '@/services/RoleService';

import type { User, UserRegister, UserUpdate } from '@/types';

type Role = { id: number; name: string };
type FrontUser = User & {
  firstName?: string;
  lastName?: string;
  frequent?: boolean;
  isFrequent?: boolean;
  roles?: Array<string | { name: string; id?: number }>;
};

type UpdatePayload = Omit<Partial<UserUpdate>, 'roles'> & { roles?: string[]; frequent?: boolean };

export default defineComponent({
  name: 'UsersView',
  components: { Card, DataTable, Column, Button, Dialog, InputText, Checkbox, MultiSelect, Tag,AuditDrawer },
  setup() {
    const toast = useToast();

    const users = ref<FrontUser[]>([]);
    const loading = ref(false);
    const rolesList = ref<Role[]>([]);
    const auditDrawer = ref<InstanceType<typeof AuditDrawer> | null>(null);

const auditOpen   = ref(false);
const auditEntity = ref<'User' | 'Product' | 'Inventory' | 'Order'>('User'); 
const auditId     = ref<number | null>(null);

function openUserHistory(id: number) {
  auditEntity.value = 'User';
  auditId.value = id;
  auditOpen.value = true;
}


    const fetchUsers = async () => {
      loading.value = true;
      try {
        users.value = (await UserService.getAllUsers()).data as FrontUser[];
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await fetchUsers();
      try {
        rolesList.value = (await RoleService.getAll()).data as Role[];
      } catch (e: unknown) {
        console.error(e);
        toast.add({ severity: 'warn', summary: 'Roles', detail: 'No fue posible cargar los roles' });
      }
    });

    // Helpers
    const asRoleNames = (roles?: FrontUser['roles']) =>
      (roles || []).map((r) => (typeof r === 'string' ? r : r.name));
    const isFrequent = (u: FrontUser) => Boolean(u.frequent ?? u.isFrequent);

    // Crear
    const createDialog = ref(false);
    type CreateForm = UserRegister & { roles: string[] };
    const createForm = ref<CreateForm>({
      username: '', email: '', password: '', firstName: '', lastName: '', roles: []
    });

    const openCreateDialog = () => {
      createForm.value = { username:'', email:'', password:'', firstName:'', lastName:'', roles: [] };
      createDialog.value = true;
    };

    const createUser = async () => {
      try {
        const res = await UserService.createUser(createForm.value);
        const created = res.data as FrontUser;

        // si devolvió id y hay roles, asignarlos vía update
        if (created?.id && createForm.value.roles.length) {
          const payload: UpdatePayload = { roles: createForm.value.roles };
          await UserService.updateUser(created.id, payload);
        }

        toast.add({ severity: 'success', summary: 'Usuario creado' });
        createDialog.value = false;
        await fetchUsers();
      } catch (e: any) {
        toast.add({ severity: 'error', summary: 'Crear usuario', detail: e?.response?.data?.message || 'Error' });
      }
    };

    // Editar
    const editDialog = ref(false);
    const selectedUser = ref<FrontUser | null>(null);

    const editForm = ref<UpdatePayload>({
      username: '', email: '', firstName: '', lastName: '', roles: [], frequent: false
    });

    const openEditDialog = (u: FrontUser) => {
      selectedUser.value = u;
      editForm.value = {
        username: u.username,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        frequent: isFrequent(u),
        roles: asRoleNames(u.roles)   // <-- ahora cuadra: string[]
      };
      editDialog.value = true;
    };

    const updateUser = async () => {
      if (!selectedUser.value) return;
      try {
        const payload: UpdatePayload = {
          ...editForm.value,
          roles: editForm.value.roles
        };
        await UserService.updateUser(selectedUser.value.id!, payload);
        toast.add({ severity: 'success', summary: 'Usuario actualizado' });
        editDialog.value = false;
        await fetchUsers();
      } catch (e: any) {
        toast.add({ severity: 'error', summary: 'Actualizar usuario', detail: e?.response?.data?.message || 'Error' });
      }
    };

    // Eliminar
    const deleteDialog = ref(false);
    const confirmDeleteUser = (u: FrontUser) => { selectedUser.value = u; deleteDialog.value = true; };

    const deleteUser = async () => {
      if (!selectedUser.value) return;
      try {
        await UserService.deleteUser(selectedUser.value.id!);
        toast.add({ severity: 'success', summary: 'Usuario eliminado' });
        deleteDialog.value = false;
        await fetchUsers();
      } catch (e: any) {
        toast.add({ severity: 'error', summary: 'Eliminar usuario', detail: e?.response?.data?.message || 'Error' });
      }
    };

    return {
      auditDrawer, 
      users, loading, rolesList,
      createDialog, createForm, openCreateDialog, createUser,
      editDialog, openEditDialog, editForm, updateUser,
      deleteDialog, confirmDeleteUser, deleteUser, selectedUser,
      asRoleNames, isFrequent,auditOpen, auditEntity, auditId, openUserHistory,
      
    };
   

  }
});
</script>

<style scoped>
.users-view { padding: 2rem; }
</style>
