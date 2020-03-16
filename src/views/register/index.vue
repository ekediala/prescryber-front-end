<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <registration-form/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { NAME } from "./constants";
import RegistrationForm from './components/RegistrationForm.vue';
export default {
  name: NAME,
  components: {
    RegistrationForm
  }
};
</script>