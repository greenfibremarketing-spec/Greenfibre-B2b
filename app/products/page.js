import { getProducts, normalizeContextKey } from "@/lib/products";
import ProductsCatalogView from "@/components/ProductsCatalogView";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({ searchParams = {} }) {
  const hasFilter = Boolean(
    searchParams.q || searchParams.category || searchParams.type || searchParams.context
  );

  return {
    title: "Wholesale Product Catalog & Eco Gifting",
    description:
      "Explore our complete collection of sustainable rice-husk composite tableware, drinkware, lunchboxes, and luxury corporate gift hampers for bulk orders.",
    alternates: { canonical: "/products" },
    openGraph: {
      type: "website",
      title: "Wholesale Product Catalog & Eco Gifting | Green Fibre B2B",
      description:
        "Explore our complete collection of sustainable rice-husk composite tableware, drinkware, lunchboxes, and luxury corporate gift hampers for bulk orders.",
      url: "/products",
      images: [
        {
          url: "/images/green-dining-nature.jpg",
          alt: "Green Fibre B2B Wholesale Sustainable Product Catalog"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Wholesale Product Catalog & Eco Gifting | Green Fibre B2B",
      description:
        "Direct manufacturer catalog: eco-friendly rice-husk tableware, coffee mugs, and corporate gift hampers.",
      images: ["/images/green-dining-nature.jpg"]
    },
    ...(hasFilter && { robots: { index: false, follow: true } })
  };
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

