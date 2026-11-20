/**
 * Pure GST & Quotation Tax Logic for Green Fibre B2B
 * Contains no UI dependencies so it can be tested directly in Node.js.
 */

export const SUPPLIER_STATE_CODE = "29"; // Karnataka (default config constant)
export const SUPPLIER_GSTIN = process.env.NEXT_PUBLIC_SUPPLIER_GSTIN || "29AAPFU0939F1ZR";

export const GST_STATE_MAP = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "25": "Daman & Diu",
  "26": "Dadra & Nagar Haveli",
  "27": "Maharashtra",
  "28": "Andhra Pradesh (Old)",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
  "97": "Other Territory"
};

const GST_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Validates a GSTIN string according to Indian GST specifications:
 * a) Length must be exactly 15 characters
 * b) Regex: ^(\d{2})([A-Z]{5}\d{4}[A-Z])([1-9A-Z])Z([0-9A-Z])$
 * c) State code (first 2 digits) between 01 and 38
 * d) Mod-36 checksum verification on 15th character
 *
 * @param {string} raw - Raw GSTIN input
 * @returns {{ valid: boolean, error: string | null, gstin: string, stateCode?: string, stateName?: string, pan?: string }}
 */
export function validateGstin(raw) {
  const gstin = String(raw || "").trim().toUpperCase().replace(/\s+/g, "");

  if (!gstin) {
    return { valid: false, error: "GSTIN is required", gstin: "" };
  }

  // a) Length is 15
  if (gstin.length !== 15) {
    return {
      valid: false,
      error: `GSTIN must be 15 characters (${gstin.length}/15)`,
      gstin
    };
  }

  // b) Standard GSTIN regex pattern
  const regex = /^(\d{2})([A-Z]{5}\d{4}[A-Z])([1-9A-Z])Z([0-9A-Z])$/;
  const match = gstin.match(regex);
  if (!match) {
    return {
      valid: false,
      error: "Invalid GSTIN format (e.g. 27AAPFU0939F1ZV)",
      gstin
    };
  }

  // c) State code between 01 and 38
  const stateCode = match[1];
  const stateNum = parseInt(stateCode, 10);
  if (stateNum < 1 || stateNum > 38 || !GST_STATE_MAP[stateCode]) {
    return {
      valid: false,
      error: `Invalid state code: ${stateCode} (must be between 01 and 38)`,
      gstin,
      stateCode
    };
  }

  // d) Check digit algorithm (15th character)
  let sum = 0;
  for (let i = 0; i <= 13; i++) {
    const charIndex = GST_CHARS.indexOf(gstin[i]);
    if (charIndex === -1) {
      return { valid: false, error: `Invalid character '${gstin[i]}' in GSTIN`, gstin };
    }
    const factor = (i % 2 === 0) ? 1 : 2;
    const p = charIndex * factor;
    sum += Math.floor(p / 36) + (p % 36);
  }
  const rem = sum % 36;
  const checkCodePoint = (36 - rem) % 36;
  const expectedCheckChar = GST_CHARS[checkCodePoint];

  if (expectedCheckChar !== gstin[14]) {
    return {
      valid: false,
      error: "Check digit doesn't match",
      gstin,
      stateCode
    };
  }

  const pan = gstin.slice(2, 12);
  const stateName = GST_STATE_MAP[stateCode] || "Unknown State";

  return {
    valid: true,
    error: null,
    gstin,
    stateCode,
    stateName,
    pan
  };
}

/**
 * Computes GST tax split and ITC amount based on taxable amount and buyer GST status.
 *
 * Rules:
 * - Grand total NEVER changes: total = round(taxable + GST).
 * - GST 18%: exact = round(taxable * 0.18, 2); rounded = round(taxable * 0.18).
 * - Same state (buyerState == supplierState): CGST 9% + SGST 9% (each half).
 * - Inter-state (buyerState != supplierState): IGST 18%.
 * - No GSTIN: single "GST 18% (ITC eligible)" row.
 *
 * @param {Object} params
 * @param {number} params.taxable - Net taxable subtotal
 * @param {"gst" | "non_gst"} [params.buyerType="non_gst"]
 * @param {Object} [params.gstinValidation] - Result of validateGstin()
 * @param {string} [params.supplierStateCode=SUPPLIER_STATE_CODE]
 * @returns {Object}
 */
export function computeQuoteTax({
  taxable = 0,
  buyerType = "non_gst",
  gstinValidation = null,
  supplierStateCode = SUPPLIER_STATE_CODE
}) {
  const safeTaxable = Math.max(0, Number(taxable) || 0);
  const gstRate = 0.18;
  const gstAmountExact = Math.round(safeTaxable * gstRate * 100) / 100;
  const gstAmount = Math.round(safeTaxable * gstRate);
  const totalWithGst = Math.round(safeTaxable + gstAmount);

  const isGstValid = buyerType === "gst" && Boolean(gstinValidation?.valid);

  let taxType = "standard"; // "cgst_sgst" | "igst" | "standard"
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isGstValid) {
    const isSameState = String(gstinValidation.stateCode) === String(supplierStateCode);
    if (isSameState) {
      taxType = "cgst_sgst";
      // Split evenly to two decimal places
      cgst = Math.round((gstAmountExact / 2) * 100) / 100;
      sgst = Math.round((gstAmountExact - cgst) * 100) / 100;
    } else {
      taxType = "igst";
      igst = gstAmount;
    }
  }

  const itcAmount = isGstValid ? gstAmount : 0;

  return {
    taxable: safeTaxable,
    gstRate,
    gstAmount,
    gstAmountExact,
    totalWithGst,
    isGstValid,
    taxType,
    taxSplit: {
      type: taxType,
      cgst,
      sgst,
      igst
    },
    itcAmount,
    buyerStateCode: isGstValid ? gstinValidation.stateCode : null,
    buyerStateName: isGstValid ? gstinValidation.stateName : null,
    supplierStateCode
  };
}

