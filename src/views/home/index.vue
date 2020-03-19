<template>
  <v-container fluid class="fill-height vld-parent">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-toolbar-title class="text-center text-uppercase primary--text">{{ HEADER }}</v-toolbar-title>
      </v-col>
    </v-row>

    <v-row v-if="!!displayedPrescriptions" justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-select
          filled
          hide-details="auto"
          label="Sort prescriptions"
          :items="['all', 'filled', 'unfilled', 'pending', 'created']"
          @change="sortBy"
        />
      </v-col>
    </v-row>

    <v-row v-if="error" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="mx-auto" max-width="344" raised shaped>
          <v-card-text class="text-center">{{ error }}</v-card-text>
          <v-card-actions>
            <v-btn block large @click.prevent="loadPrescriptions" color="warning">Reload</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else-if="!!displayedPrescriptions && !displayedPrescriptions.length" justify="center">
      <v-col cols="12" md="6" lg="4">
        <p class="text-center">Nothing here</p>
      </v-col>
    </v-row>
    <v-row v-else class="justify-md-start" justify="center">
      <v-col
        v-for="prescription in displayedPrescriptions"
        :key="prescription._id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="mx-auto" max-width="344" raised shaped>
          <v-card-title primary-title>{{ prescription.prescription }}</v-card-title>
          <v-card-subtitle>
            <p v-if="isCreator(prescription.prescriberEmail)">For {{ prescription.patientName }}</p>
            Take {{ prescription.quantity }} {{ prescription.unit }}; {{ prescription.interval }} times daily
          </v-card-subtitle>
          <v-card-text>
            <p>{{ prescription.furtherAdvice || 'No further advice' }}</p>
            <p>
              For further information, please
              <a
                :href="`mailto:${prescription.prescriberEmail}`"
              >email</a>
              {{ prescription.prescriberName }}
            </p>
          </v-card-text>
          <v-card-actions>
            <template v-if="isCreator(prescription.prescriberEmail)">
              <v-btn @click.prevent="edit(prescription)" small color="warning">Edit</v-btn>
              <v-btn small color="error">Delete</v-btn>
            </template>
            <v-btn v-if="!prescription.verified" small color="primary">Approve</v-btn>
            <v-btn v-else-if="!prescription.filled" small color="primary">Mark filled</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getters, actions, mutations } from "../../store";
import { NAME, HEADER, CONDITIONS } from "./constants";
import { UI_ROUTES } from "../../constants";

const { FILLED, UNFILLED, CREATED, PENDING } = CONDITIONS;
const { EDIT_PRESCRIPTION } = UI_ROUTES;

export default {
  name: NAME,
  data() {
    return {
      error: null,
      displayedPrescriptions: null,
      CONDITIONS,
      HEADER
    };
  },
  methods: {
    edit(prescription) {
      mutations.setPrescription(prescription);
      this.$router.push(EDIT_PRESCRIPTION);
    },
    async loadPrescriptions() {
      const loader = this.$loading.show({
        canCancel: false
      });
      try {
        await actions.loadPrescriptions();
        this.displayedPrescriptions = getters.allPrescriptions();
        loader.hide();
        this.error = null;
      } catch ({ message }) {
        loader.hide();
        this.error = message;
      }
    },
    isCreator(email) {
      return getters.email() === email;
    },
    sortBy(condition) {
      switch (condition) {
        case FILLED:
          this.displayedPrescriptions = getters
            .allPrescriptions()
            .filter(value => !!value.filled === true);
          break;
        case UNFILLED:
          this.displayedPrescriptions = getters
            .allPrescriptions()
            .filter(value => !!value.filled === false);
          break;
        case PENDING:
          this.displayedPrescriptions = getters
            .allPrescriptions()
            .filter(value => !!value.verified === false);
          break;
        case CREATED:
          this.displayedPrescriptions = getters
            .allPrescriptions()
            .filter(value => value.prescriberEmail === getters.email());
          break;
        default:
          break;
      }
    }
  },
  created() {
    this.loadPrescriptions();
  }
};
</script>
