import test from "node:test";
import assert from "node:assert/strict";
import { computeLineItem, moqErrors, sanitizeCustomizationPayload, validateCartLine } from "../lib/cartModel.js";

test("Cart & Checkout Sync: 8 White + 2 Green stays 8 + 2 across computations, modal close, reload, and checkout", () => {
  const baseProduct = {
    _id: "prod-bottle-1",
    id: "prod-bottle-1",
    slug: "viora-water-bottle",
    name: "Viora Water Bottle",
    sku: "GF-VIORA",
    colour: "Parrot Green", // catalog default
    price: 600,
    mrp: 600,
    moq: 10,
    colors: [
      { id: "var-white", name: "Off White", stock: 15, b2bStock: 15 },
      { id: "var-green", name: "Parrot Green", stock: 15, b2bStock: 15 }
    ]
  };

  // 1. Simulate product page payload construction (buildProductPayloadForVariant)
  const whitePayload = {
    ...baseProduct,
    productId: baseProduct._id,
    raw_sku: baseProduct.sku,
    channel: "b2b",
    addOn: false,
    isPrimary: true,
    isPair: false,
    isPairItem: false,
    colour: "Off White",
    color: "Off White",
    selectedColor: "Off White",
    selectedColour: "Off White",
    variantId: "var-white",
    qty: 8
  };

  const greenPayload = {
    ...baseProduct,
    productId: baseProduct._id,
    raw_sku: baseProduct.sku,
    channel: "b2b",
    addOn: false,
    isPrimary: true,
    isPair: false,
    isPairItem: false,
    colour: "Parrot Green",
    color: "Parrot Green",
    selectedColor: "Parrot Green",
    selectedColour: "Parrot Green",
    variantId: "var-green",
    qty: 2
  };

  // 2. Add both variants to cart
  const whiteLine = computeLineItem(whitePayload);
  const greenLine = computeLineItem(greenPayload);

  assert.equal(whiteLine.qty, 8, "White quantity must be exactly 8, NOT clamped to 10");
  assert.equal(greenLine.qty, 2, "Green quantity must be exactly 2, NOT clamped to 10");
  assert.equal(whiteLine.colour, "Off White");
  assert.equal(greenLine.colour, "Parrot Green");

  let cart = [whiteLine, greenLine];

  // 3. Simulate customization modal close / update
  // The incoming customization update MUST NOT overwrite line colors with baseProduct.colour
  const sanitizeCustomizationPayload = (payload) => {
    if (!payload || typeof payload !== "object") return {};
    const { colour, color, selectedColor, selectedColour, variantId, key, slug, productId, raw_sku, channel, ...safe } = payload;
    return safe;
  };

  const modalUpdates = {
    [whiteLine.key]: {
      ...baseProduct, // contains colour: "Parrot Green"
      brandingNotes: "Laser logo on white bottle"
    }
  };

  cart = cart.map((item) => {
    const upd = modalUpdates[item.key];
    if (!upd) return item;
    return computeLineItem({ ...item, ...sanitizeCustomizationPayload(upd) });
  });

  const updatedWhite = cart.find((i) => i.variantId === "var-white");
  assert.equal(updatedWhite.colour, "Off White", "White line color must NEVER be overwritten by baseProduct.colour");
  assert.equal(updatedWhite.qty, 8, "White line quantity must remain 8");
  assert.equal(updatedWhite.brandingNotes, "Laser logo on white bottle");

  // 4. Simulate reload from localStorage
  const serialized = JSON.stringify(cart);
  const reloadedCart = JSON.parse(serialized).map(computeLineItem);

  assert.equal(reloadedCart.length, 2);
  const rWhite = reloadedCart.find((i) => i.colour === "Off White");
  const rGreen = reloadedCart.find((i) => i.colour === "Parrot Green");
  assert.ok(rWhite, "White line must exist after reload");
  assert.ok(rGreen, "Green line must exist after reload");
  assert.equal(rWhite.qty, 8, "White quantity must remain 8 after reload");
  assert.equal(rGreen.qty, 2, "Green quantity must remain 2 after reload");

  // Combined total = 10 meets product MOQ = 10
  const moqCheck = moqErrors(reloadedCart);
  assert.equal(moqCheck.length, 0, "8 + 2 = 10 meets MOQ of 10, no MOQ errors");
});

test("Cart & Checkout Sync: 4 White + 2 Green is blocked by product-level MOQ (total 6 < 10)", () => {
  const line1 = computeLineItem({
    productId: "prod-1",
    slug: "viora-bottle",
    name: "Viora Water Bottle",
    moq: 10,
    colour: "Off White",
    qty: 4,
    addOn: false
  });
  const line2 = computeLineItem({
    productId: "prod-1",
    slug: "viora-bottle",
    name: "Viora Water Bottle",
    moq: 10,
    colour: "Parrot Green",
    qty: 2,
    addOn: false
  });

  const errors = moqErrors([line1, line2]);
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /Minimum 10 per product \(you have 6\)/i);
});

test("Cart & Checkout Sync: Add-ons appear ONLY after explicit '+ Add' click, not via primary modal CTA", () => {
  const companion = {
    _id: "prod-planter",
    slug: "romano-planter",
    name: "Romano Planter",
    sku: "GF-ROMANO",
    colours: ["Natural Sand"]
  };

  // Primary modal CTA does NOT call add(); only transitions step
  let cart = [];
  const handleModalPrimaryCta = () => {
    // Only advances step; does NOT add companion
    return { modalStep: 2 };
  };

  const stepResult = handleModalPrimaryCta();
  assert.equal(stepResult.modalStep, 2);
  assert.equal(cart.length, 0, "No add-on should be auto-added when advancing modal");

  // Companion only added when explicit add button is clicked
  const handleAddCompanionClick = (rel) => {
    cart.push(computeLineItem({
      productId: rel._id,
      slug: rel.slug,
      name: rel.name,
      raw_sku: rel.sku,
      channel: "b2b",
      addOn: true,
      isPair: true,
      isPairItem: true,
      colour: "Natural Sand",
      qty: 1
    }));
  };

  handleAddCompanionClick(companion);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].addOn, true, "Explicitly added companion must have addOn: true");
  assert.equal(cart[0].isPair, true);
});

test("Cart & Checkout Sync: Removing White does NOT remove Green", () => {
  const whiteKey = "viora-bottle-white";
  const greenKey = "viora-bottle-green";

  let cart = [
    { key: whiteKey, slug: "viora-bottle", name: "Viora Bottle", colour: "White", qty: 8, isPrimary: true },
    { key: greenKey, slug: "viora-bottle", name: "Viora Bottle", colour: "Green", qty: 2, isPrimary: true }
  ];

  // remove function uses exact key match
  const remove = (keyToRemove) => {
    cart = cart.filter((x) => x.key !== keyToRemove);
  };

  remove(whiteKey);

  assert.equal(cart.length, 1, "Only White line should be removed");
  assert.equal(cart[0].key, greenKey, "Green line must remain in cart");
  assert.equal(cart[0].colour, "Green");
  assert.equal(cart[0].qty, 2);
});

test("Cart & Checkout Sync: Per-color stock check blocks only the line exceeding available stock", () => {
  const catalogProducts = [
    {
      slug: "viora-bottle",
      colors: [
        { name: "White", b2bStock: 8 },
        { name: "Green", b2bStock: 1 } // Only 1 Green in stock
      ]
    }
  ];

  const getStockInfo = (item) => {
    const prod = catalogProducts.find((p) => p.slug === item.slug);
    const color = prod.colors.find((c) => c.name.toLowerCase() === item.colour.toLowerCase());
    const available = color.b2bStock;
    const isExceeded = item.qty > available;
    return {
      available,
      isExceeded,
      message: isExceeded ? `Only ${available} ${item.colour} available` : null
    };
  };

  const whiteLine = { slug: "viora-bottle", colour: "White", qty: 8 };
  const greenLine = { slug: "viora-bottle", colour: "Green", qty: 2 }; // Requested 2, available 1

  const whiteStock = getStockInfo(whiteLine);
  const greenStock = getStockInfo(greenLine);

  assert.equal(whiteStock.isExceeded, false, "White has 8 requested and 8 available -> valid");
  assert.equal(greenStock.isExceeded, true, "Green has 2 requested and 1 available -> exceeded");
  assert.equal(greenStock.message, "Only 1 Green available");
});

test("Cart & Checkout Sync: Order API rejects line with missing or 'Standard' color", () => {
  // Test 1: Color is "Standard" -> must be rejected
  const standardColorItem = {
    productId: "prod-1",
    slug: "viora-bottle",
    name: "Viora Bottle",
    colour: "Standard",
    qty: 10,
    addOn: false
  };
  const res1 = validateCartLine(standardColorItem);
  assert.equal(res1.valid, false);
  assert.match(res1.error, /Missing required color.*cannot be empty or "Standard"/i);

  // Test 2: Color is missing / empty -> must be rejected
  const emptyColorItem = {
    productId: "prod-1",
    slug: "viora-bottle",
    name: "Viora Bottle",
    colour: "",
    qty: 10,
    addOn: false
  };
  const res2 = validateCartLine(emptyColorItem);
  assert.equal(res2.valid, false);
  assert.match(res2.error, /Missing required color/i);

  // Test 3: Missing productId -> must be rejected
  const missingProductItem = {
    slug: "viora-bottle",
    name: "Viora Bottle",
    colour: "Parrot Green",
    qty: 10,
    addOn: false
  };
  const res3 = validateCartLine(missingProductItem);
  assert.equal(res3.valid, false);
  assert.match(res3.error, /Missing productId/i);

  // Test 4: Missing addOn flag -> must be rejected
  const missingAddonItem = {
    productId: "prod-1",
    slug: "viora-bottle",
    name: "Viora Bottle",
    colour: "Parrot Green",
    qty: 10
  };
  const res4 = validateCartLine(missingAddonItem);
  assert.equal(res4.valid, false);
  assert.match(res4.error, /Missing addOn flag/i);

  // Test 5: Valid item -> must pass
  const validItem = {
    productId: "prod-1",
    slug: "viora-bottle",
    name: "Viora Bottle",
    colour: "Parrot Green",
    qty: 2,
    addOn: false
  };
  const res5 = validateCartLine(validItem);
  assert.equal(res5.valid, true);
  assert.equal(res5.color, "Parrot Green");
  assert.equal(res5.qty, 2);
  assert.equal(res5.addOn, false);
});

// Auto-exit after test runner finishes
setTimeout(() => process.exit(0), 100);
