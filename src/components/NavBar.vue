<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex justify-start">
      <v-btn text class="nav-link" href="/" v-if="!loggedIn">
        <h3>{{APP_NAME | uppercase}}</h3>
      </v-btn>
      <router-link  class="nav-link" to="/" v-else>
        <span class="mr-2 nav-link">{{ name }}</span>
      </router-link>
    </div>

    <v-spacer></v-spacer>

    <div v-if="!loggedIn">
      <router-link class="mr-2 nav-link" :to="LOGIN_ROUTE">{{ LOGIN | uppercase }}</router-link>
      <router-link :to="REGISTER_ROUTE" class="mr-2 nav-link">{{ REGISTER | uppercase }}</router-link>
    </div>

    <div v-else>
      <router-link
        v-if="isPrescriber"
        class="mr-1 nav-link"
        :to="CREATE_PRESCRIPTION_ROUTE"
      >{{ CREATE_PRESCRIPTION }}</router-link>
      <v-btn small dense color="red lighten-1" @click="logout()" text>
        <span class="mr-1">{{ LOGOUT | uppercase }}</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { UI_ROUTES, APP_NAME, NAV_TEXT, ACCOUNT_TYPES } from "../constants";
import { getters, actions } from "../store";

const {
  LOGIN: LOGIN_ROUTE,
  REGISTER: REGISTER_ROUTE,
  CREATE_PRESCRIPTION: CREATE_PRESCRIPTION_ROUTE
} = UI_ROUTES;
const { PRESCRIBER } = ACCOUNT_TYPES;

export default {
  name: "NavBar",
  data() {
    return {
      LOGIN_ROUTE,
      ...NAV_TEXT,
      APP_NAME,
      REGISTER_ROUTE,
      CREATE_PRESCRIPTION_ROUTE
    };
  },

  computed: {
    name: () => {
      return `Hi, ${getters.name()}`;
    },
    loggedIn: getters.loggedIn,
    isPrescriber: () => getters.accountType() === PRESCRIBER
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