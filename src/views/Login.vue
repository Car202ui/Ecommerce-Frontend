<template>
  <div class="login-container">
    <Card style="width: 25em">
      <template #title>
        <h3>Iniciar Sesión</h3>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="p-fluid">
          <div class="p-field">
            <label for="username">Usuario</label>
            <InputText id="username" v-model="user.username" type="text" />
          </div>
          <div class="p-field">
            <label for="password">Contraseña</label>
            <InputText id="password" v-model="user.password" type="password" />
          </div>
          <Button type="submit" label="Entrar" class="p-mt-2"></Button>
          <div v-if="message" class="p-error p-mt-2">{{ message }}</div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card'; // Importar Card
import AuthService from '@/services/AuthService';
import { useAuthStore } from '@/store/auth';
import { UserLogin } from '@/types';

export default defineComponent({
  name: 'LoginView',
  components: {
    InputText,
    Button,
    Card, // Registrar Card
  },
  data() {
    return {
      user: {
        username: '',
        password: '',
      } as UserLogin,
      message: '',
    };
  },
  methods: {
    async handleLogin() {
      if (!this.user.username || !this.user.password) {
        this.message = 'El usuario y la contraseña son obligatorios.';
        return;
      }
      const authStore = useAuthStore();
      try {
        const response = await AuthService.login(this.user);
        authStore.login(response.data);
        this.$router.push('/products');
      } catch (error) {
        this.message = 'Error: Credenciales inválidas.';
      }
    },
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.p-field {
  margin-bottom: 1.5rem;
}
</style>