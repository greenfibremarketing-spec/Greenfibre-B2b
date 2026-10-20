import { applySeoSettings } from "@/lib/seo";
import { catalogMetadata } from "@/lib/seo-defaults";
import { getProducts, normalizeContextKey } from "@/lib/products";
import ProductsCatalogView from "@/components/ProductsCatalogView";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({ searchParams = {} }) {
  return applySeoSettings("/products", await catalogMetadata({ searchParams }));
}

export default async function ProductsPage({ searchParams = {} } = {}) {
  const { q = "", category = "", type = "", context = "" } = searchParams || {};

  const activeOccasionParam = type || context || null;
  const activeContext = activeOccasionParam ? normalizeContextKey(activeOccasionParam) : null;

  const allProducts = await getProducts(activeContext);
  const siteUrl = "https://trade.greenfibre.org";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/products`
      }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Green Fibre B2B Wholesale Product Catalog",
    description:
      "Catalog of sustainable rice-husk composite tableware, drinkware, and corporate gift hampers direct from the manufacturer.",
    url: `${siteUrl}/products`
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />
      <ProductsCatalogView
        initialProducts={allProducts}
        initialCategory={category}
        initialQuery={q}
        initialType={type}
        initialContext={context}
        activeContext={activeContext}
      />
    </>
  );
}

