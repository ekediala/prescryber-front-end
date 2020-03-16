<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <router-link class="nav-link" to="/" v-if="!loggedIn">
        <h3>{{appName | uppercase}}</h3>
      </router-link>
      <span v-else class="mr-2 nav-link">{{ name }}</span>
    </div>

    <v-spacer></v-spacer>

    <div v-if="!loggedIn">
      <router-link class="mr-2 nav-link" :to="routes.LOGIN">{{ LOGIN | uppercase }}</router-link>
      <router-link :to="routes.REGISTER" class="mr-2 nav-link">{{ REGISTER | uppercase }}</router-link>
    </div>

    <div v-else>
      <v-btn color="red lighten-1" @click="logout()" text>
        <span class="mr-2">{{ LOGOUT | uppercase }}</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { UI_ROUTES, APP_NAME, NAV_TEXT } from "../constants";
import { getters, actions } from "../store";
export default {
  name: "NavBar",
  data() {
    return {
      routes: { ...UI_ROUTES },
      ...NAV_TEXT,
      appName: APP_NAME
    };
  },

  computed: {
    name: () => {
      return `Hi, ${getters.name()}`;
    },
    loggedIn: getters.loggedIn
  },

  methods: {
    logout: actions.logout
  },
  filters: {
    uppercase(value) {
      return value.toUpperCase();
    }
  }
};
</script>

<style scoped>
.nav-link {
  color: white;
  text-decoration: none;
}
</style>