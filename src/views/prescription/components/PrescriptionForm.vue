<template>
  <v-form @submit.prevent="submit" ref="form">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-toolbar-title class="text-center text-uppercase primary--text">{{ header }}</v-toolbar-title>
        </v-col>
      </v-row>
      <v-row v-if="info" justify="center">
        <v-col cols="12" md="8" lg="6">
          <info @click.prevent="info = null" :type="infoType" :message="info" />
        </v-col>
      </v-row>
      <v-row justify="center" class="justify-lg-start">
        <v-col v-for="(input, index) in inputElements" :key="index" cols="12" md="6" lg="4">
          <v-text-field
            shaped
            filled
            :append-icon="input.icon"
            :label="input.label"
            :placeholder="input.placeholder"
            :required="input.required"
            :disabled="input.disabled || loading"
            :rules="input.rules"
            :type="input.type || INPUT_TYPES.TEXT"
            v-model="input.model"
            @focus="(info = null)"
            @blur="input.onBlur ? input.onBlur() : null"
            :counter="input.counter"
            :maxLength="input.maxLength"
            :hint="input.hint"
          ></v-text-field>
        </v-col>
        <v-col v-for="dropdown in dropdownElements" :key="dropdown.label" cols="12" md="6" lg="4">
          <v-select
            :items="dropdown.items"
            :hint="dropdown.hint"
            filled
            :append-icon="dropdown.icon"
            :disabled="loading"
            :label="dropdown.label"
            :value="dropdown.value"
            @change="dropdown.onChange"
          />
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-textarea
            :label="advice.label"
            :hint="advice.hint"
            filled
            :placeholder="advice.placeholder"
            v-model="advice.model"
            :append-icon="advice.icon"
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="5">
          <v-btn
            :color="type === createType ? 'primary' : 'warning'"
            min-width="100%"
            :loading="loading"
            large
            type="submit"
          >{{ type }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import Info from "../../../components/Info.vue";
import {
  COMPONENT_TYPES,
  PRESCRIPTION_PLACEHOLDERS,
  PRESCRIPTION_LABELS,
  PRESCRIPTION_HINTS,
  UNIT_VALUES,
  INTERVAL_VALUES
} from "../constants";
import { LABELS, PLACEHOLDERS, HINTS } from "../../register/constants";
import { ICONS, INPUT_TYPES, MESSAGES } from "../../../constants";
import { RULES } from "../../../validators/index";
import { getters, mutations, actions } from "../../../store";
const {
  ACCOUNT: ACCOUNT_ICON,
  QUANTITY: QUANTITY_ICON,
  ADVICE: ADVICE_ICON,
  DRUG: PRESCRIPTION_ICON,
  CYCLE: INTERVAL_ICON,
  EMAIL: EMAIL_ICON,
  CALENDAR: DATE_ICON
} = ICONS;
const {
  QUANTITY: QUANTITY_RULE,
  PRESCRIPTION: PRESCRIPTION_RULE,
  EMAIL: EMAIL_RULE,
  NAME: NAME_RULE,
  DATE: DATE_RULE
} = RULES;
const { NAME: NAME_PLACEHOLDER, EMAIL: EMAIL_PLACEHOLDER } = PLACEHOLDERS;
const { EMAIL: EMAIL_HINT } = HINTS;
const { EDIT, CREATE } = COMPONENT_TYPES;
const { NAME: NAME_LABEL } = LABELS;
const { NUMBER: TYPE_NUMBER, EMAIL: TYPE_EMAIL } = INPUT_TYPES;
const {
  FURTHER_ADVICE: FURTHER_ADVICE_HINT,
  PRESCRIPTION: PRESCRIPTION_HINT,
  QUANTITY: QUANTITY_HINT,
  UNIT: UNIT_HINT,
  INTERVAL: INTERVAL_HINT
} = PRESCRIPTION_HINTS;
const {
  QUANTITY: QUANTITY_LABEL,
  PRESCRIPTION: PRESCRIPTION_LABEL,
  FURTHER_ADVICE: FURTHER_ADVICE_LABEL,
  UNITS: UNITS_LABEL,
  EMAIL: EMAIL_LABEL,
  END_DATE,
  INTERVAL
} = PRESCRIPTION_LABELS;
const {
  PRESCRIPTION: PRESCRIPTION_PLACEHOLDER,
  QUANTITY: QUANTITY_PLACEHOLDER,
  FURTHER_ADVICE: FURTHER_ADVICE_PLACEHOLDER
} = PRESCRIPTION_PLACEHOLDERS;
const { GENERIC_SUCCESS } = MESSAGES;

export default {
  props: {
    header: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  components: { Info },
  data() {
    return {
      info: null,
      infoType: null,
      loading: false,
      createType: CREATE,
      INPUT_TYPES,
      inputElements: {
        email: {
          label: EMAIL_LABEL,
          placeholder: EMAIL_PLACEHOLDER,
          model: getters.prescription().patientEmail,
          icon: EMAIL_ICON,
          type: TYPE_EMAIL,
          onBlur: () => this.getPatientName(),
          required: true,
          hint: EMAIL_HINT,
          rules: EMAIL_RULE
        },
        name: {
          label: NAME_LABEL,
          placeholder: NAME_PLACEHOLDER,
          model: getters.prescription().patientName,
          icon: ACCOUNT_ICON,
          disabled: true,
          rules: NAME_RULE
        },
        prescription: {
          label: PRESCRIPTION_LABEL,
          placeholder: PRESCRIPTION_PLACEHOLDER,
          model: getters.prescription().prescription,
          icon: PRESCRIPTION_ICON,
          hint: PRESCRIPTION_HINT,
          required: true,
          rules: PRESCRIPTION_RULE
        },
        quantity: {
          label: QUANTITY_LABEL,
          placeholder: QUANTITY_PLACEHOLDER,
          hint: QUANTITY_HINT,
          icon: QUANTITY_ICON,
          model: getters.prescription().quantity,
          min: 1,
          type: TYPE_NUMBER,
          rules: QUANTITY_RULE,
          required: true
        },
        date: {
          label: END_DATE,
          min: new Date(),
          model: getters.prescription().expectedDateEnd || new Date(),
          icon: DATE_ICON,
          type: "date",
          rules: DATE_RULE
        }
      },
      dropdownElements: {
        unit: {
          label: UNITS_LABEL,
          items: UNIT_VALUES,
          hint: UNIT_HINT,
          icon: QUANTITY_ICON,
          value: 'ml',
          onChange: unit =>
            mutations.setPrescription({ ...getters.prescription(), unit })
        },
        interval: {
          label: INTERVAL,
          items: INTERVAL_VALUES,
          hint: INTERVAL_HINT,
          value: 1,
          icon: INTERVAL_ICON,
          onChange: interval =>
            mutations.setPrescription({ ...getters.prescription(), interval })
        }
      },
      advice: {
        label: FURTHER_ADVICE_LABEL,
        hint: FURTHER_ADVICE_HINT,
        placeholder: FURTHER_ADVICE_PLACEHOLDER,
        icon: ADVICE_ICON,
        model: getters.prescription().furtherAdvice
      },
      endDate: {
        label: END_DATE,
        min: new Date(),
        model: getters.prescription().expectedDateEnd || new Date(),
        icon: DATE_ICON
      }
    };
  },

  methods: {
    async getPatientName() {
      const email = this.inputElements.email.model;
      try {
        const name = await actions.getPatientName(email);
        this.inputElements.name.model = name;
      } catch (error) {
        this.infoType = "error";
        this.info = error.message;
      }
    },
    async submit() {
      if (!this.$refs.form.validate()) return;
      // update store
      mutations.setPrescription({
        ...getters.prescription(),
        patientEmail: this.inputElements.email.model
      });
      mutations.setPrescription({
        ...getters.prescription(),
        quantity: this.inputElements.quantity.model
      });
      mutations.setPrescription({
        ...getters.prescription(),
        prescription: this.inputElements.prescription.model
      });
      mutations.setPrescription({
        ...getters.prescription(),
        furtherAdvice: this.advice.model
      });
      mutations.setPrescription({
        ...getters.prescription(),
        expectedDateEnd: this.inputElements.date.model
      });

      try {
        this.type === EDIT
          ? await actions.updatePrescription()
          : await actions.createPrescription();
        this.infoType = "success";
        this.$refs.form.reset();
        this.info = GENERIC_SUCCESS;
      } catch (error) {
        this.infoType = "error";
        this.info = error.message;
        this.inputElements.email.model = "";
      }
    }
  }
};
</script>