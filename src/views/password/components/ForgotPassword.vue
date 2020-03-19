<template>
  <v-container fluid class="fill height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-toolbar-title class="text-center text-uppercase primary--text">Enter email address</v-toolbar-title>
      </v-col>
    </v-row>
    <v-row justify="center">
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
                  :rules="emailInput.rules"
                  :label="emailInput.label"
                  :append-icon="emailInput.icon"
                  :type="emailInput.type"
                  v-model="emailInput.model"
                  filled
                  @focus="info = null"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-btn @click.prevent="submit" block color="primary">Submit</v-btn>
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
import { ICONS, INPUT_TYPES } from "../../../constants";
import { RULES } from "../../../validators/index";

const { EMAIL: EMAIL_LABEL } = LABELS;
const { EMAIL: EMAIL_TYPE } = INPUT_TYPES;
const { EMAIL: EMAIL_ICON } = ICONS;
const { EMAIL: EMAIL_RULE } = RULES;

export default {
  components: { Info },
  data() {
    return {
      error: null,
      infoType: "info",
      info: null,
      emailInput: {
        label: EMAIL_LABEL,
        rules: EMAIL_RULE,
        icon: EMAIL_ICON,
        type: EMAIL_TYPE,
        model: ""
      }
    };
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return;
      const loader = this.$loading.show();
      try {
        const response = await actions.resetPassword(this.emailInput.model);
        this.infoType = "success";
        this.info = response;
      } catch ({ message }) {
        this.infoType = "error";
        this.info = message;
      } finally {
        loader.hide();
      }
    }
  }
};
</script>