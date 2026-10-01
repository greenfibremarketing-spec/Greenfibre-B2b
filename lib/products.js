// Green Fibre B2B Product Catalog & Business Logic
// Directly Connected to Express B2B Backend API (http://localhost:5500) & MongoDB

export const categories = [
  "All Products",
  "Gifting",
  "Corporate",
  "Anniversary",
  "Birthday",
  "Institutional",
  "House Warming",
  "Wedding"
];

export const products = [];

const getApiBaseUrl = () => {
  if (process.env.B2B_API_URL) return process.env.B2B_API_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return "http://localhost:5500";
};

export function formatProduct(p) {
  if (!p) return null;

  const categoryName =
    typeof p.category === "object" && p.category !== null
      ? p.category.name || p.category.title || "Gifting"
      : typeof p.category === "string" && p.category
      ? p.category
      : "Gifting";

  const subCategoryName =
    typeof p.subCategory === "object" && p.subCategory !== null
      ? p.subCategory.name || p.subCategory.title || ""
      : typeof p.subCategory === "string"
      ? p.subCategory
      : "";

  function normalizeUrl(img) {
    if (!img) return "";
    if (typeof img === "object" && img !== null) {
      img = img.url || img.secure_url || img.src || img.path || "";
    }
    if (typeof img !== "string" || !img.trim()) return "";
    img = img.trim();
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) {
      return img;
    }
    return `http://localhost:5500/${img.replace(/^\/+/, "")}`;
  }

  const rawImagesList = [
    p.image,
    ...(Array.isArray(p.images) ? p.images : []),
    ...(Array.isArray(p.colors)
      ? p.colors.flatMap((c) => (Array.isArray(c.images) ? c.images : [c.image]))
      : []),
    ...(Array.isArray(p.giftBoxImages) ? p.giftBoxImages : []),
    ...(Array.isArray(p.giftPackaging?.images) ? p.giftPackaging.images : [])
  ]
    .filter(Boolean)
    .map(normalizeUrl)
    .filter(Boolean);

  const primaryImage = rawImagesList[0] || (typeof p.image === "string" ? normalizeUrl(p.image) : "") || "";

  const normalizedColors = (p.colors || []).map((c) => {
    if (typeof c === "string") return { name: c, colorHex: "#E5DAC8", images: [] };
    const rawImgs = c.images || (c.image ? [c.image] : []);
    const imgList = Array.isArray(rawImgs)
      ? rawImgs.map(normalizeUrl).filter(Boolean)
      : typeof rawImgs === "string"
      ? [normalizeUrl(rawImgs)].filter(Boolean)
      : [];

    const hexVal =
      c.colorHex ||
      c.hex ||
      (c.name?.toLowerCase().includes("sage") || c.name?.toLowerCase().includes("green")
        ? "#5CB85C"
        : c.name?.toLowerCase().includes("charcoal")
        ? "#2F4F4F"
        : c.name?.toLowerCase().includes("orange")
        ? "#F28C28"
        : c.name?.toLowerCase().includes("brown") || c.name?.toLowerCase().includes("coffee")
        ? "#6F4E37"
        : "#E5DAC8");

    return {
      ...c,
      name: c.name || "Natural Sand",
      colorHex: hexVal,
      images: imgList.length > 0 ? imgList : (primaryImage ? [primaryImage] : [])
    };
  });

  const coloursList =
    Array.isArray(p.colours) && p.colours.length > 0
      ? p.colours
      : normalizedColors.length > 0
      ? normalizedColors.map((c) => c.name)
      : ["Natural Sand", "Sage Green"];

  const allImages =
    rawImagesList.length > 0
      ? Array.from(new Set(rawImagesList))
      : primaryImage
      ? [primaryImage]
      : [];

  const rawTiersList = Array.isArray(p.tiers) && p.tiers.length > 0
    ? p.tiers
    : Array.isArray(p.b2bPricing?.tiers) && p.b2bPricing.tiers.length > 0
    ? p.b2bPricing.tiers
    : [];

  const originalPrice =
    typeof p.price === "number" && p.price > 0
      ? p.price
      : typeof rawTiersList[0]?.price === "number" && rawTiersList[0].price > 0
      ? rawTiersList[0].price
      : typeof p.b2bPricing?.basePrice === "number"
      ? p.b2bPricing.basePrice
      : (p.retailPrice || 0);

  const baseMoq =
    typeof p.moq === "number" && p.moq > 0
      ? p.moq
      : typeof rawTiersList[0]?.min === "number"
      ? rawTiersList[0].min
      : p.b2bConfig?.moq || p.b2bPricing?.moq || 25;

  const normalizedTiers = rawTiersList.map((t, idx) => ({
    min: typeof t.min === "number" ? t.min : typeof t.minQty === "number" ? t.minQty : (idx === 0 ? baseMoq : 100),
    price: typeof t.price === "number" ? t.price : typeof t.unitPrice === "number" ? t.unitPrice : originalPrice,
    tierLabel: t.tierLabel || `Tier ${idx + 1}`,
    popular: Boolean(t.popular),
    leadTime: t.leadTime || p.leadTime || "5–7 business days",
    badge: t.badge || (t.discountPercentage ? `-${t.discountPercentage}%` : ""),
    discountPercentage: t.discountPercentage || 0,
    benefits: Array.isArray(t.benefits) ? t.benefits : []
  }));

  const t1Min = normalizedTiers[0]?.min || baseMoq || 25;
  const t1Price = normalizedTiers[0]?.price || originalPrice;
  const t2Min = normalizedTiers[1]?.min || (t1Min <= 25 ? 100 : Math.max(100, t1Min * 4));
  const t2Price = normalizedTiers[1]?.price || (t1Price > 0 ? Math.round(t1Price * 0.90) : 0);
  const t3Min = normalizedTiers[2]?.min || (t2Min <= 250 ? 500 : t2Min * 4);
  const t3Price = normalizedTiers[2]?.price || (t1Price > 0 ? Math.round(t1Price * 0.80) : 0);

  const fullTiers = normalizedTiers.length >= 3 ? normalizedTiers : [
    { min: t1Min, price: t1Price, tierLabel: normalizedTiers[0]?.tierLabel || "MOQ Starter", popular: false, leadTime: normalizedTiers[0]?.leadTime || p.leadTime || "5–7 Days" },
    { min: t2Min, price: t2Price, tierLabel: normalizedTiers[1]?.tierLabel || "Volume Partner", popular: true, leadTime: normalizedTiers[1]?.leadTime || p.leadTime || "4–6 Days" },
    { min: t3Min, price: t3Price, tierLabel: normalizedTiers[2]?.tierLabel || "Enterprise Bulk", popular: false, leadTime: normalizedTiers[2]?.leadTime || p.leadTime || "3–5 Days" }
  ];

  const generatedSlug = p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : (p._id ? p._id.toString() : "product"));

  return {
    ...p,
    id: (p._id || p.id || generatedSlug).toString(),
    _id: (p._id || p.id || generatedSlug).toString(),
    slug: generatedSlug,
    sku: p.sku || "GF-B2B",
    name: p.name || "Green Fibre Product",
    category: categoryName,
    subCategory: subCategoryName,
    unit: p.unit || "piece",
    tagline: p.tagline || p.shortDescription || "Certified sustainable upcycled rice-husk homeware for enterprises.",
    shortDescription: p.shortDescription || p.tagline || "",
    desc: p.desc || p.description || p.tagline || "",
    image: primaryImage,
    images: allImages,
    moq: t1Min,
    price: originalPrice,
    retailPrice: p.retailPrice || p.originalPrice || (originalPrice > 0 ? Math.round(originalPrice * 1.3) : 0),
    originalPrice: p.originalPrice || p.retailPrice || (originalPrice > 0 ? Math.round(originalPrice * 1.3) : 0),
    tiers: fullTiers,
    leadTime: p.leadTime || "5–7 business days",
    branding: typeof p.branding === "boolean" ? p.branding : true,
    brandingTypes: p.brandingTypes || ["Laser Engraving on Lid", "Custom Belly Band", "Custom Branded Gift Box"],
    colours: coloursList,
    colors: normalizedColors,
    size: p.size || "",
    material: p.material || "Agricultural Rice Husk & Bamboo Fibre Biocomposite",
    specs: p.specs || {},
    package: p.package || {},
    productFeatures: Array.isArray(p.productFeatures) ? p.productFeatures : [],
    sustainability: p.sustainability || {},
    careInstructions: p.careInstructions || "",
    dimensions: p.dimensions || {},
    productWeight: p.productWeight || {},
    popular: Boolean(p.popular || p.isFeatured),
    totalStock: p.totalStock ?? p.stockQuantity ?? 500,
    stockQuantity: p.stockQuantity ?? p.totalStock ?? 500,
    tags: Array.isArray(p.tags) ? p.tags : [],
    occasions: Array.isArray(p.occasions) ? p.occasions : ["Corporate", "Gifting", "Anniversary", "Birthday", "Wedding", "House Warming", "Institutional"],
    collection: p.collection || "",
    tax: p.tax || { hsnCode: "392410", gstRate: 18, isTaxInclusive: true },
    customizationOptions: Array.isArray(p.customizationOptions) ? p.customizationOptions : [],
    b2bConfig: p.b2bConfig || null,
    activeContext: p.activeContext || { key: "default", label: "Standard B2B", isCustomContext: false },
    availableContexts: Array.isArray(p.availableContexts) ? p.availableContexts : []
  };
}

export function normalizeContextKey(key) {
  if (!key || typeof key !== "string") return "corporate";
  const lower = key.toLowerCase().trim();
  if (lower === "anniversary" || lower.includes("anniv")) return "anniversary";
  if (lower === "wedding" || lower.includes("wed")) return "wedding";
  if (
    lower === "festive" ||
    lower.includes("festiv") ||
    lower.includes("birth") ||
    lower.includes("house") ||
    lower.includes("diwali")
  ) {
    return "festive";
  }
  if (
    lower === "employee-onboarding" ||
    lower === "onboarding" ||
    lower.includes("onboard") ||
    lower.includes("employ") ||
    lower.includes("inst")
  ) {
    return "employee-onboarding";
  }
  return "corporate";
}

export async function getProducts(context = null) {
  const baseUrl = getApiBaseUrl();
  const contextParam = context ? `?context=${encodeURIComponent(context)}` : "";

  // 1. Direct fetch from Express B2B Backend API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl}/api/b2b/products${contextParam}`, {
      signal: controller.signal,
      cache: "no-store"
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawProducts = Array.isArray(data) ? data : data.products || data.data || [];
      if (rawProducts && rawProducts.length > 0) {
        return rawProducts.map(formatProduct).filter(Boolean);
      }
    }
  } catch (err) {
    console.warn(`[B2B Products] Express API fetch (${baseUrl}/api/b2b/products) notice:`, err.message);
  }

  // 2. Direct MongoDB Connection Fallback
  try {
    const { mainDb } = await import("./db");
    const database = await mainDb();
    if (database) {
      const collectionNames = ["b2b_products", "products", "Product", "Products", "items"];
      for (const colName of collectionNames) {
        try {
          const col = database.collection(colName);
          const count = await col.countDocuments({});
          if (count > 0) {
            const items = await col.find({}).toArray();
            if (items && items.length > 0) {
              return items.map(formatProduct).filter(Boolean);
            }
          }
        } catch {}
      }
    }
  } catch (dbErr) {}

  return [];
}

export async function getProduct(slug, context = null) {
  if (!slug) return null;
  const baseUrl = getApiBaseUrl();
  const contextParam = context ? `?context=${encodeURIComponent(context)}` : "";
  const cleanSlug = String(slug).toLowerCase().trim();

  // 1. Direct fetch single product from Express B2B Backend API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl}/api/b2b/products/${encodeURIComponent(cleanSlug)}${contextParam}`, {
      signal: controller.signal,
      cache: "no-store"
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const raw = data.product || data;
      if (raw && (raw.name || raw.slug || raw._id)) {
        return formatProduct(raw);
      }
    }
  } catch (err) {
    console.warn(`[B2B Products] Single product fetch (${cleanSlug}) notice:`, err.message);
  }

  // 2. Fetch from products list
  const all = await getProducts(context);
  const found = all.find((p) => {
    if (!p) return false;
    const pSlug = (p.slug || "").toLowerCase().trim();
    const pId = (p.id || p._id || "").toString().toLowerCase().trim();
    const pName = (p.name || "").toLowerCase().trim();
    return pSlug === cleanSlug || pId === cleanSlug || pName === cleanSlug;
  });

  if (found) return found;

  // 3. Direct MongoDB query fallback
  try {
    const { mainDb } = await import("./db");
    const database = await mainDb();
    if (database) {
      const collectionNames = ["b2b_products", "products", "Product", "Products"];
      for (const colName of collectionNames) {
        try {
          const col = database.collection(colName);
          let raw = await col.findOne({ slug: cleanSlug });
          if (!raw) raw = await col.findOne({ slug });
          if (!raw) raw = await col.findOne({ name: { $regex: cleanSlug, $options: "i" } });
          if (raw) {
            return formatProduct(raw);
          }
        } catch {}
      }
    }
  } catch {}

  return null;
}
