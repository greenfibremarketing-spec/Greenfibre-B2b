import { applySeoSettings } from "@/lib/seo";
import { categoryMetadata } from "@/lib/seo-defaults";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { getProducts, matchesProductCategory } from "@/lib/products";
import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import { ChevronRight, Home as HomeIcon, Package } from "lucide-react";

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}



export async function generateMetadata({ params }) {
  return applySeoSettings(`/category/${params.slug}`, await categoryMetadata({ params }));
}

export default async function CategoryPage({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const allProducts = await getProducts();
  const categoryProducts = allProducts.filter((p) =>
    matchesProductCategory(p, category.name)
  );
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
        name: category.name,
        item: `${siteUrl}/category/${category.slug}`
      }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.metaTitle,
    description: category.metaDescription,
    url: `${siteUrl}/category/${category.slug}`
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} Products`,
    itemListElement: categoryProducts.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${siteUrl}/products/${p.slug}`,
      name: p.name
    }))
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 sm:py-10">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />
      <JsonLd data={itemListSchema} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation: Home > Category */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-brand-700 transition-colors"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href="/products"
            className="hover:text-brand-700 transition-colors"
          >
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900" aria-current="page">
            {category.name}
          </span>
        </nav>

        {/* Dynamic Compact Green Category Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#1b7a4b] via-[#15803d] to-[#0f5c35] text-white rounded-xl sm:rounded-2xl md:rounded-3xl px-3.5 py-3 sm:px-6 sm:py-5 md:px-8 md:py-7 lg:px-9 lg:py-8 shadow-md shadow-emerald-950/10 border border-emerald-400/30">
          {/* Subtle Eco Ambient Radial Overlays */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,231,183,0.2),transparent_60%)]" />
          <div className="pointer-events-none absolute -right-8 -top-8 sm:-right-16 sm:-top-16 h-36 sm:h-72 w-36 sm:w-72 rounded-full bg-emerald-300/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-6 sm:-bottom-20 sm:-left-12 h-36 sm:h-64 w-36 sm:w-64 rounded-full bg-lime-300/15 blur-2xl" />

          <div className="relative z-10 max-w-3xl space-y-1.5 sm:space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>{category.name} · {categoryProducts.length} Wholesale {categoryProducts.length === 1 ? "Product" : "Products"}</span>
            </div>

            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight sm:leading-snug drop-shadow-2xs">
              {category.h1 || category.name}
            </h1>

            <p className="text-[11px] sm:text-xs md:text-sm text-emerald-50/90 leading-snug sm:leading-relaxed font-normal max-w-2xl line-clamp-2 sm:line-clamp-none">
              {category.intro || category.metaDescription}
            </p>
          </div>
        </header>

        {/* Product Cards Grid */}
        <section aria-label={`${category.name} Products`}>
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {categoryProducts.map((p) => (
                <Card key={p.slug} p={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                No products found in this category
              </h2>
              <p className="text-xs text-slate-500 max-w-sm">
                New products are currently being added. Check back soon or view our complete wholesale catalog.
              </p>
              <Link
                href="/products"
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold hover:bg-brand-800 transition-colors"
              >
                Explore Full Catalog
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
