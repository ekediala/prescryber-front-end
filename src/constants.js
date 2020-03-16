/**
 * Valid account types object
 * @constant
 */
export const ACCOUNT_TYPES = {
  PRESCRIBER: "prescriber",
  PATIENT: "patient"
};

/**
 * App base url
 * @constant
 */
export const BASE_URL = "localhost:8000/api/v1";

/**
 * App UI routes
 * @constant
 */
export const UI_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PRESCRIPTION: "/prescription"
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
  NUMBER_AVAILABLE: "auth/check"
};

/**
 * Represents information to be displayed to user
 * @constant
 */
export const MESSAGES = {
  FAILED_PHONE_CHECK:
    "Error trying to verify phone number availability. Please try again",
  GENERIC_ERROR: "We did something wrong.",
  LOGOUT: 'You will be logged out of the application, continue?'
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
  LOGOUT: "Log out"
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

/**
 * API hosts for development and production
 * @constant
 */
export const API_HOSTS = {
  DEVELOPMENT: "http://localhost:8000/api/v1",
  PRODUCTION: 'https://address/api/v1'
};

/**
 * The key for extracting token from localstorage
 * @constant
 */
export const TOKEN_STORAGE_KEY = 'token';

/**
 * Placeholder for twilio verification code
 * @constant
 */
export const DEFAULT_VERIFICATION_CODE = '123456';
