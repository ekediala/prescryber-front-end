<template>
  <v-app>
    <nav-bar />
    <v-content>
      <vue-page-transition name="zoom">
        <router-view></router-view>
      </vue-page-transition>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { STORAGE_KEYS } from "./constants";
import { getters } from "./store";
const { TOKEN, PHONE, ACCOUNT_TYPE, NAME } = STORAGE_KEYS;
export default {
  name: "App",
  components: {
    NavBar
  },
  beforeDestroy() {
    if (getters.loggedIn()) {
      localStorage.setItem(TOKEN, getters.token());
      localStorage.setItem(NAME, getters.name());
      localStorage.setItem(ACCOUNT_TYPE, getters.accountType());
      localStorage.setItem(PHONE, getters.phone());
    }
  }
};
</script>
