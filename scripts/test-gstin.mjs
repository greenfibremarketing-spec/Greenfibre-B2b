/**
 * scripts/test-gstin.mjs
 * Calls https://www.gstinapi.in to discover real response and error shapes.
 */

const baseUrl = process.env.GSTIN_API_BASE_URL || "https://www.gstinapi.in";
const apiKey = process.env.GSTIN_API_KEY || "";

console.log("==================================================");
console.log("  GSTIN API ENDPOINT DISCOVERY & SHAPE TEST");
console.log("==================================================");
console.log(`Base URL: ${baseUrl}`);
console.log(`API Key configured: ${apiKey ? "YES (" + apiKey.slice(0, 4) + "..." + apiKey.slice(-4) + ")" : "NO (empty/not yet pasted)"}`);

async function testCall(label, gstin, key) {
  console.log(`\n--------------------------------------------------`);
  console.log(`TEST: ${label}`);
  const url = `${baseUrl}/v1/gstin/${encodeURIComponent(gstin)}?include=profile`;
  console.log(`Request: GET ${url}`);
  console.log(`Header:  x-api-key: ${key ? (key.length > 8 ? key.slice(0, 4) + "***" : "***") : "(none)"}`);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": key,
        "Accept": "application/json"
      }
    });

    console.log(`Response Status: HTTP ${res.status} ${res.statusText}`);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log("Raw JSON Body:\n" + JSON.stringify(json, null, 2));
      return { status: res.status, json };
    } catch {
      console.log("Raw Body (non-JSON):\n" + text);
      return { status: res.status, text };
    }
  } catch (err) {
    console.error("Fetch Exception:", err.message);
    return { error: err.message };
  }
}

async function run() {
  // Test 1: Test number with configured key (or mock key if user hasn't pasted yet)
  await testCall("Sample GSTIN (00AAAAA0000A1ZT) with configured key", "00AAAAA0000A1ZT", apiKey);

  // Test 2: Sample GSTIN with wrong/invalid key
  await testCall("Sample GSTIN with wrong key", "00AAAAA0000A1ZT", "wrong_invalid_key_gak_xyz12345");

  // Test 3: Malformed GSTIN
  await testCall("Malformed GSTIN with key", "INVALID_GSTIN_123", apiKey || "wrong_key");

  // Also print the OpenAPI schema definition discovered from https://www.gstinapi.in/openapi.json
  console.log("\n--------------------------------------------------");
  console.log("OFFICIAL gstinapi.in SCHEMA SPECIFICATION (/openapi.json):");
  try {
    const specRes = await fetch("https://www.gstinapi.in/openapi.json");
    if (specRes.ok) {
      const spec = await specRes.json();
      const sampleRecord = spec.components?.schemas?.GstinRecord?.properties;
      console.log("Record field keys:", Object.keys(sampleRecord || {}));
    }
  } catch (err) {
    console.log("Could not fetch openapi.json:", err.message);
  }
}

run();
