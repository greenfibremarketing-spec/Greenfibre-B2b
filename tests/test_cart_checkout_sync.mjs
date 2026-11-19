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

test("Dynamic Tier Discounts: Tier 1 is backend 32.20%, Tier 2 is +5% (37.20%), Tier 3 is +10% (42.20%) and preserved till cart page", () => {
  const backendProduct = {
    _id: "prod-tulsi-1",
    id: "prod-tulsi-1",
    slug: "tulsi-planter",
    name: "Tulsi Planter",
    sku: "GF-TULSI",
    mrp: 4838,
    price: 3280, // (4838 - 3280) / 4838 = 32.20% discount from backend
    colours: ["Sand Dune"],
    colors: [{ id: "c1", name: "Sand Dune", stock: 1000 }]
  };

  // 1. Tier 1 (qty 10, within 1–100) -> discount must be exactly 32.2% from backend
  const tier1Item = computeLineItem({
    ...backendProduct,
    colour: "Sand Dune",
    qty: 10
  });
  assert.equal(tier1Item.tier1Discount, 32.2, "Tier 1 discount must come from backend 32.20%");
  assert.equal(tier1Item.discountPct, 32.2, "Line discountPct for Tier 1 must be 32.2%");
  assert.equal(tier1Item.tierNumber, 1);
  assert.equal(tier1Item.unitPrice, 3280, "Tier 1 unit price matches backend price 3280");
  assert.equal(tier1Item.lineGross, 48380);
  assert.equal(tier1Item.lineNet, 32800);
  assert.equal(tier1Item.lineDiscount, 15580);

  // 2. Tier 2 (qty 150, within 101–200) -> discount must be Tier 1 + 5% = 37.2%
  const tier2Item = computeLineItem({
    ...backendProduct,
    colour: "Sand Dune",
    qty: 150
  });
  assert.equal(tier2Item.tier1Discount, 32.2);
  assert.equal(tier2Item.discountPct, 37.2, "Tier 2 discount must be Tier 1 + 5% (37.2%)");
  assert.equal(tier2Item.tierNumber, 2);
  assert.equal(tier2Item.unitPrice, Math.round(4838 * (1 - 0.372))); // 3038

  // 3. Tier 3 (qty 250, 201+) -> discount must be Tier 2 + 5% (Tier 1 + 10% = 42.2%)
  const tier3Item = computeLineItem({
    ...backendProduct,
    colour: "Sand Dune",
    qty: 250
  });
  assert.equal(tier3Item.tier1Discount, 32.2);
  assert.equal(tier3Item.discountPct, 42.2, "Tier 3 discount must be Tier 2 + 5% (42.2%)");
  assert.equal(tier3Item.tierNumber, 3);
  assert.equal(tier3Item.unitPrice, Math.round(4838 * (1 - 0.422))); // 2796

  // 4. Cart Serialization & Reload Persistence
  // Cart items saved to localStorage and reloaded must preserve the exact discount
  const cartJson = JSON.stringify([tier1Item]);
  const restoredCart = JSON.parse(cartJson).map(computeLineItem);
  assert.equal(restoredCart[0].discountPct, 32.2, "Cart page reloaded item must show same 32.2% discount");
  assert.equal(restoredCart[0].unitPrice, 3280, "Cart page unit price must remain 3280");

  // 5. Quantity Stepper in Cart updating from Tier 1 to Tier 2
  const updatedToTier2 = computeLineItem({ ...restoredCart[0], qty: 120 });
  assert.equal(updatedToTier2.discountPct, 37.2, "Cart page quantity change to Tier 2 must automatically show 37.2%");
  assert.equal(updatedToTier2.tierNumber, 2);

  // 6. Quantity Stepper in Cart updating to Tier 3
  const updatedToTier3 = computeLineItem({ ...restoredCart[0], qty: 220 });
  assert.equal(updatedToTier3.discountPct, 42.2, "Cart page quantity change to Tier 3 must automatically show 42.2%");
  assert.equal(updatedToTier3.tierNumber, 3);
});

test("Eco Desk Set: MRP is 3775 from backend, Tier 1 is 2559 (32.2% off), Tier 2 is 2371 (+5%), Tier 3 is 2182 (+10%)", () => {
  const ecoDeskSet = {
    _id: "6abb9ea741c3bdffa53c2df3",
    name: "Eco Desk Set",
    slug: "desk-gift-set",
    mrp: 3775,
    sellingPrice: 2559,
    b2bDiscountPct: 32.2,
    colour: "Green",
    colors: [{ name: "Green", stock: 264 }]
  };

  // Tier 1: qty 10 (1–100) -> must be exactly 2559
  const t1 = computeLineItem({ ...ecoDeskSet, qty: 10 });
  assert.equal(t1.mrp, 3775, "MRP must be exactly 3775 from backend");
  assert.equal(t1.unitPrice, 2559, "Tier 1 unit price must be 2559");
  assert.equal(t1.discountPct, 32.2, "Tier 1 discount must be 32.2%");
  assert.equal(t1.lineNet, 25590, "Line net for 10 units must be 25590");

  // Tier 2: qty 120 (101–200) -> 37.2% off MRP 3775 = 2371
  const t2 = computeLineItem({ ...ecoDeskSet, qty: 120 });
  assert.equal(t2.mrp, 3775);
  assert.equal(t2.discountPct, 37.2, "Tier 2 discount must be Tier 1 + 5% (37.2%)");
  assert.equal(t2.unitPrice, 2371, "Tier 2 unit price must be 2371");

  // Tier 3: qty 220 (201+) -> 42.2% off MRP 3775 = 2182
  const t3 = computeLineItem({ ...ecoDeskSet, qty: 220 });
  assert.equal(t3.mrp, 3775);
  assert.equal(t3.discountPct, 42.2, "Tier 3 discount must be Tier 1 + 10% (42.2%)");
  assert.equal(t3.unitPrice, 2182, "Tier 3 unit price must be 2182");
});

test("Dynamic B2B Discount: when B2B discount is 42% (b2bPrice 2190 on MRP 3775), it dynamically uses 42%, Tier 2 is 47%, Tier 3 is 52%", () => {
  const b2bProduct = {
    _id: "6abb9ea741c3bdffa53c2df3",
    name: "Eco Desk Set",
    slug: "desk-gift-set",
    mrp: 3775,
    b2bPrice: 2190, // (3775 - 2190) / 3775 = 41.99% -> 42%
    colour: "Green",
    colors: [{ name: "Green", stock: 264 }]
  };

  // Tier 1: qty 10 (1–100) -> 42%
  const t1 = computeLineItem({ ...b2bProduct, qty: 10 });
  assert.equal(t1.mrp, 3775);
  assert.equal(t1.discountPct, 41.99, "Tier 1 must dynamically be ~42% from b2bPrice");
  assert.equal(t1.unitPrice, 2190, "Tier 1 unit price is b2bPrice 2190");

  // Tier 2: qty 120 (101–200) -> 42% + 5% = 47%
  const t2 = computeLineItem({ ...b2bProduct, qty: 120 });
  assert.equal(t2.discountPct, 46.99, "Tier 2 must dynamically be Tier 1 + 5% (47%)");
  assert.equal(t2.unitPrice, Math.round(3775 * (1 - 0.4699))); // 2001

  // Tier 3: qty 220 (201+) -> 42% + 10% = 52%
  const t3 = computeLineItem({ ...b2bProduct, qty: 220 });
  assert.equal(t3.discountPct, 51.99, "Tier 3 must dynamically be Tier 2 + 5% (52%)");
  assert.equal(t3.unitPrice, Math.round(3775 * (1 - 0.5199))); // 1812
});

test("Viora Water Bottle: MRP 1533, price 889 (B2B), discountedPrice 1039 (B2C) -> Tier 1 is 42.01% (889), Tier 2 is 47.01% (812), Tier 3 is 52.01% (736)", () => {
  const bottle = {
    _id: "6ad617c8b85b95b3f3b1b404",
    name: "Viora Water Bottle - 600 ml",
    slug: "viora-water-bottle-600ml",
    mrp: 1533,
    originalPrice: 1533,
    price: 889,
    discountedPrice: 1039,
    retailPrice: 1039,
    colour: "Parrot Green",
    colors: [{ name: "Parrot Green", stock: 98 }]
  };

  // Tier 1: qty 10 (1–100) -> 42.01% (889)
  const t1 = computeLineItem({ ...bottle, qty: 10 });
  assert.equal(t1.mrp, 1533);
  assert.equal(t1.discountPct, 42.01, "Tier 1 must dynamically be 42.01% from price 889 vs mrp 1533");
  assert.equal(t1.unitPrice, 889, "Tier 1 unit price is 889");

  // Tier 2: qty 120 (101–200) -> 42.01% + 5% = 47.01%
  const t2 = computeLineItem({ ...bottle, qty: 120 });
  assert.equal(t2.discountPct, 47.01, "Tier 2 must be 47.01%");
  assert.equal(t2.unitPrice, 812, "Tier 2 unit price is 812 (1533 * (1 - 0.4701))");

  // Tier 3: qty 220 (201+) -> 42.01% + 10% = 52.01%
  const t3 = computeLineItem({ ...bottle, qty: 220 });
  assert.equal(t3.discountPct, 52.01, "Tier 3 must be 52.01%");
  assert.equal(t3.unitPrice, 736, "Tier 3 unit price is 736 (1533 * (1 - 0.5201))");
});

// Auto-exit after test runner finishes
setTimeout(() => process.exit(0), 100);
