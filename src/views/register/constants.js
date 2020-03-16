/**
 * Name of component
 * @constant
 */
export const NAME = "Register";

/**
 * Placeholders for form registration
 * @constant
 */
export const PLACEHOLDERS = {
  PASSWORD: "******",
  NAME: "John Doe",
  PHONE: "07030000000"
};

/**
 * Labels for form registration
 * @constant
 */
export const LABELS = {
  PASSWORD: "Password",
  NAME: "Name",
  PHONE: "Phone",
  ACCOUNT_TYPE: "Mark if you are a doctor"
};

/**
 * Form submit button text
 * @constant
 */
export const SUBMIT_TEXT = 'Submit';

/**
 * Hints for registration form fiels
 * @constant
 */
export const HINTS = {
  PHONE: "use format: 07030000000"
};



/**
 * Failed validation messages
 * @constant
 */
export const ERROR_MESSAGES = {
  NAME_REQUIRED: "Name is required",
  PHONE_REQUIRED: "Phone number is required",
  PHONE_LENGTH: "Phone number is incomplete",
  PHONE_INVALID: "Invalid phone number format",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_LENGTH: "Password must be at least 6 characters long",
};

/**
 * Success messages
 * @constant
 */
export const SUCCESS_MESSAGES = {
  VALID_PHONE: "Phone number available"
};
