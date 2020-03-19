<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-form @submit.prevent="login" ref="loginForm">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" lg="6" md="8">
                <v-toolbar-title class="text-center text-uppercase primary--text">{{ NAME }}</v-toolbar-title>
              </v-col>
            </v-row>

            <v-row v-if="info" justify="center">
              <v-col cols="12" lg="6" md="8">
                <info :type="type" :message="info" @click="info = null" />
              </v-col>
            </v-row>

            <v-row justify="center" v-for="(input, index) in inputElements" :key="index">
              <v-col cols="12" lg="6" md="8">
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
                  :counter="input.counter"
                  :maxLength="input.maxLength"
                  :hint="input.hint"
                  @focus="info = null"
                  @click:append="input.type === INPUT_TYPES.PASSWORD ? (input.hide = !input.hide) : null"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" lg="6" md="8">
                <v-btn :loading="loading" color="primary" type="submit">{{ SUBMIT_TEXT }}</v-btn>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" lg="6" md="8">
                <p>
                  Forgot password? 
                  <router-link :to="FORGOT_PASSWORD_LINK" class="body-1">reset password</router-link>
                </p>
                <p>
                  Not registered, sign up 
                  <router-link :to="REGISTER_LINK" class="body-1">here</router-link>
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mutations, getters, actions } from "../../store";
import {
  LABELS,
  PLACEHOLDERS,
  HINTS,
  SUBMIT_TEXT
} from "../register/constants";
import { INPUT_TYPES, ICONS, UI_ROUTES } from "../../constants";
import { NAME } from "./constants";
import Info from "../../components/Info.vue";
import { RULES } from "../../validators";

const { PASSWORD: TYPE_PASSWORD, EMAIL: TYPE_EMAIL } = INPUT_TYPES;
const { EMAIL: EMAIL_HINT } = HINTS;
const { EYE_OFF, EYE, EMAIL: EMAIL_ICON } = ICONS;
const { PASSWORD: PASSWORD_LABEL, EMAIL: EMAIL_LABEL } = LABELS;
const { PASSWORD: PASSWORD_RULES, EMAIL: EMAIL_RULES } = RULES;
const {
  PASSWORD: PASSWORD_PLACEHOLDER,
  EMAIL: EMAIL_PLACEHOLDER
} = PLACEHOLDERS;
const { REGISTER, FORGOT_PASSWORD } = UI_ROUTES;
export default {
  name: NAME,
  components: { Info },
  data() {
    return {
      loading: false,
      info: null,
      type: null,
      REGISTER_LINK: REGISTER,
      FORGOT_PASSWORD_LINK: FORGOT_PASSWORD,
      NAME,
      INPUT_TYPES,
      ICONS,
      SUBMIT_TEXT,
      inputElements: [
        {
          label: EMAIL_LABEL,
          placeholder: EMAIL_PLACEHOLDER,
          model: getters.email(),
          icon: EMAIL_ICON,
          type: TYPE_EMAIL,
          required: true,
          hint: EMAIL_HINT,
          rules: EMAIL_RULES
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
          rules: PASSWORD_RULES
        }
      ]
    };
  },
  methods: {
    async login() {
      if (!this.$refs.loginForm.validate()) return;
      this.loading = true;
      mutations.setEmail(this.inputElements[0].model);
      mutations.setPassword(this.inputElements[1].model);
      try {
        await actions.login();
      } catch (error) {
        this.loading = false;
        this.type = "error";
        this.info = error.message;
      }
    }
  }
};
</script>