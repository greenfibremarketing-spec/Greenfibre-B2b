import { categories, getCategoryBySlug } from "@/lib/categories";
import { getProduct, getProducts } from "@/lib/products";
import { staticSeoDefaults, getPageSeoDefaults } from "@/lib/seo-defaults";
import { resolveSeoMetadata, seoMetadataToForm } from "@/lib/seo-config";

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
  return seoMetadataToForm(resolveSeoMetadata(pagePath, base));
}
