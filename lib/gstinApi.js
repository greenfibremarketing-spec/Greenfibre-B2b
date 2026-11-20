/**
 * Server-only GSTIN verification library for Green Fibre B2B
 * Integrates with https://www.gstinapi.in
 *
 * NOTE: The API key and upstream credentials must NEVER reach the client.
 */

import { validateGstin, GST_STATE_MAP } from "./gstQuote.js";

// In-memory cache: 24h per GSTIN.
// Note: For multi-instance/serverless deployments, Redis or Upstash is recommended.
const gstinCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Normalizes raw GSTIN input.
 * Strips whitespace, hyphens, and converts to uppercase.
 *
 * @param {string} raw
 * @returns {string}
 */
export function normalizeGstin(raw) {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "");
}

/**
 * Verifies a GSTIN via local format validation and gstinapi.in live lookup.
 *
 * @param {string} rawGstin
 * @param {Object} [options]
 * @param {boolean} [options.bypassCache=false]
 * @returns {Promise<{
 *   ok: boolean,
 *   code?: string,
 *   message?: string,
 *   soft?: boolean,
 *   data?: {
 *     gstin: string,
 *     pan: string,
 *     legalName: string,
 *     tradeName: string,
 *     status: string,
 *     isActive: boolean,
 *     constitution: string,
 *     registrationDate: string,
 *     stateCode: string,
 *     stateName: string,
 *     address: {
 *       line: string,
 *       city: string,
 *       state: string,
 *       pincode: string
 *     }
 *   }
 * }>}
 */
export async function verifyGstin(rawGstin, options = {}) {
  const clean = normalizeGstin(rawGstin);
  if (!clean) {
    return {
      ok: false,
      code: "INVALID_FORMAT",
      message: "GSTIN is required"
    };
  }

  const allowTestNumber =
    process.env.GSTIN_ALLOW_TEST_NUMBER === "true" &&
    process.env.NODE_ENV !== "production";
  const isTestNumber = clean === "00AAAAA0000A1ZT";

  // Check in-memory cache first (unless bypassed)
  if (!options.bypassCache) {
    const cached = gstinCache.get(clean);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }
  }

  // 1. Local pre-check BEFORE calling the API, to save credits
  // EXCEPTION: if GSTIN_ALLOW_TEST_NUMBER === "true" and clean === "00AAAAA0000A1ZT", skip local pre-check.
  let localValidation = null;
  if (isTestNumber && allowTestNumber) {
    // Permitted sandbox exception
    localValidation = {
      valid: true,
      gstin: clean,
      stateCode: "00",
      stateName: "Test Sandbox State",
      pan: "AAAAA0000A"
    };
  } else {
    localValidation = validateGstin(clean);
    if (!localValidation.valid) {
      return {
        ok: false,
        code: "INVALID_FORMAT",
        message: localValidation.error || "Invalid GSTIN format"
      };
    }
  }

  // 2. Upstream API configuration
  const apiKey = process.env.GSTIN_API_KEY || "";
  const baseUrl = (process.env.GSTIN_API_BASE_URL || "https://www.gstinapi.in").replace(/\/+$/, "");

  if (!apiKey) {
    // API key not configured: soft failure (checkout must NOT break)
    return {
      ok: false,
      soft: true,
      code: "BAD_KEY",
      message: "GST live verification key not configured"
    };
  }

  // 3. Perform Live Verification Call
  const endpoint = `${baseUrl}/v1/gstin/${encodeURIComponent(clean)}?include=profile`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Accept": "application/json"
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000) // 10s timeout
    });

    const status = response.status;
    let json = null;
    try {
      json = await response.json();
    } catch {
      json = null;
    }

    // 4. Handle HTTP & Business Status Codes
    if (status === 401 || status === 403) {
      return {
        ok: false,
        soft: true,
        code: "BAD_KEY",
        message: "GST live verification authentication failed"
      };
    }

    if (status === 402 || (json && typeof json.error === "string" && /credits?/i.test(json.error))) {
      return {
        ok: false,
        soft: true,
        code: "NO_CREDITS",
        message: "GST verification credits currently exhausted"
      };
    }

    if (status === 429) {
      return {
        ok: false,
        soft: true,
        code: "RATE_LIMITED",
        message: "GST verification rate limit exceeded"
      };
    }

    if (status >= 500) {
      return {
        ok: false,
        soft: true,
        code: "UPSTREAM",
        message: "GST upstream verification service temporarily unavailable"
      };
    }

    if (status === 404 || status === 400 || (json && json.success === false)) {
      const errMsg = (json && typeof json.error === "string") ? json.error : "";
      if (/not found/i.test(errMsg) || status === 404) {
        const notFoundResult = {
          ok: false,
          code: "NOT_FOUND",
          message: "GSTIN not found in official GST records"
        };
        // Cache not-found for 1 hour to prevent re-querying dead numbers
        gstinCache.set(clean, { result: notFoundResult, expiresAt: Date.now() + 60 * 60 * 1000 });
        return notFoundResult;
      }
      return {
        ok: false,
        code: "NOT_FOUND",
        message: errMsg || "Invalid or unregistered GSTIN"
      };
    }

    // 5. Parse Successful 200 Response
    if (status === 200 && json) {
      const rec = json.data || json;
      const rawStatus = rec.status || "Active";
      const isActive = String(rawStatus).trim().toLowerCase() === "active";
      const pan = isTestNumber ? "AAAAA0000A" : clean.slice(2, 12);
      const stateCode = isTestNumber ? "00" : (rec.state_code || clean.slice(0, 2));
      const stateName = isTestNumber
        ? "Test Sandbox State"
        : (GST_STATE_MAP[stateCode] || rec.address_details?.state || "Unknown State");

      const addrDetails = rec.address_details || {};
      const streetLine = [
        addrDetails.building_number,
        addrDetails.building_name,
        addrDetails.floor,
        addrDetails.street,
        addrDetails.locality
      ]
        .filter(Boolean)
        .join(", ");

      const line = rec.address || streetLine || "";
      const city =
        addrDetails.city ||
        addrDetails.district ||
        (rec.city ? String(rec.city).split(",")[0].trim() : "") ||
        "";
      const state = addrDetails.state || stateName || "";
      const pincode = rec.pincode || addrDetails.pincode || "";

      const mapped = {
        ok: true,
        data: {
          gstin: clean,
          pan,
          legalName: rec.legal_name || rec.trade_name || "",
          tradeName: rec.trade_name || rec.legal_name || "",
          status: rawStatus,
          isActive,
          constitution: rec.business_constitution || rec.taxpayer_type || "",
          registrationDate: rec.registration_date || "",
          stateCode,
          stateName,
          address: {
            line,
            city,
            state,
            pincode
          }
        }
      };

      // Cache successful response for 24 hours
      gstinCache.set(clean, { result: mapped, expiresAt: Date.now() + CACHE_TTL_MS });
      return mapped;
    }

    // Fallback for unhandled response
    return {
      ok: false,
      soft: true,
      code: "UPSTREAM",
      message: "Unexpected response from GST verification service"
    };
  } catch (fetchErr) {
    return {
      ok: false,
      soft: true,
      code: "UPSTREAM",
      message: "GST verification request timed out or network error"
    };
  }
}
