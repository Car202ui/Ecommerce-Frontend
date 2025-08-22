<template>
  <div id="app">
    <NavBar v-if="showNavBar" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';

export default defineComponent({
  components: {
    NavBar
  },
  setup() {
    const route = useRoute();
    // No mostramos la Navbar en la página de login
    const showNavBar = computed(() => route.name !== 'login');
    return { showNavBar };
  }
});
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
.main-content {
  padding: 1rem;
}
</style>