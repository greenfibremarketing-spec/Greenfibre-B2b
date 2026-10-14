import { applySeoSettings } from "@/lib/seo";
import { productMetadata } from "@/lib/seo-defaults";
import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import ProductDetailView from "@/components/ProductDetailView";
import { getProduct, getProducts } from "@/lib/products";
import { resolveCategorySlug } from "@/lib/categories";
import { ChevronRight, ArrowRight, Layers } from "lucide-react";

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
  // Includes name, sku, image array, description, brand { Brand: "Green Fibre" }, offers
  // Omits any field that does not exist in the data. Does NOT include aggregateRating or reviews.
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

  // STEP 3: Parse real fields that exist in data for visible HTML
  const sizesValue =
    p.size ||
    (Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes.join(", ") : null) ||
    p.specs?.Capacity ||
    p.specs?.capacity ||
    null;

  const rawColours =
    Array.isArray(p.colours) && p.colours.length > 0
      ? p.colours
      : Array.isArray(p.colors) && p.colors.length > 0
        ? p.colors.map((c) => (typeof c === "string" ? c : c.name)).filter(Boolean)
        : null;
  const coloursList = rawColours && rawColours.length > 0 ? rawColours : null;

  const rawBranding =
    Array.isArray(p.brandingTypes) && p.brandingTypes.length > 0
      ? p.brandingTypes
      : Array.isArray(p.customizationOptions) && p.customizationOptions.length > 0
        ? p.customizationOptions.map((c) => c.label || c.tag || c.name).filter(Boolean)
        : p.branding
          ? ["In-house Laser Engraving", "Custom Branded Gift Packaging"]
          : null;
  const brandingList = rawBranding && rawBranding.length > 0 ? rawBranding : null;

  const categorySlug = p.category ? resolveCategorySlug(p.category) : null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 sm:pb-16 space-y-6 sm:space-y-8">
      {/* Schemas: Product and BreadcrumbList */}
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-slate-900 transition-colors">
          Products
        </Link>
        {categorySlug && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href={`/category/${categorySlug}`}
              className="hover:text-slate-900 transition-colors capitalize"
            >
              {typeof p.category === "string" ? p.category : p.category?.name || "Category"}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{p.name}</span>
      </nav>

      {/* Complete Interactive Product View (Synchronized Multi-Image Gallery + Customizer) */}
      <ProductDetailView product={p} context={rawContext} relatedProducts={relatedProducts} />

      {/* STEP 3: Visible Product Page Content (Render real data as visible HTML) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            Product Specifications & Wholesale Details
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Wholesale Ordering & Manufacturing Details
          </h2>
        </div>

        {descriptionText && (
          <div className="text-sm text-slate-700 leading-relaxed max-w-4xl space-y-2">
            <p>{descriptionText}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {typeof p.moq === "number" && p.moq > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Minimum Order Quantity (MOQ)</span>
              <span className="text-sm font-bold text-slate-900 block">
                {p.moq} {p.unit ? (p.moq > 1 ? `${p.unit}s` : p.unit) : "units"}
              </span>
            </div>
          )}

          {p.unit && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Wholesale Order Unit</span>
              <span className="text-sm font-bold text-slate-900 capitalize block">
                Per {p.unit}
              </span>
            </div>
          )}

          {sizesValue && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Sizes & Capacity</span>
              <span className="text-sm font-bold text-slate-900 block">
                {sizesValue}
              </span>
            </div>
          )}

          {coloursList && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Available Colours</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {coloursList.map((col, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white border border-slate-200 text-slate-800"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {p.leadTime && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Production Lead Time</span>
              <span className="text-sm font-bold text-slate-900 block">
                {p.leadTime}
              </span>
            </div>
          )}

          {brandingList && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1 sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-medium text-slate-500 block">Branding Options</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {brandingList.map((brandOpt, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 border border-emerald-200/80 text-emerald-900"
                  >
                    {brandOpt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="hidden md:block pt-8 border-t border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-0.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-brand-600" />
                <span>Complementary Items</span>
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Frequently Ordered Together
              </h2>
            </div>
            <Link
              href="/products"
              className="btn-secondary text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <span>View All Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Card key={rel.slug} p={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
