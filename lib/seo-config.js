export const SITE_URL = "https://trade.greenfibre.org";
export const SEO_ADMIN_EMAIL = "greenfibre.marketing@gmail.com";
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
