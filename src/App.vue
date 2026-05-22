
<script>

  import { onBeforeMount } from 'vue';
  import { useGlobalStore } from './stores/global.js';
  import NavbarComponent from './components/NavbarComponent.vue';
  
  export default {

    components: {
      NavbarComponent
    },
    setup() {

      const store = useGlobalStore();

      onBeforeMount(() => store.getUserDetails(localStorage.getItem("token")));
    }
  }

</script>

<template>

  <NavbarComponent />
  <main>
      <router-view />
  </main>
</template>

<style scoped>


</style>