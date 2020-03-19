<template>
  <v-container fluid class="fill-height">
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
          :label="SORT_LABEL"
          :items="conditions"
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
        <p class="text-center">Nothing here. Please consult your physician.</p>
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
              <v-btn @click.prevent="remove(prescription._id)" small color="error">Delete</v-btn>
            </template>
            <v-btn
              v-if="!prescription.filled && isPatient(prescription.patientEmail) && prescription.verified"
              @click.prevent="fill(prescription)"
              small
              color="primary"
            >Mark filled</v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn
              v-if="!prescription.verified && isPatient(prescription.patientEmail)"
              @click.prevent="approve(prescription)"
              small
              color="success"
            >Approve</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getters, actions, mutations } from "../../store";
import { NAME, HEADER, CONDITIONS, SORT_LABEL } from "./constants";
import { UI_ROUTES, ACCOUNT_TYPES } from "../../constants";
import Swal from "sweetalert2";

const { FILLED, UNFILLED, CREATED, PENDING } = CONDITIONS;
const { EDIT_PRESCRIPTION } = UI_ROUTES;
const { PRESCRIBER } = ACCOUNT_TYPES;

export default {
  name: NAME,
  data() {
    return {
      info: null,
      displayedPrescriptions: null,
      HEADER,
      SORT_LABEL,
      error: null
    };
  },
  computed: {
    conditions: () => {
      if (getters.accountType() !== PRESCRIBER) delete CONDITIONS.CREATED;
      return Object.values({
        ...CONDITIONS
      });
    }
  },
  methods: {
    async approve(prescription) {
      const payload = { ...prescription, verified: true };
      mutations.setPrescription(payload);
      const loader = this.$loading.show({
        canCancel: false
      });
      try {
        const response = await actions.updatePrescription();
        loader.hide();
        this.loadPrescriptions(response);
      } catch ({ message }) {
        this.info = message;
        loader.hide();
      }
    },
    async fill(prescription) {
      const payload = { ...prescription, filled: true };
      mutations.setPrescription(payload);
      const loader = this.$loading.show({
        canCancel: false
      });
      try {
        const response = await actions.updatePrescription();
        loader.hide();
        this.loadPrescriptions(response);
      } catch ({ message }) {
        this.info = message;
        loader.hide();
      }
    },
    async remove(id) {
      const approve = await Swal.fire({
        title: "Delete",
        text: "Prescription will be deleted",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });
      if (approve.value) {
        const loader = this.$loading.show({
          canCancel: false
        });
        try {
          const response = await actions.deletePrescription(id);
          loader.hide();
          this.loadPrescriptions(response);
        } catch ({ message }) {
          this.info = message;
          loader.hide();
        }
      }
    },
    edit(prescription) {
      mutations.setPrescription(prescription);
      this.$router.push(EDIT_PRESCRIPTION);
    },
    async loadPrescriptions(message = null) {
      const loader = this.$loading.show({
        canCancel: false
      });
      try {
        await actions.loadPrescriptions();
        this.displayedPrescriptions = getters.allPrescriptions();
        loader.hide();
        this.info = message;
      } catch ({ message }) {
        loader.hide();
        this.error = message;
      }
    },
    isCreator(email) {
      return getters.email() === email;
    },

    isPatient(email) {
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
          this.displayedPrescriptions = getters.allPrescriptions();
          break;
      }
    }
  },
  created() {
    this.loadPrescriptions();
  }
};
</script>
