/**
 * Validation utilities for Email, Phone Number, and Form Fields
 */

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * Validates corporate/personal email format
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  
  if (trimmed.length < 5 || trimmed.length > 120) return false;
  if (!EMAIL_REGEX.test(trimmed)) return false;
  if (trimmed.includes("..") || trimmed.startsWith(".") || trimmed.endsWith(".")) return false;
  
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  
  const [local, domain] = parts;
  if (!local || !domain) return false;
  
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;
  
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) return false;

  return true;
}

/**
 * Extracts normalized 10-digit Indian mobile number
 * @param {string} phone
 * @returns {string|null} 10-digit string if valid, null otherwise
 */
export function getNormalizedIndianPhone(phone) {
  if (!phone || typeof phone !== "string") return null;
  
  // Extract all digits
  const digits = phone.replace(/\D/g, "");
  
  let mobile10 = null;
  if (digits.length === 10) {
    mobile10 = digits;
  } else if (digits.length === 11 && digits.startsWith("0")) {
    mobile10 = digits.slice(1);
  } else if (digits.length === 12 && digits.startsWith("91")) {
    mobile10 = digits.slice(2);
  } else if (digits.length === 13 && digits.startsWith("091")) {
    mobile10 = digits.slice(3);
  }
  
  if (!mobile10 || !INDIAN_PHONE_REGEX.test(mobile10)) {
    return null;
  }

  // Filter out obvious repeating dummy numbers (0000000000, 1111111111, 9999999999)
  if (/^(\d)\1{9}$/.test(mobile10)) {
    return null;
  }

  return mobile10;
}

/**
 * Validates Indian Phone number (+91 with 10 digits starting with 6-9)
 * @param {string} phone
 * @returns {boolean}
 */
export function validateIndianPhone(phone) {
  return getNormalizedIndianPhone(phone) !== null;
}

/**
 * Formats a phone input into standard +91 XXXXX XXXXX format
 * @param {string} phone
 * @returns {string}
 */
export function formatIndianPhone(phone) {
  const mobile10 = getNormalizedIndianPhone(phone);
  if (mobile10) {
    return `+91 ${mobile10.slice(0, 5)} ${mobile10.slice(5)}`;
  }
  return phone;
}

/**
 * Filters live typing input to allow only valid phone characters (+, digits, spaces, hyphens)
 * Blocks alphabets ("abcd") completely.
 * @param {string} value
 * @returns {string}
 */
export function filterPhoneInput(value) {
  if (!value) return "";
  // Keep only +, digits, spaces, and hyphens
  let filtered = value.replace(/[^0-9+\s-]/g, "");
  // Allow + only as the first character
  if (filtered.indexOf("+") > 0) {
    filtered = filtered[0] + filtered.slice(1).replace(/\+/g, "");
  }
  return filtered.slice(0, 18);
}

/**
 * Validates Indian 6-digit PIN code
 * @param {string} pin
 * @returns {boolean}
 */
export function validatePinCode(pin) {
  if (!pin || typeof pin !== "string") return false;
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}
