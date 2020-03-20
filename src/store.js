import {
  ACCOUNT_TYPES,
  API_HOSTS,
  API_ROUTES,
  MESSAGES,
  NEW_PRESCRIPTION,
  NODE_ENV,
  NODE_ENVIRONS,
  STORAGE_KEYS,
  UI_ROUTES
} from "./constants";
import { UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "http-status-codes";

import Swal from "sweetalert2";
import Vue from "vue";
import api from "./config/axios.config";
import { omit } from "lodash";
import router from "./router";

const {
  EMAIL_AVAILABLE,
  REGISTER,
  LOGIN,
  GET_PATIENT,
  PRESCRIPTION,
  PASSWORD_RESET_SEND,
  PASSWORD_RESET
} = API_ROUTES;
const {
  FAILED_EMAIL_CHECK,
  BAD_LOGIN,
  GENERIC_ERROR,
  EXPIRED_TOKEN
} = MESSAGES;
const { DEVELOPMENT: DEV_HOST, PRODUCTION: PROD_HOST } = API_HOSTS;
const { DEVELOPMENT } = NODE_ENVIRONS;
const { PATIENT } = ACCOUNT_TYPES;
const { TOKEN, NAME, ACCOUNT_TYPE, EMAIL } = STORAGE_KEYS;
const { LOGIN: LOGIN_ROUTE, HOME: INDEX_ROUTE } = UI_ROUTES;

const apiUrl = NODE_ENV === DEVELOPMENT ? `${DEV_HOST}` : `${PROD_HOST}`;

export const state = Vue.observable({
  accountType: localStorage.getItem(ACCOUNT_TYPE) || PATIENT,
  prescription: NEW_PRESCRIPTION,
  offline: false,
  name: localStorage.getItem(NAME) || "",
  password: "",
  loggedIn: !!localStorage.getItem(TOKEN),
  token: localStorage.getItem(TOKEN) || null,
  email: localStorage.getItem(EMAIL) || "",
  allPrescriptions: []
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
  token: () => state.token,
  allPrescriptions: () => state.allPrescriptions
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
  setEmail: email => (state.email = email),
  setAllPrescriptions: prescriptions => (state.allPrescriptions = prescriptions)
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

  getAcessToken(token = null) {
    return {
      headers: { "x-access-token": token || getters.token() }
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
      if (error.response)
        return Promise.reject(this.handleResponseError(error.response));
      return Promise.reject({ message: GENERIC_ERROR });
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

  async logout() {
    const response = await Swal.fire({
      title: "Log out",
      text: "You will be logged out of the app",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!"
    });

    if (response.value) {
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

  handleResponseError(response) {
    const {
      data: { message },
      status
    } = response;

    // token expired, maybe?
    if (this.isTokenExpired(status)) {
      this.invalidTokenManager();
    }

    // no send back message
    return { message };
  },

  async createPrescription() {
    const config = this.getAcessToken();
    const payload = omit(getters.prescription(), ["_id", "patientName"]);
    const url = `${apiUrl}/${PRESCRIPTION}`;
    try {
      const response = await api.post(url, payload, config);
      const { message } = response.data.data;
      mutations.setPrescription(NEW_PRESCRIPTION);
      return message;
    } catch (error) {
      console.log(error);
      if (error.response)
        return Promise.reject(this.handleResponseError(error.response));
      return Promise.reject({ message: GENERIC_ERROR });
    }
  },

  async updatePrescription() {
    const config = this.getAcessToken();
    const payload = omit(getters.prescription(), "__v");
    const url = `${apiUrl}/${PRESCRIPTION}`;
    try {
      const response = await api.patch(url, payload, config);
      const { message } = response.data.data;
      mutations.setPrescription(NEW_PRESCRIPTION);
      return message;
    } catch (error) {
      if (error.response)
        return Promise.reject(this.handleResponseError(error.response));
      return Promise.reject({ message: GENERIC_ERROR });
    }
  },

  async deletePrescription(id) {
    const config = this.getAcessToken();
    const url = `${apiUrl}/${PRESCRIPTION}`;
    try {
      const response = await api.delete(url, { ...config, data: { _id: id } });
      const { message } = response.data.data;
      return message;
    } catch (error) {
      if (error.response)
        return Promise.reject(this.handleResponseError(error.response));
      return Promise.reject({ message: GENERIC_ERROR });
    }
  },

  async loadPrescriptions() {
    const url = `${apiUrl}/${PRESCRIPTION}`;
    const config = this.getAcessToken();
    try {
      const response = await api.get(url, config);
      const { prescriptions } = response.data.data;
      mutations.setAllPrescriptions(prescriptions);
      return prescriptions;
    } catch (error) {
      if (error.response)
        return Promise.reject(this.handleResponseError(error.response));
      return Promise.reject({ message: GENERIC_ERROR });
    }
  },

  async resetPassword(email) {
    try {
      const url = `${apiUrl}/${PASSWORD_RESET_SEND}`;
      const response = await api.post(url, { email });
      const { message } = response.data.data;
      return message;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject({ message: error.message });
    }
  },

  async updatePassword(token, password) {
    try {
      const url = `${apiUrl}/${PASSWORD_RESET}`;
      const config = this.getAcessToken(token);
      const response = await api.post(url, { password }, config);
      const { message } = response.data.data;
      return message;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject({ message: GENERIC_ERROR });
    }
  }
};
