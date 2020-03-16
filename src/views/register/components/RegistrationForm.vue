<template>
  <v-form ref="form" v-model="valid" :lazy-validation="false" @submit.prevent="submit">
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
      <v-row justify="center" v-for="(input, index) in inputElements" :key="index">
        <v-col cols="12" md="8" lg="6">
          <v-text-field
            shaped
            filled
            :append-icon="input.hide && input.type === INPUT_TYPES.PASSWORD ? input.icon2 : input.icon"
            :label="input.label"
            :placeholder="input.placeholder"
            :required="input.required"
            :disabled="loading"
            :rules="input.rules"
            :type="input.hide ? input.type : INPUT_TYPES.TEXT"
            v-model="input.model"
            @focus="(info = null, phoneStatus = null)"
            @blur="input.onBlur ? input.onBlur() : null"
            :counter="input.counter"
            :maxLength="input.maxLength"
            :hint="input.hint"
            @click:append="input.type === INPUT_TYPES.PASSWORD ? (input.hide = !input.hide) : null"
          ></v-text-field>
          <small class="success--text mt-10n" v-if="index === 1 && phoneStatus">{{ phoneStatus }}</small>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-checkbox
            shaped
            filled
            append-icon="mdi-hospital"
            class="shrink mr-2 mt-0"
            v-model="checked"
            color="orange"
            hide-details
            :disabled="loading"
            :label="labels.accountType"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-btn :loading="loading" color="primary" type="submit">{{ SUBMIT_TEXT }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { actions, getters, mutations } from "../../../store";
import {
  LABELS,
  PLACEHOLDERS,
  HINTS,
  NAME,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SUBMIT_TEXT
} from "../constants";
import { ACCOUNT_TYPES, INPUT_TYPES, ICONS } from "../../../constants";
import Info from "../../../components/Info.vue";
export default {
  name: NAME,
  components: { Info },
  data() {
    return {
      labels: { accountType: LABELS.ACCOUNT_TYPE, SUBMIT_TEXT },
      INPUT_TYPES,
      SUBMIT_TEXT,
      ICONS,
      header: NAME,
      checked: false,
      loading: false,
      info: null,
      valid: true,
      infoType: null,
      phoneStatus: null,
      inputElements: [
        {
          label: LABELS.NAME,
          placeholder: PLACEHOLDERS.NAME,
          model: getters.name(),
          rules: [v => !!v || ERROR_MESSAGES.NAME_REQUIRED],
          icon: ICONS.ACCOUNT,
          required: true
        },
        {
          label: LABELS.PHONE,
          placeholder: PLACEHOLDERS.PHONE,
          model: getters.phone(),
          icon: ICONS.PHONE,
          type: INPUT_TYPES.PHONE,
          onBlur: () => this.isNumberAvailable(),
          counter: 11,
          maxLength: 11,
          required: true,
          hint: HINTS.PHONE,
          rules: [
            v => !!v || ERROR_MESSAGES.PHONE_REQUIRED,
            v => v.length === 11 || ERROR_MESSAGES.PHONE_LENGTH,
            v => {
              const pattern = /^0\d{10}/;
              return pattern.test(v) || ERROR_MESSAGES.PHONE_INVALID;
            }
          ]
        },
        {
          label: LABELS.PASSWORD,
          placeholder: PLACEHOLDERS.PASSWORD,
          model: getters.password(),
          type: INPUT_TYPES.PASSWORD,
          icon: ICONS.EYE,
          icon2: ICONS.EYE_OFF,
          hide: true,
          min: 6,
          required: true,
          rules: [
            v => !!v || ERROR_MESSAGES.PASSWORD_REQUIRED,
            v => v.length >= 6 || ERROR_MESSAGES.PASSWORD_LENGTH
          ]
        }
      ]
    };
  },
  computed: {
    accountType: getters.accountType,
  },
  methods: {
    async isNumberAvailable() {
      if (/^0\d{10}/.test(this.inputElements[1].model)) {
        // valid phone number
        try {
          await actions.checkNumberAvailable(this.inputElements[1].model);
          this.phoneStatus = SUCCESS_MESSAGES.VALID_PHONE;
        } catch ({ message }) {
          this.inputElements[1].model = "";
          this.infoType = "error";
          this.info = message;
        }
      }
    },

    async submit() {
      try {
        if (!this.$refs.form.validate()) return;
        this.loading = true;
        this.checked
          ? mutations.setAccountType(ACCOUNT_TYPES.PRESCRIBER)
          : null;
        mutations.setName(this.inputElements[0].model);
        mutations.setPassword(this.inputElements[2].model);
        mutations.setPhone(this.inputElements[1].model);
        await actions.register();
      } catch ({ message }) {
        this.info = message;
        this.infoType = "error";
        this.loading = false;
      }
    }
  }
};
</script>

<style></style>
