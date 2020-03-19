<template>
  <v-container fluid class="fill height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-toolbar-title class="text-center text-uppercase primary--text">Enter new password</v-toolbar-title>
      </v-col>
    </v-row>
    <v-row v-if="error" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="mx-auto" max-width="344" raised shaped>
          <v-card-text class="text-center">{{ error }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" v-else>
      <v-col cols="12" md="8" lg="6">
        <v-form ref="form">
          <v-container>
            <v-row v-if="info" justify="center">
              <v-col cols="12" md="8" lg="6">
                <info :type="infoType" :message="info" />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-text-field
                  :rules="passwordInput.rules"
                  :label="passwordInput.label"
                  :append-icon="hidden ? passwordInput.hideIcon : passwordInput.showIcon"
                  @click:append="hidden = !hidden"
                  :type="hidden ? passwordInput.type : TEXT_TYPE"
                  v-model="passwordInput.model"
                  filled
                  shaped
                  @focus="info = null"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-btn @click.prevent="resetPassword" block color="primary">Reset Password</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Info from "../../../components/Info";
import { LABELS } from "../../register/constants";
import { actions } from "../../../store";
import { ICONS, INPUT_TYPES, MESSAGES } from "../../../constants";
import { RULES } from "../../../validators/index";

const { PASSWORD: PASSWORD_RULE } = RULES;
const { PASSWORD: PASSWORD_LABEL } = LABELS;
const { EYE, EYE_OFF } = ICONS;
const { PASSWORD: PASSWORD_TYPE, TEXT: TEXT_TYPE } = INPUT_TYPES;
const { GENERIC_SUCCESS } = MESSAGES;

export default {
  name: "PasswordReset",
  data() {
    return {
      error: null,
      infoType: "info",
      info: null,
      hidden: true,
      token: null,
      TEXT_TYPE,
      passwordInput: {
        label: PASSWORD_LABEL,
        rules: PASSWORD_RULE,
        hideIcon: EYE,
        showIcon: EYE_OFF,
        type: PASSWORD_TYPE,
        model: ""
      }
    };
  },
  components: { Info },
  methods: {
    async resetPassword() {
      if (!this.$refs.form.validate()) return;
      const loader = this.$loading.show({ cancelable: false });
      try {
        const password = this.passwordInput.model;
        await actions.updatePassword(this.token, password);
        this.infoType = "success";
        this.info = GENERIC_SUCCESS;
      } catch ({ message }) {
        this.infoType = "error";
        this.info = message;
      } finally {
        loader.hide();
      }
    }
  },
  mounted() {
    this.token = this.$route.params.token;
  }
};
</script>