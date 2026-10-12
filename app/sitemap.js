import { getProducts } from "@/lib/products";
import { categories } from "@/lib/categories";

const BASE_URL = "https://trade.greenfibre.org";

export default async function sitemap() {
  const products = await getProducts();

  const staticPages = [
    { url: `${BASE_URL}/`, lastModified: new Date() },
    { url: `${BASE_URL}/products`, lastModified: new Date() },
    { url: `${BASE_URL}/story`, lastModified: new Date() },
    { url: `${BASE_URL}/terms`, lastModified: new Date() },
    { url: `${BASE_URL}/privacy`, lastModified: new Date() }
  ];

  const categoryPages = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date()
  }));

  const productPages = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date()
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}

