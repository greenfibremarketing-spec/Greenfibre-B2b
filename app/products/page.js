import { getProducts, normalizeContextKey } from "@/lib/products";
import ProductsCatalogView from "@/components/ProductsCatalogView";

export const metadata = {
  title: "Wholesale Product Catalog & Eco Gifting",
  description:
    "Explore our complete collection of sustainable rice-husk composite tableware, drinkware, lunchboxes, and luxury corporate gift hampers for bulk orders."
};

export default async function ProductsPage({ searchParams = {} } = {}) {
  const { q = "", category = "", type = "", context = "" } = searchParams || {};

  const activeOccasionParam = type || context || null;
  const activeContext = activeOccasionParam ? normalizeContextKey(activeOccasionParam) : null;

  const allProducts = await getProducts(activeContext);

  return (
    <ProductsCatalogView
      initialProducts={allProducts}
      initialCategory={category}
      initialQuery={q}
      initialType={type}
      initialContext={context}
      activeContext={activeContext}
    />
  );
}
