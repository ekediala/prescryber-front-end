/**
 * Valid account types object
 * @constant
 */
export const ACCOUNT_TYPES = {
  PRESCRIBER: "prescriber",
  PATIENT: "patient"
};

/**
 * App UI routes
 * @constant
 */
export const UI_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PRESCRIPTION: "/prescription",
  EDIT_PRESCRIPTION: "/prescription/edit",
  CREATE_PRESCRIPTION: "/prescription/create",
  PASSWORD_RESET: '/password/reset/:token',
  FORGOT_PASSWORD: '/password/forgot'
};

/**
 * App API routes
 * @constant
 */
export const API_ROUTES = {
  GET_USER: "user",
  HOME: "",
  LOGIN: "auth/login",
  PRESCRIPTION: "prescription",
  REGISTER: "auth/register",
  FILL_PRESCRIPTION: "prescription/fill",
  VERIFY_PHONE: "auth/verify",
  PASSWORD_RESET_SEND: "auth/password/send",
  PASSWORD_RESET: "auth/password/reset",
  EMAIL_AVAILABLE: "auth/check",
  GET_PATIENT: "user/check",
 
};

/**
 * Represents information to be displayed to user
 * @constant
 */
export const MESSAGES = {
  FAILED_EMAIL_CHECK:
    "Error trying to verify email availability. Please try again",
  GENERIC_ERROR: "We did something wrong. Please try again",
  LOGOUT: "You will be logged out of the application, continue?",
  BAD_LOGIN: "Invalid credentials",
  INVALID_NAME: "No such patient on our platform",
  NULL_NAME: "Cannot proceed without patient name",
  EXPIRED_TOKEN: "Session expired, login again",
  GENERIC_SUCCESS: "Successfully done",
};

/**
 * The application name
 * @constant
 */
export const APP_NAME = "Prescryber";

/**
 * Nav bar text
 */
export const NAV_TEXT = {
  HOME: "/",
  LOGIN: "Login",
  REGISTER: "Register",
  LOGOUT: "Log out",
  CREATE_PRESCRIPTION: "Prescribe"
};

/**
 * Our current node environment
 * @constant
 */
export const { NODE_ENV } = process.env;

/**
 * Possible node environments
 */
export const NODE_ENVIRONS = {
  DEVELOPMENT: "development"
};

export const BASE_URLS = {
  DEVELOPMENT: "localhost:8000/api/v1",
  PRODUCTION: ""
};

/**
 * App base url
 * @constant
 */
export const BASE_URL =
  NODE_ENV === NODE_ENVIRONS.DEVELOPMENT
    ? BASE_URLS.DEVELOPMENT
    : BASE_URLS.PRODUCTION;

/**
 * API hosts for development and production
 * @constant
 */
export const API_HOSTS = {
  DEVELOPMENT: "http://localhost:8000/api/v1",
  PRODUCTION: "https://address/api/v1"
};

/**
 * The keys for extracting items from localstorage
 * @constant
 */
export const STORAGE_KEYS = {
  TOKEN: "token",
  NAME: "name",
  ACCOUNT_TYPE: "accountType",
  PHONE: "phone",
  EMAIL: "email"
};

/**
 * Placeholder for twilio verification code
 * @constant
 */
export const DEFAULT_VERIFICATION_CODE = "123456";

/**
 * Form input types
 * @constant
 */
export const INPUT_TYPES = {
  TEXT: "text",
  PASSWORD: "password",
  PHONE: "tel",
  NUMBER: "number",
  EMAIL: "email"
};

/**
 * Icons
 * @constant
 */
export const ICONS = {
  EYE: "mdi-eye",
  EYE_OFF: "mdi-eye-off",
  PHONE: "mdi-phone",
  ACCOUNT: "mdi-account",
  QUANTITY: "mdi-numeric",
  DRUG: "mdi-pill",
  ADVICE: "mdi-volume-high",
  CYCLE: "mdi-lock-reset",
  CALENDAR: "mdi-calendar-range",
  EMAIL: "mdi-at"
};

/**
 * Regex patterns
 */
export const PATTERNS = {
  EMAIL: /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
};
