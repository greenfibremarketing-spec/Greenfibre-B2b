export const SITE_URL = "https://trade.greenfibre.org";
export const SEO_ADMIN_EMAIL = "greenfibre.marketing@gmail.com";
export const SITE_TITLE_TEMPLATE = "%s | Green Fibre B2B";
export const SITE_KEYWORDS = ["rice husk tableware", "eco-friendly corporate gifts", "sustainable tableware India", "bulk corporate gifting", "custom branded bottles", "upcycled crop stubble products", "BPA-free tableware manufacturer", "laser engraved corporate gifts", "Green Fibre B2B", "rice husk composite products"];
export const SEO_FIELDS = {
  title: { label: "SEO Title", max: 200 },
  description: { label: "Meta Description", max: 1000, multiline: true },
  keywords: { label: "Keywords", max: 5000, multiline: true },
  canonical: { label: "Canonical URL", max: 2048 },
  socialImage: { label: "Social Share Image URL", max: 2048 },
  ogTitle: { label: "Open Graph Title", max: 200 },
  ogDescription: { label: "Open Graph Description", max: 1000, multiline: true },
  twitterTitle: { label: "Twitter Title", max: 200 },
  twitterDescription: { label: "Twitter Description", max: 1000, multiline: true },
  focusKeyword: { label: "Focus Keyword", max: 200 }
};

export function validateSeoSettings(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid SEO settings.");
  const clean = {};
  for (const [key, field] of Object.entries(SEO_FIELDS)) {
    if (typeof input[key] !== "string") throw new Error(`${field.label} must be text.`);
    clean[key] = input[key].trim();
    if (clean[key].length > field.max) throw new Error(`${field.label} is too long.`);
  }
  for (const key of ["noindex", "nofollow"]) {
    if (typeof input[key] !== "boolean") throw new Error(`${key} must be a checkbox value.`);
    clean[key] = input[key];
  }
  for (const key of ["canonical", "socialImage"]) {
    const value = clean[key];
    if (!value) continue;
    if (key === "socialImage" && /^\/(?!\/)[^\s\\?#]+$/.test(value)) continue;
    let url;
    try { url = new URL(value); } catch { throw new Error(`${SEO_FIELDS[key].label} must be a valid URL.`); }
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.hash) {
      throw new Error(`${SEO_FIELDS[key].label} must be an HTTP or HTTPS URL without credentials or a fragment.`);
    }
  }
  clean.keywords = [...new Set(clean.keywords.split(/[,\n]+/).map((word) => word.trim()).filter(Boolean))].join("\n");
  return clean;
}

export function mergeSeoMetadata(base, settings) {
  if (!settings) return base;
  const title = settings.title;
  const description = settings.description;
  const canonical = settings.canonical;
  const image = settings.socialImage;
  const robots = {
    ...base.robots,
    index: base.robots?.index === false ? false : !settings.noindex,
    follow: base.robots?.follow === false ? false : !settings.nofollow
  };
  return {
    ...base,
    ...(title && { title: { absolute: title } }),
    ...(description && { description }),
    ...(settings.keywords && { keywords: settings.keywords.split("\n") }),
    ...(canonical && { alternates: { ...base.alternates, canonical } }),
    robots: { ...robots, googleBot: { ...base.robots?.googleBot, index: robots.index, follow: robots.follow } },
    openGraph: {
      ...base.openGraph,
      ...(settings.ogTitle || title ? { title: settings.ogTitle || title } : {}),
      ...(settings.ogDescription || description ? { description: settings.ogDescription || description } : {}),
      ...(canonical && { url: canonical }),
      ...(image && { images: [{ url: image }] })
    },
    twitter: {
      ...base.twitter,
      ...(settings.twitterTitle || title ? { title: settings.twitterTitle || title } : {}),
      ...(settings.twitterDescription || description ? { description: settings.twitterDescription || description } : {}),
      ...(image && { card: "summary_large_image", images: [image] })
    }
  };
}

// Both the editor and generateMetadata resolve inheritance with this function.
// In particular, Next.js Twitter cards inherit the Open Graph title/description.
export function resolveSeoMetadata(pagePath, base, settings = null) {
  const title = typeof base.title === "string"
    ? (pagePath === "/" ? base.title : SITE_TITLE_TEMPLATE.replace("%s", base.title))
    : base.title?.absolute || base.title?.default || "Green Fibre B2B";
  const canonical = new URL(base.alternates?.canonical || pagePath, SITE_URL).href;
  const ogTitle = base.openGraph?.title || title;
  const ogDescription = base.openGraph?.description || base.description || "";
  const defaults = {
    ...base,
    title: { absolute: title },
    keywords: base.keywords || SITE_KEYWORDS,
    alternates: { ...base.alternates, canonical },
    robots: { index: true, follow: true, ...base.robots },
    openGraph: { type: "website", ...base.openGraph, title: ogTitle, description: ogDescription, url: canonical },
    twitter: {
      card: "summary_large_image", ...base.twitter,
      title: base.twitter?.title || ogTitle,
      description: base.twitter?.description || ogDescription,
      images: base.twitter?.images || base.openGraph?.images || []
    }
  };
  const resolved = mergeSeoMetadata(defaults, settings);
  const canonicalUrl = new URL(resolved.alternates.canonical, SITE_URL);
  // Match Next.js normalization of the root canonical URL.
  resolved.alternates = { ...resolved.alternates, canonical: canonicalUrl.pathname === "/" ? canonicalUrl.origin : canonicalUrl.href };
  resolved.openGraph = { ...resolved.openGraph, url: resolved.alternates.canonical };
  for (const key of ["openGraph", "twitter"]) {
    if (resolved[key].images) {
      resolved[key] = { ...resolved[key], images: resolved[key].images.map((image) => {
        const value = typeof image === "string" ? { url: image } : image;
        return { ...value, url: new URL(value.url, SITE_URL).href };
      }) };
    }
  }
  return resolved;
}

export function seoMetadataToForm(metadata, focusKeyword = "") {
  const image = metadata.openGraph?.images?.[0];
  return {
    title: typeof metadata.title === "string" ? metadata.title : metadata.title?.absolute || metadata.title?.default || "",
    description: metadata.description || "",
    keywords: Array.isArray(metadata.keywords) ? metadata.keywords.join("\n") : metadata.keywords || "",
    canonical: metadata.alternates?.canonical || "",
    socialImage: typeof image === "string" ? image : image?.url || "",
    ogTitle: metadata.openGraph?.title || "",
    ogDescription: metadata.openGraph?.description || "",
    twitterTitle: metadata.twitter?.title || "",
    twitterDescription: metadata.twitter?.description || "",
    noindex: metadata.robots?.index === false,
    nofollow: metadata.robots?.follow === false,
    focusKeyword
  };
}
