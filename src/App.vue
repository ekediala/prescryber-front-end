<template>
  <v-app>
    <nav-bar />
    <v-content>
      <vue-page-transition>
        <router-view></router-view>
      </vue-page-transition>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar.vue";
export default {
  name: "App",
  components: {
    NavBar
  }
};
</script>
