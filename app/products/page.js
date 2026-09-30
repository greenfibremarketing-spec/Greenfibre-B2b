import Link from "next/link";
import Card from "@/components/Card";
import { categories, getProducts } from "@/lib/products";
import { Search } from "lucide-react";

export const metadata = {
  title: "Wholesale Product Catalog",
  description:
    "Explore our complete collection of sustainable rice-husk composite tableware, drinkware, lunchboxes, and luxury corporate gift sets for bulk orders."
};

export default async function ProductsPage({ searchParams = {} } = {}) {
  const { q = "", category = "" } = searchParams || {};
  const searchTerm = q.toLowerCase().trim();
  const allProducts = await getProducts();

  const giftingSubTypes = ["Corporate", "Anniversary", "Birthday", "Institutional", "House Warming", "Wedding"];
  const isGiftingSubType = giftingSubTypes.includes(category);
  const giftingType = isGiftingSubType ? category.toLowerCase().replace(/\s+/g, "") : null;

  const filtered = allProducts.filter((p) => {
    const isGiftingCat = category === "Gifting" || category === "Gift Boxes & Hampers";

    // For a gifting sub-type (e.g. Corporate), show all gifting products for now
    // (until products have a 'type' field, all gifting products show under any sub-type)
    const matchesCategory =
      !category ||
      category === "All Products" ||
      isGiftingSubType ||  // show all products for sub-type (filter by type when data supports it)
      (isGiftingCat
        ? p.category === "Gifting" ||
          p.category === "Gift Boxes & Hampers" ||
          (typeof p.category === "string" && p.category.toLowerCase().includes("gift")) ||
          (typeof p.name === "string" && p.name.toLowerCase().includes("gift")) ||
          (typeof p.name === "string" && p.name.toLowerCase().includes("pack"))
        : p.category === category);

    const matchesSearch =
      !searchTerm ||
      `${p.name} ${p.sku} ${p.category} ${p.tagline || ""} ${p.desc}`.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-12 sm:pb-16 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="badge-green">
          Enterprise Catalog
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Wholesale Products &amp; Corporate Gift Sets
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Discover certified food-safe, upcycled rice-husk homeware engineered for daily enterprise use, hotel hospitality, and custom branded client gifting.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            {categories.map((c) => {
              const isAll = c === "All Products";
              const isGiftingTab = c === "Gifting";
              const isSubType = giftingSubTypes.includes(c);

              // Active logic
              const isActive = isAll
                ? !category || category === "All Products"
                : isGiftingTab
                ? category === "Gifting" || category === "Gift Boxes & Hampers"
                : category === c;

              // href logic — sub-types link with &type=...
              const targetHref = isAll
                ? `/products${q ? `?q=${encodeURIComponent(q)}` : ""}`
                : isSubType
                ? `/products?category=Gifting&type=${encodeURIComponent(c.toLowerCase().replace(/\s+/g, ""))}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                : `/products?category=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

              return (
                <Link
                  key={c}
                  href={targetHref}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>

          {/* Search Form */}
          <form method="get" className="relative flex-shrink-0 min-w-[260px]" role="search">
            {category && <input type="hidden" name="category" value={category} />}
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name, SKU, or type..."
              aria-label="Search catalog"
              className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            />
          </form>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900 font-bold">{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"}
            {category && category !== "All Products" && <span> in <strong className="text-slate-900">{category}</strong></span>}
            {q && <span> matching &ldquo;<strong className="text-slate-900">{q}</strong>&rdquo;</span>}
          </div>
          {(q || (category && category !== "All Products")) && (
            <Link
              href="/products"
              className="text-xs font-bold text-brand-700 hover:underline"
            >
              ✕ Clear filters
            </Link>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <Card key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No products match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing active category filters.
          </p>
          <div className="pt-1">
            <Link href="/products" className="btn-primary text-xs py-2 px-4">
              View All Products
            </Link>
          </div>
        </div>
      )}

      {/* Bespoke Enterprise Notice - Clean Light Green */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-slate-900">
            Need Custom Pantone Colors or Bespoke Tooling?
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            We manufacture bespoke molds, custom corporate Pantone colors, and bundled gift packaging for enterprise volumes.
          </p>
        </div>
        <Link
          href="/quote"
          className="btn-primary text-xs sm:text-sm py-2.5 px-5 whitespace-nowrap"
        >
          Contact Our Engineering Desk →
        </Link>
      </div>
    </div>
  );
}
