<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12">
          <prescription-form :type="TYPE" :header="HEADER"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { COMPONENT_TYPES, COMPONENT_HEADERS } from "../constants";
import PrescriptionForm from "../components/PrescriptionForm.vue";
const { EDIT } = COMPONENT_TYPES;
const { EDIT: HEADER } = COMPONENT_HEADERS;
export default {
  name: EDIT,
  components: {
    PrescriptionForm
  },
  data() {
    return {
      HEADER,
      TYPE: EDIT
    };
  }
};
</script>