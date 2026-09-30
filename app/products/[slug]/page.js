import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import ProductDetailView from "@/components/ProductDetailView";
import { getProduct, getProducts } from "@/lib/products";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";

export async function generateStaticParams() {
  const ps = await getProducts();
  return ps.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = await getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} - Wholesale Bulk Orders`,
    description: `${p.desc} Minimum Order Quantity: ${p.moq} ${p.unit}. Custom laser branding and Pan-India dispatch.`,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: `${p.name} | Green Fibre B2B`,
      description: p.desc,
      images: p.image ? [{ url: p.image }] : []
    }
  };
}

export default async function ProductDetailPage({ params, searchParams = {} }) {
  const rawContext = searchParams.context || searchParams.type || searchParams.category || searchParams.event || null;
  const p = await getProduct(params.slug, rawContext);
  if (!p) notFound();

  const allProducts = await getProducts(rawContext);
  const relatedProducts = allProducts
    .filter((x) => x.slug !== p.slug && (x.category === p.category || x.popular))
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    image: p.image,
    description: p.desc,
    category: p.category,
    brand: {
      "@type": "Brand",
      name: "Green Fibre"
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: p.tiers ? p.tiers[p.tiers.length - 1].price : p.price,
      highPrice: p.tiers ? p.tiers[0].price : p.price,
      offerCount: p.tiers?.length || 1,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: p.moq,
        unitText: p.unit
      }
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12 sm:pb-16 space-y-4 sm:space-y-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-slate-900 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {rawContext ? (
          <>
            <Link href="/products?category=Gifting" className="hover:text-slate-900 transition-colors">
              Gifting
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href={`/products?category=Gifting&type=${encodeURIComponent(rawContext)}`}
              className="hover:text-slate-900 transition-colors capitalize"
            >
              {rawContext === "employee-onboarding"
                ? "Employee Onboarding"
                : rawContext === "anniversary"
                ? "Anniversary Gifting"
                : rawContext === "wedding"
                ? "Wedding Celebrations"
                : rawContext === "festive"
                ? "Festive Season"
                : "Corporate Gifting"}
            </Link>
          </>
        ) : (
          <Link
            href={`/products?category=${encodeURIComponent(typeof p.category === "string" ? p.category : p.category?.name || "All Products")}`}
            className="hover:text-slate-900 transition-colors"
          >
            {typeof p.category === "string" ? p.category : p.category?.name || "All Products"}
          </Link>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{p.name}</span>
      </nav>

      {/* Complete Interactive Product View (Synchronized Multi-Image Gallery + Customizer) */}
      <ProductDetailView product={p} context={rawContext} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
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
