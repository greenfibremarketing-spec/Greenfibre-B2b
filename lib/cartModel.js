// ── Pricing constants & Dynamic Volume Tier Rules ────────────────────────────
// Tier 1: 1–100 units   -> 15% wholesale discount
// Tier 2: 101–200 units -> 20% volume discount
// Tier 3: 201+ units    -> 25% enterprise bulk discount
// Bundle bonus (5%) applied on overall net subtotal when 2+ distinct products are in basket.
export const BUNDLE_BONUS_PCT = 5;
// Diwali Special extra discount (5%) applied on all primary products.
export const DIWALI_SPECIAL_EXTRA_PCT = 5;

export function getItemDiscountPct(qty, isPrimary = true) {
  const q = Number(qty) || 1;
  let baseDiscount = 15;
  if (q >= 201 || q >= 200) baseDiscount = 25; // Tier 3: 200+ units -> 25% off
  else if (q >= 101) baseDiscount = 20;  // Tier 2: 101–200 units -> 20% off
  else baseDiscount = 15;                // Tier 1: 1–100 units -> 15% off

  // Diwali Special: 5% extra discount on all primary products
  if (isPrimary) {
    return baseDiscount + DIWALI_SPECIAL_EXTRA_PCT;
  }
  return baseDiscount;
}

export function getItemTierNumber(qty) {
  const q = Number(qty) || 1;
  if (q >= 201 || q >= 200) return 3;
  if (q >= 101) return 2;
  return 1;
}

export function getItemTierLabel(qty, isPrimary = true) {
  const q = Number(qty) || 1;
  const diwaliExtra = isPrimary ? ` + ${DIWALI_SPECIAL_EXTRA_PCT}% Diwali Special` : "";
  if (q >= 201 || q >= 200) return `Tier 3 (200+ units • 25%${diwaliExtra} = 30% Off)`;
  if (q >= 101) return `Tier 2 (101–200 units • 20%${diwaliExtra} = 25% Off)`;
  return `Tier 1 (1–100 units • 15%${diwaliExtra} = 20% Off)`;
}

// ── Centralized Pure Function to Compute a Line Item ───────────────────────────
export function computeLineItem(item) {
  const isPair = Boolean(item.isPairItem === true || item.isPair === true || item.addOn === true);
  const isPrimary = !isPair;
  // Exact chosen quantity (minimum 1 per color line; MOQ enforced across product total via moqErrors)
  const minQty = 1;
  const qty = Math.max(minQty, Math.floor(Number(item.qty) || minQty));
  const basePrice = Number(
    item.mrp || item.retailMrp || item.retailPrice || item.originalPrice || item.wholesalePrice || item.originalBasePrice || item.price || 0
  );
  const retailMrp = Number(item.retailMrp || item.mrp || item.retailPrice || item.originalPrice || basePrice);

  // Dynamic volume tier discount + 5% Extra Diwali Special on primary products
  const discountPct = getItemDiscountPct(qty, isPrimary);
  const tierNumber = getItemTierNumber(qty);
  const tierLabel = getItemTierLabel(qty, isPrimary);

  const lineGross = basePrice * qty;
  const lineDiscount = Math.round(lineGross * (discountPct / 100));
  const lineNet = lineGross - lineDiscount;
  const unitPrice = Math.round(basePrice * (1 - discountPct / 100));

  const resolvedColor = (item.colour || item.color || item.selectedColor || item.selectedColour || "").trim();

  return {
    ...item,
    qty,
    mrp: basePrice,
    retailMrp,
    wholesalePrice: basePrice,
    originalBasePrice: basePrice,
    retailPrice: retailMrp,
    price: unitPrice,
    unitPrice,
    discountPct,
    diwaliDiscountPct: isPrimary ? DIWALI_SPECIAL_EXTRA_PCT : 0,
    tierNumber,
    tierLabel,
    isPair,
    isPairItem: isPair,
    addOn: isPair,
    isPrimary,
    minQty: 1,
    lineGross,
    lineDiscount,
    lineNet,
    colour: resolvedColor,
    color: resolvedColor,
    selectedColor: resolvedColor,
    selectedColour: resolvedColor,
    productId: item.productId || item._id || item.id,
    variantId: item.variantId || null,
    raw_sku: item.raw_sku || item.sku || "GF-B2B",
    channel: "b2b",
  };
}

// ── Check Product-Level MOQ across all non-addon color lines ──────────────────
export function moqErrors(lineItems = []) {
  const productTotals = {};
  for (const it of lineItems) {
    const isAddon = Boolean(it.addOn === true || it.isPairItem === true || it.isPair === true);
    if (isAddon) continue;
    const prodKey = it.slug || it.productId || it.name;
    if (!productTotals[prodKey]) {
      const requiredMoq = Math.max(10, Number(it.moq) || 10);
      productTotals[prodKey] = {
        name: it.name,
        slug: it.slug,
        totalQty: 0,
        requiredMoq,
      };
    }
    productTotals[prodKey].totalQty += Number(it.qty) || 0;
  }

  const errors = [];
  for (const key of Object.keys(productTotals)) {
    const p = productTotals[key];
    if (p.totalQty < p.requiredMoq) {
      errors.push({
        slug: p.slug,
        name: p.name,
        totalQty: p.totalQty,
        requiredMoq: p.requiredMoq,
        message: `Minimum ${p.requiredMoq} per product (you have ${p.totalQty})`,
      });
    }
  }
  return errors;
}

// Strip colour/variant/identity fields so customizations never overwrite line identity
export function sanitizeCustomizationPayload(payload) {
  if (!payload || typeof payload !== "object") return {};
  const {
    colour,
    color,
    selectedColor,
    selectedColour,
    variantId,
    key,
    slug,
    productId,
    raw_sku,
    channel,
    ...safeFields
  } = payload;
  return safeFields;
}

// ── Line validation for checkout & order submission ───────────────────────────
export function validateCartLine(it) {
  const productId = String(it.productId || it.product || it._id || it.id || "").trim();
  if (!productId) {
    return { valid: false, error: `Missing productId on line item "${it.name || it.slug || 'unknown'}".` };
  }

  const rawColor = String(it.color || it.colour || it.colorName || "").trim();
  if (!rawColor || rawColor.toLowerCase() === "standard") {
    return { valid: false, error: `Missing required color on line item "${it.name || it.slug || 'unknown'}". Color cannot be empty or "Standard".` };
  }

  const qty = Math.floor(Number(it.qty || it.quantity || 0));
  if (!qty || qty < 1) {
    return { valid: false, error: `Invalid quantity on line item "${it.name || it.slug || 'unknown'}". Quantity must be at least 1.` };
  }

  if (typeof it.addOn === "undefined" && typeof it.isPairItem === "undefined" && typeof it.isPair === "undefined") {
    return { valid: false, error: `Missing addOn flag on line item "${it.name || it.slug || 'unknown'}".` };
  }

  return {
    valid: true,
    productId,
    color: rawColor,
    colour: rawColor,
    qty,
    addOn: Boolean(it.addOn === true || it.isPairItem === true || it.isPair === true)
  };
}
