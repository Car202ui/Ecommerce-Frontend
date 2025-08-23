<template>
  <div class="login-wrap">
    <Card class="glass-card">
      <template #title>
        <div class="brand">
          <i class="pi pi-shopping-cart logo"></i>
          <h3>E-Commerce</h3>
          <p class="subtitle">Iniciar sesión</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="form">
          <span class="p-input-icon-left field">
            <i class="pi pi-user" />
            <InputText
              id="username"
              v-model="user.username"
              type="text"
              placeholder="Usuario o email"
              autocomplete="username"
            />
          </span>

          <span class="p-input-icon-left field">
            <i class="pi pi-lock" />
            <!-- Password con toggle (solo UI) -->
            <Password
              id="password"
              v-model="user.password"
              :feedback="false"
              toggleMask
              inputClass="w-full"
              placeholder="Contraseña"
              autocomplete="current-password"
            />
          </span>

          <div class="row">
            <div class="remember">
              <Checkbox v-model="remember" :binary="true" inputId="remember" />
              <label for="remember">Recordarme</label>
            </div>
            <!-- Si no tienes página de recuperar, deja el anchor deshabilitado o quítalo -->
            <router-link class="link" to="/forgot">¿Olvidaste tu contraseña?</router-link>
          </div>

          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            class="w-full btn-primary"
            :loading="loading"
          />

          <small v-if="message" class="p-error msg">{{ message }}</small>
        </form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Card from 'primevue/card';

import AuthService from '@/services/AuthService';
import { useAuthStore } from '@/store/auth';
import type { UserLogin } from '@/types';

export default defineComponent({
  name: 'LoginView',
  components: { InputText, Password, Checkbox, Button, Card },
  data() {
    return {
      user: { username: '', password: '' } as UserLogin,
      message: '',
      remember: false,
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      if (!this.user.username || !this.user.password) {
        this.message = 'El usuario y la contraseña son obligatorios.';
        return;
      }
      const authStore = useAuthStore();
      this.loading = true;
      this.message = '';
      try {
        const response = await AuthService.login(this.user);
        authStore.login(response.data);
        this.$router.push('/products');
      } catch (e) {
        this.message = 'Error: Credenciales inválidas.';
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>

.login-wrap{
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background:
    radial-gradient(1200px 600px at 8% -10%, #2563eb 0%, transparent 60%),
    radial-gradient(900px 460px at 110% 110%, #22c55e 0%, transparent 60%),
    #0f172a;
}


.glass-card{
  width: 100%;
  max-width: 440px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem 1.25rem 1.75rem;
  color: #e5e7eb;
  box-shadow: 0 20px 60px rgba(0,0,0,.35);
}


.brand{ text-align:center; margin-top:.5rem; }
.logo{ font-size:2rem; color:#93c5fd; }
.brand h3{ margin:.25rem 0 0; font-size:1.25rem; font-weight:700; }
.subtitle{ margin:0; color:#9ca3af; font-size:.9rem; }


.form{ margin-top:.5rem; }
.field{ display:block; margin: 1rem 0; }

:deep(.p-inputtext){
  width:100%;
  background: rgba(17,24,39,.65);
  border:1px solid rgba(255,255,255,.15);
  color:#e5e7eb;
}
:deep(.p-inputtext:focus){
  border-color:#60a5fa;
  box-shadow:0 0 0 1px #60a5fa55;
}


:deep(.p-password input){ width:100%; background: rgba(17,24,39,.65); color:#e5e7eb; border:1px solid rgba(255,255,255,.15); }


.row{
  display:flex; align-items:center; justify-content:space-between;
  margin:.25rem 0 1rem; gap:.5rem;
}
.remember{ display:flex; align-items:center; gap:.5rem; color:#cbd5e1; font-size:.9rem; }


:deep(.p-button.btn-primary){ width:100%; }
.w-full{ width:100%; }

/* Links */
.link{ color:#93c5fd; text-decoration:none; font-size:.9rem; }
.link:hover{ text-decoration:underline; }

.msg{ display:block; margin-top:.75rem; }
</style>
