// Green Fibre B2B Product Catalog & Business Logic
// Connected to Express B2B Backend API

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
      ? p.category.name || p.category.title || "Gift Boxes & Hampers"
      : typeof p.category === "string" && p.category
      ? p.category
      : "Gift Boxes & Hampers";

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

  const primaryImage = rawImagesList[0] || p.image || "";

  const normalizedColors = (p.colors || []).map((c) => {
    if (typeof c === "string") return { name: c, images: [] };
    const rawImgs = c.images || (c.image ? [c.image] : []);
    const imgList = Array.isArray(rawImgs)
      ? rawImgs.map(normalizeUrl).filter(Boolean)
      : typeof rawImgs === "string"
      ? [normalizeUrl(rawImgs)].filter(Boolean)
      : [];
    return {
      ...c,
      name: c.name || "Natural Sand",
      images: imgList
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

  const baseMoq = p.moq || p.b2bPricing?.moq || (rawTiersList[0]?.min) || 50;
  const basePrice = (p.price && p.price >= 500) ? p.price : (p.b2bPricing?.basePrice && p.b2bPricing.basePrice >= 500) ? p.b2bPricing.basePrice : 1700;

  const t1Min = rawTiersList[0]?.min || baseMoq || 50;
  const t1Price = (rawTiersList[0]?.price && rawTiersList[0].price >= 500) ? rawTiersList[0].price : basePrice;
  const t2Min = rawTiersList[1]?.min || (t1Min <= 10 ? 100 : Math.max(100, t1Min * 4));
  const t2Price = (rawTiersList[1]?.price && rawTiersList[1].price >= 500) ? rawTiersList[1].price : Math.round(t1Price * 0.90);
  const t3Min = rawTiersList[2]?.min || (t2Min <= 250 ? 500 : t2Min * 4);
  const t3Price = (rawTiersList[2]?.price && rawTiersList[2].price >= 500) ? rawTiersList[2].price : Math.round(t1Price * 0.80);

  const fullTiers = rawTiersList.length >= 3 ? rawTiersList : [
    { min: t1Min, price: t1Price, tierLabel: rawTiersList[0]?.tierLabel || "MOQ Starter", popular: false, leadTime: rawTiersList[0]?.leadTime || "5–7 Days" },
    { min: t2Min, price: t2Price, tierLabel: rawTiersList[1]?.tierLabel || "Volume Partner", popular: true, leadTime: rawTiersList[1]?.leadTime || "4–6 Days" },
    { min: t3Min, price: t3Price, tierLabel: rawTiersList[2]?.tierLabel || "Enterprise Direct", popular: false, leadTime: rawTiersList[2]?.leadTime || "3–5 Days" }
  ];

  return {
    ...p,
    id: p._id || p.id,
    slug: p.slug,
    sku: p.sku || "GF-B2B",
    name: p.name,
    category: categoryName,
    subCategory: subCategoryName,
    unit: p.unit || "set",
    tagline: p.tagline || p.shortDescription || "",
    shortDescription: p.shortDescription || p.tagline || "",
    desc: p.desc || p.description || "",
    image: primaryImage,
    images: allImages,
    moq: t1Min,
    price: t1Price,
    retailPrice: p.retailPrice || p.originalPrice || 0,
    originalPrice: p.originalPrice || p.retailPrice || 0,
    tiers: fullTiers,
    leadTime: p.leadTime || "5 - 7 business days",
    branding: typeof p.branding === "boolean" ? p.branding : true,
    brandingTypes: p.brandingTypes || ["Custom Laser Logo Engraving", "Eco Gift Packaging", "Custom Corporate Branding"],
    colours: coloursList,
    colors: normalizedColors,
    size: p.size || "",
    material: p.material || "Agricultural Rice Husk Composite with Food-Grade Silicone",
    specs: p.specs || {},
    package: p.package || {},
    productFeatures: p.productFeatures || [],
    sustainability: p.sustainability || {},
    careInstructions: p.careInstructions || "",
    dimensions: p.dimensions || {},
    productWeight: p.productWeight || {},
    popular: Boolean(p.popular || p.isFeatured),
    totalStock: p.totalStock ?? p.stockQuantity ?? 0,
    stockQuantity: p.stockQuantity ?? p.totalStock ?? 0,
    tags: Array.isArray(p.tags) ? p.tags : [],
    collection: p.collection || "",
    tax: p.tax || { hsnCode: "3924", gstRate: 18, isTaxInclusive: true }
  };
}

export async function getProducts() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/b2b/products`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3500)
    });

    if (!res.ok) {
      console.warn(`[B2B API] GET /api/b2b/products returned status: ${res.status}`);
      return [];
    }

    const json = await res.json();
    let rawList = [];

    if (Array.isArray(json)) {
      rawList = json;
    } else if (json.success && Array.isArray(json.products)) {
      rawList = json.products;
    } else if (json.success && Array.isArray(json.data)) {
      rawList = json.data;
    } else if (Array.isArray(json.data)) {
      rawList = json.data;
    }

    return rawList.map(formatProduct).filter(Boolean);
  } catch (error) {
    console.error("[B2B API] Failed to fetch products from backend:", error.message);
    return [];
  }
}

export async function getProduct(slug) {
  if (!slug) return null;
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/b2b/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3500)
    });

    if (!res.ok) {
      console.warn(`[B2B API] GET /api/b2b/products/${slug} returned status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    const raw = json.product || (json.success && json.data) || json;
    if (!raw || (!raw.name && !raw.slug)) return null;

    return formatProduct(raw);
  } catch (error) {
    console.error(`[B2B API] Failed to fetch product (${slug}) from backend:`, error.message);
    return null;
  }
}
