import { ERROR_MESSAGES } from "../views/register/constants";
import { PATTERNS } from "../constants";
import moment from "moment";

const {
  NAME_REQUIRED,
  PASSWORD_LENGTH,
  PASSWORD_REQUIRED,
  PHONE_INVALID,
  PHONE_LENGTH,
  PHONE_REQUIRED,
  PRESCRIPTION_REQUIRED,
  QUANTITY_REQUIRED,
  QUANTITY_NOT_ZERO,
  EMAIL_REQUIRED,
  INVALID_EMAIL,
  DATE_REQUIRED,
  PAST_DATE
} = ERROR_MESSAGES;

const { EMAIL: EMAL_PATTERN } = PATTERNS;

/**
 * Validation rules object
 * @constant
 */
export const RULES = {
  NAME: [v => !!v || NAME_REQUIRED],
  PHONE: [
    v => !!v || PHONE_REQUIRED,
    v => v.length === 11 || PHONE_LENGTH,
    v => {
      const pattern = /^0\d{10}/;
      return pattern.test(v) || PHONE_INVALID;
    }
  ],
  PASSWORD: [
    v => !!v || PASSWORD_REQUIRED,
    v => v.length >= 6 || PASSWORD_LENGTH
  ],
  PRESCRIPTION: [v => !!v || PRESCRIPTION_REQUIRED],
  QUANTITY: [v => !!v || QUANTITY_REQUIRED, v => v > 0 || QUANTITY_NOT_ZERO],
  EMAIL: [
    v => !!v || EMAIL_REQUIRED,
    v => EMAL_PATTERN.test(v) || INVALID_EMAIL
  ],
  DATE: [
    v => !!v || DATE_REQUIRED,
    v => moment(v) > moment().subtract(1, "day") || PAST_DATE
    
  ]
};
