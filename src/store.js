import {
  ACCOUNT_TYPES,
  API_HOSTS,
  API_ROUTES,
  DEFAULT_VERIFICATION_CODE,
  MESSAGES,
  NODE_ENV,
  NODE_ENVIRONS,
  STORAGE_KEYS,
  UI_ROUTES
} from "./constants";

import { UNPROCESSABLE_ENTITY } from "http-status-codes";
import Vue from "vue";
import api from "./config/axios.config";
import router from "./router";

const { NUMBER_AVAILABLE, VERIFY_PHONE, REGISTER, LOGIN } = API_ROUTES;
const { FAILED_PHONE_CHECK, LOGOUT } = MESSAGES;
const { DEVELOPMENT: DEV_HOST, PRODUCTION: PROD_HOST } = API_HOSTS;
const { DEVELOPMENT } = NODE_ENVIRONS;
const { PATIENT } = ACCOUNT_TYPES;
const { TOKEN, NAME, ACCOUNT_TYPE, PHONE } = STORAGE_KEYS;
const { LOGIN: LOGIN_ROUTE, HOME: INDEX_ROUTE } = UI_ROUTES;

export const state = Vue.observable({
  phone: localStorage.getItem(PHONE) || "",
  accountType: localStorage.getItem(ACCOUNT_TYPE) || PATIENT,
  prescription: null,
  offline: false,
  name: localStorage.getItem(NAME) || "",
  password: "",
  verificationCode: DEFAULT_VERIFICATION_CODE,
  loggedIn: !!localStorage.getItem(TOKEN),
  codeSent: false,
  token: localStorage.getItem(TOKEN) || null
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
  codeSent: () => state.codeSent,
  token: () => state.token
};

export const mutations = {
  setPhone: phone => (state.phone = phone),
  setAccountType: accType => (state.accountType = accType),
  setPrescription: prescription => (state.prescription = prescription),
  setName: name => (state.name = name),
  setOffline: status => (state.offline = status),
  setPassword: password => (state.password = password),
  setCode: code => (state.verificationCode = code),
  setLoggedIn: status => (state.loggedIn = status),
  setCodeSent: status => (state.codeSent = status),
  setToken: token => (state.token = token)
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
      const data = response.data.data;
      // all good, persist data
      this.persistData(data);
      return true;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  },

  async logout() {
    const response = confirm(LOGOUT);
    if (response) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(NAME);
      localStorage.removeItem(ACCOUNT_TYPE);
      localStorage.removeItem(PHONE);
      mutations.setName("");
      mutations.setToken(null);
      mutations.setAccountType(PATIENT);
      mutations.setPhone("");
      mutations.setLoggedIn(false);
      router.push(LOGIN_ROUTE);
      return true;
    }
    return Promise.reject(false);
  },

  async login() {
    const url =
      NODE_ENV === DEVELOPMENT
        ? `${DEV_HOST}/${LOGIN}`
        : `${PROD_HOST}/${LOGIN}`;

    const payload = {
      phone: getters.phone(),
      password: getters.password()
    };

    try {
      const response = await api.post(url, payload);
      const data = response.data.data;
      // all good, save session
      this.persistData(data);
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  },

  persistData(data) {
    const { token, phone, accountType, name } = data;
    mutations.setLoggedIn(true);
    mutations.setName(name);
    mutations.setPhone(phone);
    mutations.setAccountType(accountType);
    mutations.setToken(token);
    // navigate to home
    router.push(INDEX_ROUTE);
  }
};
