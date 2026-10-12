import { getProducts, normalizeContextKey } from "@/lib/products";
import ProductsCatalogView from "@/components/ProductsCatalogView";

export async function generateMetadata({ searchParams = {} }) {
  const hasFilter = Boolean(
    searchParams.q || searchParams.category || searchParams.type || searchParams.context
  );

  return {
    title: "Wholesale Product Catalog & Eco Gifting",
    description:
      "Explore our complete collection of sustainable rice-husk composite tableware, drinkware, lunchboxes, and luxury corporate gift hampers for bulk orders.",
    alternates: { canonical: "/products" },
    ...(hasFilter && { robots: { index: false, follow: true } })
  };
}

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
