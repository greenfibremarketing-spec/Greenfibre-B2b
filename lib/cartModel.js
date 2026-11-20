// ── Pricing constants & Dynamic Volume Tier Rules ────────────────────────────
// Tier 1: 1–100 units   -> wholesale discount dynamically from backend B2B (e.g. 42% or as configured)
// Tier 2: 101–200 units -> Tier 1 discount + 5%
// Tier 3: 201+ units    -> Tier 2 discount + 5% (Tier 1 discount + 10%)
// Bundle bonus (5%) applied on overall net subtotal when 2+ distinct products are in basket.
export const BUNDLE_BONUS_PCT = 5;
// Legacy Diwali constant (preserved for backwards-compatibility imports)
export const DIWALI_SPECIAL_EXTRA_PCT = 5;

export function getProductTier1Discount(p) {
  if (!p) return 0;

  // 1. Explicit B2B wholesale discount fields if already set or provided
  if (typeof p.b2bDiscountPct === "number" && p.b2bDiscountPct > 0) {
    return p.b2bDiscountPct;
  }
  if (typeof p.b2bDiscount === "number" && p.b2bDiscount > 0) {
    return p.b2bDiscount;
  }
  if (typeof p.tier1Discount === "number" && p.tier1Discount > 0) {
    return p.tier1Discount;
  }

  // 2. Computed dynamically from backend MRP vs B2B Wholesale Price (b2bPrice) first
  const mrp = Number(p.mrp || p.originalPrice || p.retailMrp || 0);
  const b2bWholesalePrice = Number(
    p.b2bPrice ||
    p.b2b_price ||
    (p.price > 0 && mrp > p.price ? p.price : 0) ||
    (p.wholesalePrice > 0 && mrp > p.wholesalePrice ? p.wholesalePrice : 0) ||
    0
  );

  if (mrp > 0 && b2bWholesalePrice > 0 && mrp > b2bWholesalePrice) {
    const rawPct = ((mrp - b2bWholesalePrice) / mrp) * 100;
    return Math.round(rawPct * 100) / 100;
  }

  // 3. Fallback to sellingPrice or discountedPrice if b2bPrice is not defined
  const generalDiscountedPrice = Number(
    p.sellingPrice ||
    p.b2cPrice ||
    p.discountedPrice ||
    (p.retailPrice && mrp > p.retailPrice ? p.retailPrice : 0) ||
    0
  );

  if (mrp > 0 && generalDiscountedPrice > 0 && mrp > generalDiscountedPrice) {
    const rawPct = ((mrp - generalDiscountedPrice) / mrp) * 100;
    return Math.round(rawPct * 100) / 100;
  }

  if (typeof p.discountPct === "number" && p.discountPct > 0) {
    return p.discountPct;
  }
  if (typeof p.discountPercentage === "number" && p.discountPercentage > 0) {
    return p.discountPercentage;
  }
  if (typeof p.discount === "number" && p.discount > 0) {
    return p.discount;
  }

  // 4. Pricing tier or savings percent fallback
  if (Array.isArray(p.tiers) && typeof p.tiers[0]?.discountPercentage === "number" && p.tiers[0].discountPercentage > 0) {
    return p.tiers[0].discountPercentage;
  }
  if (typeof p.pricingAtMoq?.savingsPercent === "number" && p.pricingAtMoq.savingsPercent > 0) {
    return p.pricingAtMoq.savingsPercent;
  }

  return 0;
}

export function getItemDiscountPct(qty, isPrimary = true, tier1Discount = 0) {
  if (!isPrimary) return 0;
  const q = Number(qty) || 1;
  const d1 = Number(tier1Discount) || 0;
  const d2 = Math.round((d1 + 5) * 100) / 100;
  const d3 = Math.round((d1 + 10) * 100) / 100;

  if (q >= 201) return d3; // Tier 3: Tier 1 + 10% (i.e. Tier 2 + 5%)
  if (q >= 101) return d2; // Tier 2: Tier 1 + 5%
  return d1;              // Tier 1: from backend
}

export function getItemTierNumber(qty) {
  const q = Number(qty) || 1;
  if (q >= 201) return 3;
  if (q >= 101) return 2;
  return 1;
}

export function getItemTierLabel(qty, isPrimary = true, tier1Discount = 0) {
  const q = Number(qty) || 1;
  const d1 = Number(tier1Discount) || 0;
  const d2 = Math.round((d1 + 5) * 100) / 100;
  const d3 = Math.round((d1 + 10) * 100) / 100;

  if (q >= 201) return `Tier 3 (201+ units • ${d3}% Off)`;
  if (q >= 101) return `Tier 2 (101–200 units • ${d2}% Off)`;
  return `Tier 1 (1–100 units • ${d1}% Off)`;
}

// ── Centralized Pure Function to Compute a Line Item ───────────────────────────
export function computeLineItem(item) {
  if (!item || typeof item !== "object") {
    return {
      key: "item-" + Math.random().toString(36).slice(2),
      name: "Product",
      qty: 1,
      mrp: 0,
      unitPrice: 0,
      price: 0,
      lineGross: 0,
      lineNet: 0,
      lineDiscount: 0,
      discountPct: 0,
      tierNumber: 1,
      isPrimary: true
    };
  }
  const isPair = Boolean(item.isPairItem === true || item.isPair === true || item.addOn === true);
  const isPrimary = !isPair;
  // Exact chosen quantity (minimum 1 per color line; MOQ enforced across product total via moqErrors)
  const minQty = 1;
  const qty = Math.max(minQty, Math.floor(Number(item.qty) || minQty));
  const basePrice = Number(
    item.mrp || item.originalPrice || item.retailMrp || item.wholesalePrice || item.originalBasePrice || 0
  );
  const retailMrp = basePrice;

  // Dynamic volume tier discount: Tier 1 from backend, Tier 2 = +5%, Tier 3 = +10%
  const tier1Discount = getProductTier1Discount(item);
  const discountPct = isPrimary ? getItemDiscountPct(qty, isPrimary, tier1Discount) : 0;
  const tierNumber = getItemTierNumber(qty);
  const tierLabel = getItemTierLabel(qty, isPrimary, tier1Discount);

  const directB2BPrice = Number(
    item.b2bPrice ||
    item.b2b_price ||
    (tier1Discount > 0 && basePrice > 0 ? Math.round(basePrice * (1 - tier1Discount / 100)) : 0) ||
    (item.price > 0 && basePrice > item.price ? item.price : 0) ||
    item.sellingPrice ||
    item.discountedPrice ||
    0
  );
  const unitPrice =
    tierNumber === 1 && directB2BPrice > 0
      ? directB2BPrice
      : Math.round(basePrice * (1 - discountPct / 100));

  const lineGross = basePrice * qty;
  const lineNet = unitPrice * qty;
  const lineDiscount = lineGross - lineNet;

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
    tier1Discount,
    discountPct,
    diwaliDiscountPct: 0,
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
// Website Rule: At least ONE product must meet the 10-unit minimum.
// Once met, all other products can be ordered in any quantity (1+).
export function moqErrors(lineItems = []) {
  if (!Array.isArray(lineItems) || lineItems.length === 0) return [];

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

  const prods = Object.values(productTotals);
  if (prods.length === 0) return [];

  // Check if at least one product has >= 10 units
  const hasQualifiedProduct = prods.some((p) => p.totalQty >= p.requiredMoq);
  if (hasQualifiedProduct) {
    return []; // Minimum met! Additional products can be 1, 2, etc.
  }

  // If no product has met the minimum, report the shortfall for the primary product
  const p = prods[0];
  return [
    {
      slug: p.slug,
      name: p.name,
      totalQty: p.totalQty,
      requiredMoq: p.requiredMoq,
      message: `Minimum ${p.requiredMoq} per product (you have ${p.totalQty})`,
    },
  ];
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
