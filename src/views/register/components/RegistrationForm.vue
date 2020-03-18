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
            @focus="(info = null, emailStatus = null)"
            @blur="input.onBlur ? input.onBlur() : null"
            :counter="input.counter"
            :maxLength="input.maxLength"
            :hint="input.hint"
            @click:append="input.type === INPUT_TYPES.PASSWORD ? (input.hide = !input.hide) : null"
          ></v-text-field>
          <small class="success--text mt-10n" v-if="index === 1 && emailStatus">{{ emailStatus }}</small>
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
          <p class="mt-2">
            Registered?
            <router-link :to="LOGIN_LINK" class="body-1">Login</router-link>
          </p>
        </v-col>
      </v-row>
      <v-row justify="center"></v-row>
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
  SUCCESS_MESSAGES,
  SUBMIT_TEXT
} from "../constants";
import {
  ACCOUNT_TYPES,
  INPUT_TYPES,
  ICONS,
  UI_ROUTES,
  PATTERNS
} from "../../../constants";
import Info from "../../../components/Info.vue";
import { RULES } from "../../../validators/index";

const { EMAIL: EMAIL_PATTERN } = PATTERNS;
const { LOGIN } = UI_ROUTES;
const { ACCOUNT, EYE, EYE_OFF, EMAIL: EMAIL_ICON } = ICONS;
const { PASSWORD: PASSWORD_RULE, NAME: NAME_RULE, EMAIL: EMAIL_RULE } = RULES;
const {
  NAME: NAME_LABEL,
  PASSWORD: PASSWORD_LABEL,
  ACCOUNT_TYPE,
  EMAIL: EMAIL_LABEL
} = LABELS;
const { PRESCRIBER } = ACCOUNT_TYPES;
const { VALID_EMAIL } = SUCCESS_MESSAGES;
const {
  NAME: NAME_PLACEHOLDER,
  PASSWORD: PASSWORD_PLACEHOLDER,
  EMAIL: EMAIL_PLACEHOLDER
} = PLACEHOLDERS;
const { PASSWORD: TYPE_PASSWORD, EMAIL: TYPE_EMAIL } = INPUT_TYPES;
const { EMAIL: EMAIL_HINT } = HINTS;

export default {
  name: NAME,
  components: { Info },
  data() {
    return {
      labels: { accountType: ACCOUNT_TYPE },
      INPUT_TYPES,
      SUBMIT_TEXT,
      LOGIN_LINK: LOGIN,
      ICONS,
      header: NAME,
      checked: false,
      loading: false,
      info: null,
      valid: true,
      infoType: null,
      emailStatus: null,
      inputElements: [
        {
          label: NAME_LABEL,
          placeholder: NAME_PLACEHOLDER,
          model: getters.name(),
          rules: NAME_RULE,
          icon: ACCOUNT,
          required: true
        },
        {
          label: EMAIL_LABEL,
          placeholder: EMAIL_PLACEHOLDER,
          model: getters.email(),
          icon: EMAIL_ICON,
          type: TYPE_EMAIL,
          onBlur: () => this.isEmailAvailable(),
          required: true,
          hint: EMAIL_HINT,
          rules: EMAIL_RULE
        },
        {
          label: PASSWORD_LABEL,
          placeholder: PASSWORD_PLACEHOLDER,
          model: getters.password(),
          type: TYPE_PASSWORD,
          icon: EYE,
          icon2: EYE_OFF,
          hide: true,
          min: 6,
          required: true,
          rules: PASSWORD_RULE
        }
      ]
    };
  },
  methods: {
    async isEmailAvailable() {
      const email = this.inputElements[1].model;
      if (EMAIL_PATTERN.test(email)) {
        // valid phone number
        try {
          await actions.checkEmailAvailable(email);
          this.emailStatus = VALID_EMAIL;
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
        this.checked ? mutations.setAccountType(PRESCRIBER) : null;
        mutations.setName(this.inputElements[0].model);
        mutations.setPassword(this.inputElements[2].model);
        mutations.setEmail(this.inputElements[1].model);
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
