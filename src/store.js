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
import {
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} from "http-status-codes";

import Vue from "vue";
import api from "./config/axios.config";
import { omit } from 'lodash';
import router from "./router";

const {
  EMAIL_AVAILABLE,
  VERIFY_PHONE,
  REGISTER,
  LOGIN,
  GET_PATIENT,
  PRESCRIPTION
} = API_ROUTES;
const {
  FAILED_EMAIL_CHECK,
  LOGOUT,
  BAD_LOGIN,
  GENERIC_ERROR,
  EXPIRED_TOKEN
} = MESSAGES;
const { DEVELOPMENT: DEV_HOST, PRODUCTION: PROD_HOST } = API_HOSTS;
const { DEVELOPMENT } = NODE_ENVIRONS;
const { PATIENT } = ACCOUNT_TYPES;
const { TOKEN, NAME, ACCOUNT_TYPE, PHONE, EMAIL } = STORAGE_KEYS;
const { LOGIN: LOGIN_ROUTE, HOME: INDEX_ROUTE } = UI_ROUTES;

const apiUrl = NODE_ENV === DEVELOPMENT ? `${DEV_HOST}` : `${PROD_HOST}`;

export const state = Vue.observable({
  phone: localStorage.getItem(PHONE) || "",
  accountType: localStorage.getItem(ACCOUNT_TYPE) || PATIENT,
  prescription: {
    patientEmail: "",
    interval: "",
    prescription: "",
    furtherAdvice: "",
    expectedDateEnd: new Date(),
    patientName: "",
    unit: "ml",
    quantity: "1",
    _id: ""
  },
  offline: false,
  name: localStorage.getItem(NAME) || "",
  password: "",
  verificationCode: DEFAULT_VERIFICATION_CODE,
  loggedIn: !!localStorage.getItem(TOKEN),
  codeSent: false,
  token: localStorage.getItem(TOKEN) || null,
  email: localStorage.getItem(EMAIL) || ""
});

export const getters = {
  phone: () => state.phone,
  email: () => state.email,
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
  setToken: token => (state.token = token),
  setEmail: email => (state.email = email)
};

export const actions = {
  async checkEmailAvailable(email) {
    const url = `${apiUrl}/${EMAIL_AVAILABLE}/${email}`;
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
      return Promise.reject({ message: FAILED_EMAIL_CHECK });
    }
  },

  getAcessToken() {
    return {
      headers: { "x-access-token": getters.token() }
    };
  },

  async getPatientName(email) {
    const config = this.getAcessToken();
    const url = `${apiUrl}/${GET_PATIENT}/${email}`;
    try {
      const response = await api.get(url, config);
      const { name } = response.data.data;
      mutations.setPrescription({
        ...getters.prescription(),
        patientName: name
      });
      return name;
    } catch (error) {
      if (error.response) {
        const {
          data: { message },
          status
        } = error.response;

        // token expired, maybe?
        if (this.isTokenExpired(status))
          this.invalidTokenManager(), { message };

        // user not exist?
        if (status === NOT_FOUND) return Promise.reject({ message });
      }
      // crazy error, send generic message
      return Promise.reject({ message: GENERIC_ERROR });
    }
  },

  async sendVerificationCode() {
    // paused due to twilio trial
    const url = `${apiUrl}/${VERIFY_PHONE}/${state.phone}`;
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
    const url = `${apiUrl}/${REGISTER}`;
    try {
      const payload = {
        email: getters.email(),
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

  isTokenExpired(status) {
    return status === UNAUTHORIZED;
  },

  invalidTokenManager() {
    if (confirm(EXPIRED_TOKEN)) this.logout();
  },

  logout() {
    const response = confirm(LOGOUT);
    if (response) {
      // clear storage
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(NAME);
      localStorage.removeItem(ACCOUNT_TYPE);
      localStorage.removeItem(EMAIL);

      // clear store
      mutations.setName("");
      mutations.setToken(null);
      mutations.setAccountType(PATIENT);
      mutations.setEmail("");
      mutations.setPassword("");
      mutations.setLoggedIn(false);

      // redirect to login
      router.push(LOGIN_ROUTE);
    }
  },

  async login() {
    const url = `${apiUrl}/${LOGIN}`;
    const payload = {
      email: getters.email(),
      password: getters.password()
    };

    try {
      const response = await api.post(url, payload);
      const data = response.data.data;
      // all good, save session
      this.persistData(data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === UNAUTHORIZED)
          return Promise.reject({ message: BAD_LOGIN });
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    }
  },

  persistData(data) {
    const { token, email, accountType, name } = data;
    // store in state
    mutations.setLoggedIn(true);
    mutations.setName(name);
    mutations.setEmail(email);
    mutations.setAccountType(accountType);
    mutations.setToken(token);

    // store in local storage for future use
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(EMAIL, email);
    localStorage.setItem(NAME, name);
    localStorage.setItem(ACCOUNT_TYPE, accountType);

    // navigate to home
    router.push(INDEX_ROUTE);
  },

  async createPrescription() {
    const config = this.getAcessToken();
    const payload = omit(getters.prescription(), ["_id", "patientName"]);
    const url = `${apiUrl}/${PRESCRIPTION}`;
    try {
      await api.post(url, payload, config);
    } catch (error) {
      if (error.response) {
        const {
          data: { message },
          status
        } = error.response;

        // token expired, maybe?
        if (this.isTokenExpired(status))
          this.invalidTokenManager(), { message };

        return Promise.reject({ message });
      }
      return Promise.reject({ message: GENERIC_ERROR });
    }
  },
  async updatePrescription() {
    const config = this.getAcessToken();
    const payload = getters.prescription();
    const url = `${apiUrl}/${PRESCRIPTION}`;
    try {
      await api.patch(url, payload, config);
    } catch (error) {
      const {
        data: { message },
        status
      } = error.response;

      // token expired, maybe?
      if (this.isTokenExpired(status)) this.invalidTokenManager(), { message };
      // not that, send error to component
      return Promise.reject({ message: GENERIC_ERROR });
    }
  }
};
