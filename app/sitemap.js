import { getProducts } from "@/lib/products";
import { categories } from "@/lib/categories";
import { readSeoIndex } from "@/lib/seo-store";

export const dynamic = "force-dynamic";

const BASE_URL = "https://trade.greenfibre.org";

export default async function sitemap() {
  let products = [];
  try {
    products = (await getProducts()) || [];
  } catch (error) {
    console.error("[SEO sitemap] getProducts failed:", error?.message || error);
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: `${BASE_URL}/`, lastModified: currentDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: currentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/story`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/terms`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 }
  ];

  const landingPages = [
    { url: `${BASE_URL}/corporate-gifting`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/custom-branded-water-bottles`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/diwali-corporate-gifts`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.85 }
  ];

  const categoryPages = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const productPages = (Array.isArray(products) ? products : [])
    .filter((p) => p && p.slug)
    .map((p) => {
      let lastModified = currentDate;
      if (p.updatedAt) {
        try {
          const d = new Date(p.updatedAt);
          if (!isNaN(d.getTime())) {
            lastModified = d.toISOString().split("T")[0];
          }
        } catch {}
      }
      return {
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified,
        changeFrequency: "daily",
        priority: 0.9
      };
    });

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

