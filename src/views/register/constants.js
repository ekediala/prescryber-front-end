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
  PHONE: "07030000000",
  EMAIL: 'john@doe.com'
};

/**
 * Labels for form registration
 * @constant
 */
export const LABELS = {
  PASSWORD: "Password",
  NAME: "Name",
  PHONE: "Phone",
  ACCOUNT_TYPE: "Mark if you are a doctor",
  EMAIL: 'Email'
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
  PHONE: "use format: 07030000000",
  EMAIL: "use format: john@doe.com"
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
  PRESCRIPTION_REQUIRED: 'Name of prescription is required',
  QUANTITY_REQUIRED: 'Qty to be taken is required',
  QUANTITY_NOT_ZERO: 'Qty to be taken cannot be less than zero',
  EMAIL_REQUIRED: 'Email field is required',
  INVALID_EMAIL: 'Invalid email'
};

/**
 * Success messages
 * @constant
 */
export const SUCCESS_MESSAGES = {
  VALID_EMAIL: "Email available"
};
