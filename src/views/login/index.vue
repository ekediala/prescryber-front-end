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
                  @click:append="input.type === INPUT_TYPES.PASSWORD ? (input.hide = !input.hide) : null"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-col cols="12" lg="6" md="8">
                <v-btn :loading="loading" color="primary" type="submit">{{ SUBMIT_TEXT }}</v-btn>
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
  ERROR_MESSAGES,
  HINTS,
  SUBMIT_TEXT
} from "../register/constants";
import { INPUT_TYPES, ICONS } from "../../constants";
import { NAME } from "./constants";
import Info from "../../components/Info.vue";
export default {
  name: NAME,
  components: { Info },
  data() {
    return {
      loading: false,
      info: null,
      type: null,
      NAME,
      INPUT_TYPES,
      ICONS,
      SUBMIT_TEXT,
      inputElements: [
        {
          label: LABELS.PHONE,
          placeholder: PLACEHOLDERS.PHONE,
          model: getters.phone(),
          icon: ICONS.PHONE,
          type: INPUT_TYPES.PHONE,
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
  methods: {
    async login() {
      if (!this.$refs.loginForm.validate()) return;
      this.loading = true;
      mutations.setPhone(this.inputElements[0].model);
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