import {
  ACCOUNT_TYPES,
  API_HOSTS,
  API_ROUTES,
  DEFAULT_VERIFICATION_CODE,
  MESSAGES,
  NODE_ENV,
  NODE_ENVIRONS,
  TOKEN_STORAGE_KEY
} from "./constants";

import { UNPROCESSABLE_ENTITY } from "http-status-codes";
import Vue from "vue";
import api from "./config/axios.config";

const { NUMBER_AVAILABLE, VERIFY_PHONE, REGISTER } = API_ROUTES;
const { FAILED_PHONE_CHECK, LOGOUT } = MESSAGES;
const { DEVELOPMENT: DEV_HOST, PRODUCTION: PROD_HOST } = API_HOSTS;
const { DEVELOPMENT } = NODE_ENVIRONS;
const { PATIENT } = ACCOUNT_TYPES;

export const state = Vue.observable({
  phone: "",
  accountType: PATIENT,
  prescription: null,
  offline: false,
  name: "",
  password: "",
  verificationCode: DEFAULT_VERIFICATION_CODE,
  loggedIn: !!localStorage.getItem("token"),
  codeSent: false
});

export const getters = {
  phone: () => state.phone,
  accountType: () => state.accountType,
  offline: () => state.offline,
  name: () => state.name,
  prescription: () => state.prescription,
  password: () => state.password,
  verificationCode: () => state.verificationCode,
  loggedIn: () => state.loggedIn,
  codeSent: () => state.codeSent
};

export const mutations = {
  setPhone: phone => (state.phone = phone),
  setAccountType: accType => (state.accountType = accType),
  setPrescription: prescription => (state.prescription = prescription),
  setName: name => (state.name = name),
  setOffline: status => (state.offline = status),
  setPassword: password => (state.password = password),
  setCode: code => (state.verificationCode = code),
  setLoggedIn: (status = true, token = null) => {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    state.loggedIn = status;
  },
  setCodeSent: status => (state.codeSent = status)
};

export const actions = {
  async checkNumberAvailable(phone) {
    const url =
      NODE_ENV === DEVELOPMENT
        ? `${DEV_HOST}/${NUMBER_AVAILABLE}/${phone}`
        : `${PROD_HOST}/${NUMBER_AVAILABLE}/${phone}`;
    try {
      await api.get(url);
      return true;
    } catch (err) {
      if (err.response) {
        const {
          data: { message },
          status
        } = err.response;
        // phone number is taken
        if (status === UNPROCESSABLE_ENTITY) return Promise.reject({ message });
      }
      // crazy error, send generic message
      return Promise.reject({ message: FAILED_PHONE_CHECK });
    }
  },

  async sendVerificationCode() {
    // paused due to twilio trial
    const url =
      NODE_ENV === DEVELOPMENT
        ? `${DEV_HOST}/${VERIFY_PHONE}/${state.phone}`
        : `${PROD_HOST}/${VERIFY_PHONE}/${state.phone}`;
    try {
      const {
        data: { verificationCode }
      } = await api.get(url);
      mutations.setCode(verificationCode);
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  },

  async register() {
    const url =
      NODE_ENV === DEVELOPMENT
        ? `${DEV_HOST}/${REGISTER}`
        : `${PROD_HOST}/${REGISTER}`;
    try {
      const payload = {
        phone: getters.phone(),
        name: getters.name(),
        password: getters.password(),
        accountType: getters.accountType(),
        verificationCode: getters.verificationCode()
      };
      const response = await api.post(url, payload);
      const { token } = response.data.data;
      mutations.setLoggedIn(undefined, token);
      return true;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  },

  async logout() {
    const response = confirm(LOGOUT);
    if (response) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      mutations.setLoggedIn(false);
      return true;
    }
    return Promise.reject(false);
  }
};
