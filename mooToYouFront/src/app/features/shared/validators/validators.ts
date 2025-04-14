// shared/config/validation.constants.ts
export const VALIDATION = {
    PHONE: {
      PATTERN: /^[0-9]{11}$/,
      MESSAGE: 'Must be 11 numeric characters'
    },
    CNIC: {
      PATTERN: /^\d{5}-\d{7}-\d$/,
      MESSAGE: 'Format: 12345-6789012-3'
    },
    PASSWORD: {
      PATTERN: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
      MESSAGE: 'Must include uppercase, lowercase, number, and symbol',
      MIN_LENGTH: 6
    },
    EMAIL: {
      PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      MESSAGE: 'Invalid email format'
    }
  };