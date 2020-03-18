/**
 * Headers of components for creating prescriptions
 * @constant
 */
export const COMPONENT_HEADERS = {
  CREATE: "Create prescription",
  EDIT: "Edit prescription"
};

/**
 * Headers of components for creating prescriptions
 * @constant
 */
export const COMPONENT_TYPES = {
  CREATE: "Create",
  EDIT: "Edit"
};

/**
 * Placeholders for form inputs specific to managing prescriptions
 * @constant
 */
export const PRESCRIPTION_PLACEHOLDERS = {
  PRESCRIPTION: "Ampiclox",
  QUANTITY: "0",
  FURTHER_ADVICE: "Any further advice"
};

/**
 * Labels for form inputs specific to managing prescriptions
 * @constant
 */
export const PRESCRIPTION_LABELS = {
  PRESCRIPTION: "Prescription",
  QUANTITY: "Quantity",
  UNITS: "Unit of measurement",
  END_DATE: "Expected end date of prescription",
  FURTHER_ADVICE: "Further advice",
  INTERVAL: "Daily Interval",
  EMAIL: 'Patient Email'
};

/**
 * Hints for form inputs specific to managing prescriptions
 * @constant
 */
export const PRESCRIPTION_HINTS = {
  PRESCRIPTION: "Name of drug",
  QUANTITY: "Quantity patient should take at intervals",
  FURTHER_ADVICE: "Any complications, things to avoid",
  UNIT: "ml, tabs, caps",
  INTERVAL: "No of times to be taken daily",
};

/**
 * Array of values for units dropdown
 * @constant
 */
export const UNIT_VALUES = ["ml", "capsules", "tablets"];

/**
 * Array of values for intervals dropdown
 * @constant
 */
export const INTERVAL_VALUES = [
  { text: "1", value: 1 },
  { text: "2", value: 2 },
  { text: "3", value: 3 },
  { text: "4", value: 4 }
];
