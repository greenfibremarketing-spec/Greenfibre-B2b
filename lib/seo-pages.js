import { categories, getCategoryBySlug } from "@/lib/categories";
import { getProduct, getProducts } from "@/lib/products";
import { staticSeoDefaults, getPageSeoDefaults } from "@/lib/seo-defaults";
import { SITE_URL, SITE_KEYWORDS } from "@/lib/seo-config";

const labels = { "/": "Homepage", "/products": "Product Catalog", "/story": "Our Story", "/contact": "Contact", "/terms": "Terms", "/privacy": "Privacy", "/corporate-gifting": "Corporate Gifting", "/custom-branded-water-bottles": "Custom Branded Water Bottles", "/diwali-corporate-gifts": "Diwali Corporate Gifts" };

export async function getSeoPages() {
  const products = await getProducts();
  return [
    ...Object.entries(labels).map(([path, label]) => ({ path, label })),
    ...categories.map((category) => ({ path: `/category/${category.slug}`, label: `Category: ${category.name}` })),
    ...products.map((product) => ({ path: `/products/${product.slug}`, label: `Product: ${product.name}` }))
  ];
}

export async function validSeoPath(pagePath) {
  if (typeof pagePath !== "string" || pagePath.length > 250) return false;
  if (Object.hasOwn(staticSeoDefaults, pagePath) || pagePath === "/products") return true;
  const match = pagePath.match(/^\/(category|products)\/([a-zA-Z0-9_-]+)$/);
  if (!match) return false;
  return match[1] === "category" ? Boolean(getCategoryBySlug(match[2])) : Boolean(await getProduct(match[2]));
}

export async function seoFormDefaults(pagePath) {
  const base = await getPageSeoDefaults(pagePath);
  const title = typeof base.title === "string"
    ? (pagePath === "/" ? base.title : `${base.title} | Green Fibre B2B`)
    : base.title?.absolute || base.title?.default || "";
  const firstImage = base.openGraph?.images?.[0];
  return {
    title,
    description: base.description || "",
    keywords: SITE_KEYWORDS.join("\n"),
    canonical: new URL(base.alternates?.canonical || pagePath, SITE_URL).href,
    socialImage: typeof firstImage === "string" ? firstImage : firstImage?.url || "",
    ogTitle: base.openGraph?.title || title,
    ogDescription: base.openGraph?.description || base.description || "",
    twitterTitle: base.twitter?.title || title,
    twitterDescription: base.twitter?.description || base.description || "",
    noindex: base.robots?.index === false,
    nofollow: base.robots?.follow === false,
    focusKeyword: ""
  };
}
