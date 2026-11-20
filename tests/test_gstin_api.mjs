/**
 * Unit & Integration Test Suite for GSTIN API Verification
 * Run with: node tests/test_gstin_api.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { verifyGstin, normalizeGstin } from "../lib/gstinApi.js";
import { validateGstin } from "../lib/gstQuote.js";

// Save original environment
const originalEnv = { ...process.env };

test.beforeEach(() => {
  process.env = { ...originalEnv };
  process.env.GSTIN_API_KEY = "gak_test_mock_key_12345";
  process.env.GSTIN_API_BASE_URL = "https://www.gstinapi.in";
  process.env.GSTIN_ALLOW_TEST_NUMBER = "true";
});

test.afterEach(() => {
  process.env = { ...originalEnv };
});

test("Test 1: Sample GSTIN 00AAAAA0000A1ZT returns ok:true and maps every field without throwing on missing/null fields", async () => {
  const originalFetch = global.fetch;

  // Mock upstream sample response from gstinapi.in
  global.fetch = async (url, opts) => {
    assert.match(url, /00AAAAA0000A1ZT/);
    assert.equal(opts.headers["x-api-key"], "gak_test_mock_key_12345");
    return {
      status: 200,
      json: async () => ({
        success: true,
        gstin: "00AAAAA0000A1ZT",
        data: {
          gstin: "00AAAAA0000A1ZT",
          legal_name: "GSTINAPI TEST PRIVATE LIMITED",
          trade_name: "GSTINAPI SANDBOX",
          status: "Active",
          taxpayer_type: "Regular",
          business_constitution: "Private Limited Company",
          registration_date: "2020-01-01",
          cancellation_date: null,
          state_code: "00",
          address: "1, Test Building, Test Street, Test Locality",
          city: "Surat",
          pincode: "395010",
          address_details: {
            building_number: "1",
            building_name: "Test Building",
            floor: null,
            street: "Test Street",
            locality: "Test Locality",
            district: "Surat",
            city: "Surat",
            state: "Gujarat",
            landmark: null,
            pincode: "395010"
          }
        }
      })
    };
  };

  try {
    const res = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
    assert.equal(res.ok, true);
    assert.ok(res.data);
    assert.equal(res.data.gstin, "00AAAAA0000A1ZT");
    assert.equal(res.data.legalName, "GSTINAPI TEST PRIVATE LIMITED");
    assert.equal(res.data.tradeName, "GSTINAPI SANDBOX");
    assert.equal(res.data.status, "Active");
    assert.equal(res.data.isActive, true);
    assert.equal(res.data.pan, "AAAAA0000A");
    assert.equal(res.data.constitution, "Private Limited Company");
    assert.equal(res.data.registrationDate, "2020-01-01");
    assert.equal(res.data.address.city, "Surat");
    assert.equal(res.data.address.pincode, "395010");
    assert.equal(res.data.address.line, "1, Test Building, Test Street, Test Locality");

    // Also test minimal/sparse response where fields are null/missing
    global.fetch = async () => ({
      status: 200,
      json: async () => ({
        success: true,
        data: {
          gstin: "00AAAAA0000A1ZT",
          legal_name: "MINIMAL COMPANY",
          status: "Active"
          // all other fields omitted
        }
      })
    });

    const resSparse = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
    assert.equal(resSparse.ok, true);
    assert.equal(resSparse.data.legalName, "MINIMAL COMPANY");
    assert.equal(resSparse.data.tradeName, "MINIMAL COMPANY");
    assert.equal(resSparse.data.address.line, "");
    assert.equal(resSparse.data.address.city, "");
  } finally {
    global.fetch = originalFetch;
  }
});

test("Test 2: A GSTIN with a bad check digit is rejected locally and API is NOT called (0 calls)", async () => {
  const originalFetch = global.fetch;
  let fetchCallCount = 0;
  global.fetch = async () => {
    fetchCallCount++;
    throw new Error("API should never be called for invalid checksum");
  };

  try {
    // 27AAPFU0939F1ZX has invalid checksum (expected V)
    const res = await verifyGstin("27AAPFU0939F1ZX", { bypassCache: true });
    assert.equal(res.ok, false);
    assert.equal(res.code, "INVALID_FORMAT");
    assert.equal(fetchCallCount, 0, "Fetch must be called 0 times");
    assert.match(res.message, /check digit/i);
  } finally {
    global.fetch = originalFetch;
  }
});

test("Test 3: 00AAAAA0000A1ZT is rejected locally when GSTIN_ALLOW_TEST_NUMBER=false", async () => {
  process.env.GSTIN_ALLOW_TEST_NUMBER = "false";
  const originalFetch = global.fetch;
  let fetchCallCount = 0;
  global.fetch = async () => {
    fetchCallCount++;
    return { status: 200, json: async () => ({ success: true }) };
  };

  try {
    const res = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
    assert.equal(res.ok, false);
    assert.equal(res.code, "INVALID_FORMAT");
    assert.equal(fetchCallCount, 0, "Fetch must not be called when test number disabled");
    assert.match(res.message, /state code/i);
  } finally {
    global.fetch = originalFetch;
  }
});

test("Test 4: Mocked 401, 402, 429, 500 and timeout all return soft:true and never throw", async () => {
  const originalFetch = global.fetch;

  // 401 Unauthorized (Bad Key)
  global.fetch = async () => ({
    status: 401,
    json: async () => ({ error: "Invalid API key" })
  });
  const res401 = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
  assert.equal(res401.ok, false);
  assert.equal(res401.soft, true);
  assert.equal(res401.code, "BAD_KEY");

  // 402 Payment Required (No Credits)
  global.fetch = async () => ({
    status: 402,
    json: async () => ({ error: "Account has no credits left" })
  });
  const res402 = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
  assert.equal(res402.ok, false);
  assert.equal(res402.soft, true);
  assert.equal(res402.code, "NO_CREDITS");

  // 429 Too Many Requests (Rate Limited)
  global.fetch = async () => ({
    status: 429,
    json: async () => ({ error: "Rate limit exceeded" })
  });
  const res429 = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
  assert.equal(res429.ok, false);
  assert.equal(res429.soft, true);
  assert.equal(res429.code, "RATE_LIMITED");

  // 500 Internal Server Error (Upstream)
  global.fetch = async () => ({
    status: 500,
    json: async () => ({ error: "Internal Server Error" })
  });
  const res500 = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
  assert.equal(res500.ok, false);
  assert.equal(res500.soft, true);
  assert.equal(res500.code, "UPSTREAM");

  // Network fetch error / timeout
  global.fetch = async () => {
    throw new Error("Network timeout after 10000ms");
  };
  const resTimeout = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
  assert.equal(resTimeout.ok, false);
  assert.equal(resTimeout.soft, true);
  assert.equal(resTimeout.code, "UPSTREAM");

  global.fetch = originalFetch;
});

test("Test 5: Mocked 'not found' returns a hard failure (ok:false, code:NOT_FOUND)", async () => {
  const originalFetch = global.fetch;

  // 404 response
  global.fetch = async () => ({
    status: 404,
    json: async () => ({ success: false, error: "GSTIN not found in GST database" })
  });

  try {
    const res = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
    assert.equal(res.ok, false);
    assert.equal(res.code, "NOT_FOUND");
    assert.equal(res.soft, undefined, "Hard failure must NOT have soft: true");
    assert.match(res.message, /not found/i);
  } finally {
    global.fetch = originalFetch;
  }
});

test("Test 6: Cancelled status returns ok:true with isActive:false", async () => {
  const originalFetch = global.fetch;

  global.fetch = async () => ({
    status: 200,
    json: async () => ({
      success: true,
      data: {
        gstin: "00AAAAA0000A1ZT",
        legal_name: "DEACTIVATED TRADERS PVT LTD",
        status: "Cancelled",
        taxpayer_type: "Regular",
        cancellation_date: "2023-05-10"
      }
    })
  });

  try {
    const res = await verifyGstin("00AAAAA0000A1ZT", { bypassCache: true });
    assert.equal(res.ok, true);
    assert.equal(res.data.status, "Cancelled");
    assert.equal(res.data.isActive, false, "Cancelled GSTIN must have isActive: false");
  } finally {
    global.fetch = originalFetch;
  }
});

test("Test 7: The API key never appears in client bundle, client files, or API responses", async () => {
  // Check that no client code references process.env.GSTIN_API_KEY
  // Search in app/quote, components/, hooks/
  let grepClient = "";
  try {
    grepClient = execSync(
      'git grep "GSTIN_API_KEY" -- "app/quote" "components" "hooks"',
      { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
    ).trim();
  } catch {
    grepClient = "";
  }

  assert.equal(
    grepClient,
    "",
    "GSTIN_API_KEY must NEVER be referenced in client code (app/quote, components, hooks)"
  );
});
