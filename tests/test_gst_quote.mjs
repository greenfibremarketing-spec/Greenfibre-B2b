import test from "node:test";
import assert from "node:assert/strict";
import { validateGstin, computeQuoteTax, SUPPLIER_STATE_CODE } from "../lib/gstQuote.js";

test("GSTIN 27AAPFU0939F1ZV is valid, Maharashtra (27), PAN AAPFU0939F", () => {
  const res = validateGstin("27AAPFU0939F1ZV");
  assert.equal(res.valid, true);
  assert.equal(res.error, null);
  assert.equal(res.stateCode, "27");
  assert.equal(res.stateName, "Maharashtra");
  assert.equal(res.pan, "AAPFU0939F");
});

test("GSTIN 27AAPFU0939F1ZX is invalid with Check digit doesn't match", () => {
  const res = validateGstin("27AAPFU0939F1ZX");
  assert.equal(res.valid, false);
  assert.match(res.error, /Check digit doesn't match/i);
});

test("14-character input => GSTIN must be 15 characters (14/15)", () => {
  const res = validateGstin("27AAPFU0939F1Z");
  assert.equal(res.valid, false);
  assert.equal(res.error, "GSTIN must be 15 characters (14/15)");
});

test("Valid GSTIN starting 29 (same state as supplier) => CGST 9% + SGST 9% rows", () => {
  const res = validateGstin("29AAPFU0939F1ZR");
  assert.equal(res.valid, true);
  assert.equal(res.stateCode, "29");
  assert.equal(res.stateName, "Karnataka");

  const tax = computeQuoteTax({
    taxable: 5470,
    buyerType: "gst",
    gstinValidation: res,
    supplierStateCode: "29"
  });

  assert.equal(tax.taxType, "cgst_sgst");
  assert.equal(tax.isGstValid, true);
  assert.equal(tax.taxSplit.type, "cgst_sgst");
  assert.equal(tax.taxSplit.cgst + tax.taxSplit.sgst, 984.6);
  assert.equal(tax.totalWithGst, 6455);
});

test("10 x Pet Bowl @ 547 => taxable 5470, GST 984.60 (shown 985), total 6455 in every mode", () => {
  const taxable = 5470;

  // Mode 1: Non-GST
  const taxNonGst = computeQuoteTax({ taxable, buyerType: "non_gst" });
  assert.equal(taxNonGst.taxable, 5470);
  assert.equal(taxNonGst.gstAmount, 985);
  assert.equal(taxNonGst.gstAmountExact, 984.6);
  assert.equal(taxNonGst.totalWithGst, 6455);
  assert.equal(taxNonGst.taxType, "standard");
  assert.equal(taxNonGst.itcAmount, 0);

  // Mode 2: GST Inter-State (27 != 29)
  const gstinInter = validateGstin("27AAPFU0939F1ZV");
  const taxInter = computeQuoteTax({ taxable, buyerType: "gst", gstinValidation: gstinInter });
  assert.equal(taxInter.taxable, 5470);
  assert.equal(taxInter.gstAmount, 985);
  assert.equal(taxInter.gstAmountExact, 984.6);
  assert.equal(taxInter.totalWithGst, 6455);
  assert.equal(taxInter.taxType, "igst");
  assert.equal(taxInter.taxSplit.igst, 985);
  assert.equal(taxInter.itcAmount, 985);

  // Mode 3: GST Intra-State (29 == 29)
  const gstinIntra = validateGstin("29AAPFU0939F1ZR");
  const taxIntra = computeQuoteTax({ taxable, buyerType: "gst", gstinValidation: gstinIntra });
  assert.equal(taxIntra.taxable, 5470);
  assert.equal(taxIntra.gstAmount, 985);
  assert.equal(taxIntra.gstAmountExact, 984.6);
  assert.equal(taxIntra.totalWithGst, 6455);
  assert.equal(taxIntra.taxType, "cgst_sgst");
  assert.equal(taxIntra.itcAmount, 985);
});

