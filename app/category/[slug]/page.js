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

const categoryOgImages = {
  drinkware: "/images/thermal-bottle.jpg",
  "gift-boxes-hampers": "/images/gift-set-classic.jpg",
  "kitchen-dining": "/images/bento-box.jpg",
  tableware: "/images/green-tableware-plants.jpg",
  "storage-organizers": "/images/storage-basket.jpg",
  "home-living": "/images/planter-medium.jpg"
};

export async function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false }
    };
  }

  const ogImage = categoryOgImages[category.slug] || "/images/hero.jpg";

  return {
    title: { absolute: category.metaTitle },
    description: category.metaDescription,
    alternates: {
      canonical: `/category/${category.slug}`
    },
    openGraph: {
      type: "website",
      title: category.metaTitle,
      description: category.metaDescription,
      url: `/category/${category.slug}`,
      images: [
        {
          url: ogImage,
          alt: `${category.name} - Green Fibre Sustainable B2B Collection`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: category.metaTitle,
      description: category.metaDescription,
      images: [ogImage]
    }
  };
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

        {/* Category Header & Editorial Intro */}
        <header className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="badge-green text-xs font-bold uppercase tracking-wider">
              {category.name}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              {categoryProducts.length} Wholesale {categoryProducts.length === 1 ? "Product" : "Products"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {category.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
            {category.intro}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 border-t border-slate-100">
            <span className="badge-slate">100% Upcycled Crop Stubble</span>
            <span className="badge-slate">Zero Melamine &amp; BPA-Free</span>
            <span className="badge-slate">Custom Laser Logo Branding</span>
            <span className="badge-slate">Pan-India Freight Dispatch</span>
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
