import { applySeoSettings } from "@/lib/seo";
import { productMetadata } from "@/lib/seo-defaults";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ProductDetailView from "@/components/ProductDetailView";
import { getProduct, getProducts } from "@/lib/products";
import { resolveCategorySlug } from "@/lib/categories";

export const revalidate = 300;

export async function generateStaticParams() {
  const ps = await getProducts();
  return ps.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  return applySeoSettings(`/products/${params.slug}`, await productMetadata({ params }));
}

export default async function ProductDetailPage({ params, searchParams = {} }) {
  const rawContext = searchParams.context || searchParams.type || searchParams.category || searchParams.event || null;
  const p = await getProduct(params.slug, rawContext);
  if (!p) notFound();

  const allProducts = await getProducts(rawContext);
  // Prefer backend-provided companion products (additionalProducts from B2BProductConfig).
  // Fall back to same-category / popular filter if the API didn't return any.
  let relatedProducts = [];
  if (Array.isArray(p.additionalProducts) && p.additionalProducts.length > 0) {
    relatedProducts = p.additionalProducts
      .map((addon) => {
        const fullProd = allProducts.find(
          (x) =>
            x.slug === addon.slug ||
            x._id === addon._id ||
            (x.name && addon.name && x.name.toLowerCase() === addon.name.toLowerCase())
        );
        if (fullProd) {
          return {
            ...fullProd,
            ...addon,
            image: addon.image || fullProd.image,
            price: addon.price || fullProd.price || 0,
            originalPrice:
              addon.originalPrice || fullProd.originalPrice || fullProd.retailPrice || fullProd.price || 0,
            moq: fullProd.moq || 10,
            unit: addon.unit || fullProd.unit || "set"
          };
        }
        return addon;
      })
      .slice(0, 4);
  }

  if (relatedProducts.length === 0) {
    relatedProducts = allProducts
      .filter((x) => x.slug !== p.slug && (x.category === p.category || x.popular))
      .slice(0, 4);
  }

  const siteUrl = "https://trade.greenfibre.org";

  // Build clean images array (omit if empty)
  const imagesArray = Array.from(
    new Set([
      ...(Array.isArray(p.images) ? p.images : []),
      p.image
    ].filter(Boolean))
  );

  const hasPrice = typeof p.price === "number" && p.price > 0;
  const isAvailable = (typeof p.totalStock === "number" && p.totalStock > 0) ||
    (typeof p.stockQuantity === "number" && p.stockQuantity > 0);
  const descriptionText = p.desc || p.description || p.shortDescription || null;

  // STEP 2: Product JSON-LD schema
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.sku ? { sku: p.sku } : {}),
    ...(imagesArray.length > 0 ? { image: imagesArray } : {}),
    ...(descriptionText ? { description: descriptionText } : {}),
    brand: {
      "@type": "Brand",
      name: "Green Fibre"
    },
    ...(hasPrice ? {
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: p.price,
        availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${siteUrl}/products/${p.slug}`
      }
    } : {})
  };

  // STEP 2: BreadcrumbList schema
  const breadcrumbJsonLd = {
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
      },
      {
        "@type": "ListItem",
        position: 3,
        name: p.name,
        item: `${siteUrl}/products/${p.slug}`
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 sm:pb-12 space-y-4">
      {/* Schemas: Product and BreadcrumbList */}
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Complete Interactive Product View (Matching User Design Mockup) */}
      <ProductDetailView product={p} context={rawContext} relatedProducts={relatedProducts} />
    </div>
  );
}
