import { getProducts } from "@/lib/products";
import { categories } from "@/lib/categories";
import { readSeoIndex } from "@/lib/seo-store";

export const dynamic = "force-dynamic";

const BASE_URL = "https://trade.greenfibre.org";

export default async function sitemap() {
  const products = await getProducts();

  const staticPages = [
    { url: `${BASE_URL}/`, lastModified: "2026-10-13", changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: "2026-10-13", changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/story`, lastModified: "2026-10-13", changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: "2026-10-13", changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/terms`, lastModified: "2026-10-13", changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: "2026-10-13", changeFrequency: "yearly", priority: 0.3 }
  ];

  const landingPages = [
    { url: `${BASE_URL}/corporate-gifting`, lastModified: "2026-10-13", changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/custom-branded-water-bottles`, lastModified: "2026-10-13", changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/diwali-corporate-gifts`, lastModified: "2026-10-13", changeFrequency: "weekly", priority: 0.85 }
  ];

  const categoryPages = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: "2026-10-13",
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const productPages = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
    changeFrequency: "daily",
    priority: 0.9
  }));

  let settings = {};
  try { settings = await readSeoIndex(); } catch (error) { console.error("[SEO sitemap]", error.message); }
  return [...staticPages, ...landingPages, ...categoryPages, ...productPages]
    .filter((page) => {
      const seo = settings[new URL(page.url).pathname];
      if (seo?.noindex) return false;
      if (seo?.canonical && seo.canonical.replace(/\/$/, "") !== page.url.replace(/\/$/, "")) return false;
      return true;
    })
    .map((page) => ({ ...page, ...(settings[new URL(page.url).pathname]?.updatedAt ? { lastModified: settings[new URL(page.url).pathname].updatedAt } : {}) }));
}

