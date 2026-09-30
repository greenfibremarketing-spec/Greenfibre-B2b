import { getProducts } from "@/lib/products";

const u = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const products = await getProducts();
  return [
    { url: u, lastModified: new Date() },
    { url: `${u}/products`, lastModified: new Date() },
    { url: `${u}/story`, lastModified: new Date() },
    { url: `${u}/quote`, lastModified: new Date() },
    ...products.map((p) => ({
      url: `${u}/products/${p.slug}`,
      lastModified: new Date()
    }))
  ];
}
