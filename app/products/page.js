import Link from "next/link";
import Card from "@/components/Card";
import HeroSwiper from "@/components/HeroSwiper";
import { categories, getProducts, normalizeContextKey, matchesProductCategory } from "@/lib/products";
import { Search, Sparkles, ArrowRight, Mail, Leaf, ArrowUp } from "lucide-react";

export const metadata = {
  title: "Wholesale Product Catalog",
  description:
    "Explore our complete collection of sustainable rice-husk composite tableware, drinkware, lunchboxes, and luxury corporate gift sets for bulk orders."
};

function getPageHeaderContent({ category = "", type = "", context = "" }) {
  const occasion = (type || context || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const cat = (category || "").toLowerCase().trim();

  if (occasion.includes("inst") || cat === "institutional") {
    return {
      badge: "Institutional Supplies",
      title: "Institutional Supplies & Eco Bulk Sets",
      desc: "Food-safe, durable rice-husk dining sets, lunchboxes, and drinkware engineered for schools, universities, hospitals, and institutional cafeterias."
    };
  }

  if (occasion.includes("corp") || cat === "corporate") {
    return {
      badge: "Corporate Gifting",
      title: "Corporate Gifting & Executive Hampers",
      desc: "Custom-branded eco gift sets, employee welcome kits, and client appreciation hampers crafted from sustainable agricultural rice husk."
    };
  }

  if (occasion.includes("anniv") || cat === "anniversary") {
    return {
      badge: "Milestone Celebrations",
      title: "Anniversary & Milestone Gift Sets",
      desc: "Commemorate company milestones, foundation days, and work anniversaries with premium sustainable gift sets."
    };
  }

  if (occasion.includes("birth") || cat === "birthday") {
    return {
      badge: "Birthday Gifting",
      title: "Birthday & Employee Celebration Gifts",
      desc: "Thoughtful, earth-friendly gift hampers and coffee mugs designed to celebrate team birthdays and special personal moments."
    };
  }

  if (occasion.includes("house") || cat.includes("house")) {
    return {
      badge: "Housewarming Gifts",
      title: "Housewarming & Living Gift Sets",
      desc: "Curated sustainable homeware, tableware essentials, and coffee sets designed for new beginnings and housewarming celebrations."
    };
  }

  if (occasion.includes("wed") || cat === "wedding") {
    return {
      badge: "Wedding & Festive",
      title: "Wedding & Festive Luxury Sets",
      desc: "Exquisite eco-friendly dining sets and gift collections for weddings, festive gatherings, and momentous celebrations."
    };
  }

  if (cat.includes("gift") || cat.includes("hamper")) {
    return {
      badge: "Eco Gift Hampers",
      title: "Sustainable Gift Hampers & Curated Sets",
      desc: "Curated eco-friendly gift hampers and custom-branded sets crafted from upcycled crop waste for every occasion."
    };
  }

  if (cat.includes("table")) {
    return {
      badge: "Tableware Collection",
      title: "Sustainable Tableware & Dining Sets",
      desc: "Microwave and dishwasher-safe dining essentials, bowls, plates, and platters crafted from natural crop biocomposite."
    };
  }

  if (cat.includes("kitch")) {
    return {
      badge: "Kitchenware Collection",
      title: "Sustainable Kitchenware & Lunchboxes",
      desc: "Bento lunchboxes, airtight canisters, and daily kitchen essentials made from durable agricultural rice husk composite."
    };
  }

  if (cat.includes("drink")) {
    return {
      badge: "Drinkware Collection",
      title: "Sustainable Drinkware & Tumbler Sets",
      desc: "Lightweight, unbreakable, and heat-resistant drinkware made with rice husk and bamboo fibers for daily enterprise use."
    };
  }

  if (cat.includes("home") || cat.includes("living")) {
    return {
      badge: "Home & Living",
      title: "Sustainable Home & Living Essentials",
      desc: "Eco-friendly tabletop planters, organizers, and home decor pieces crafted with agricultural crop-waste composite."
    };
  }

  if (cat.includes("stor") || cat.includes("organ")) {
    return {
      badge: "Storage & Organizers",
      title: "Eco Storage & Desk Organizers",
      desc: "Durable multipurpose storage caddies, organizers, and baskets made with natural biocomposite materials."
    };
  }

  return {
    badge: "Enterprise Catalog",
    title: "Wholesale Products & Bulk Supplies",
    desc: "Discover certified food-safe, upcycled rice-husk homeware engineered for daily enterprise use, hotel hospitality, and custom branded bulk orders."
  };
}

export default async function ProductsPage({ searchParams = {} } = {}) {
  const { q = "", category = "", type = "", context = "" } = searchParams || {};
  const searchTerm = q.toLowerCase().trim();

  const activeOccasionParam = type || context || null;
  const activeContext = activeOccasionParam ? normalizeContextKey(activeOccasionParam) : null;

  const allProducts = await getProducts(activeContext);
  const headerInfo = getPageHeaderContent({ category, type, context });

  const filtered = allProducts.filter((p) => {
    const targetOccasion = type || context;

    let matchesCategory = true;
    if (targetOccasion) {
      const occKey = targetOccasion.toLowerCase().replace(/[^a-z0-9]/g, "");
      const pCategory = (typeof p.category === "string" ? p.category : p.category?.name || "").toLowerCase();
      const pSubCategory = (typeof p.subCategory === "string" ? p.subCategory : p.subCategory?.name || "").toLowerCase();
      const pOccasions = (Array.isArray(p.occasions) ? p.occasions : []).map((o) => o.toLowerCase());
      const pTags = (Array.isArray(p.tags) ? p.tags : []).map((t) => t.toLowerCase());

      matchesCategory =
        pCategory.includes(occKey) ||
        pSubCategory.includes(occKey) ||
        pOccasions.some((o) => o.replace(/[^a-z0-9]/g, "").includes(occKey) || occKey.includes(o.replace(/[^a-z0-9]/g, ""))) ||
        pTags.some((t) => t.replace(/[^a-z0-9]/g, "").includes(occKey) || occKey.includes(t.replace(/[^a-z0-9]/g, "")));
    } else if (category && category !== "All Products") {
      matchesCategory = matchesProductCategory(p, category);
    }

    const matchesSearch =
      !searchTerm ||
      `${p.name} ${p.sku} ${p.category} ${p.tagline || ""} ${p.desc}`.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });


  return (
    <div className="w-full max-w-full overflow-hidden pb-12 sm:pb-16 space-y-6">
      {/* Full Width Hero Swiper (PPT Slides Banner) */}
      <section className="w-full max-w-full overflow-hidden">
        <HeroSwiper />
      </section>

      <div id="products-catalog" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Dynamic Page Header */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="badge-green">
            {headerInfo.badge}
          </div>
          <h1 className="page-title">
            {headerInfo.title}
          </h1>
          <p className="page-desc">
            {headerInfo.desc}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              {categories.map((c) => {
                const isAll = c === "All Products";
                const cLower = c.toLowerCase();
                const catLower = (category || "").toLowerCase();

                // Active state determination
                let isActive = false;
                if (isAll) {
                  isActive = (!category || category === "All Products") && !type && !context;
                } else if (cLower.includes("gift") || cLower.includes("hamper")) {
                  isActive = (catLower.includes("gift") || catLower.includes("hamper")) && !type && !context;
                } else if (cLower.includes("table")) {
                  isActive = catLower.includes("table") && !type && !context;
                } else if (cLower.includes("kitch")) {
                  isActive = (catLower.includes("kitchen") || catLower.includes("dining")) && !type && !context;
                } else if (cLower.includes("drink")) {
                  isActive = catLower.includes("drink") && !type && !context;
                } else if (cLower.includes("home") || cLower.includes("living")) {
                  isActive = (catLower.includes("home") || catLower.includes("living")) && !type && !context;
                } else if (cLower.includes("storage") || cLower.includes("organ")) {
                  isActive = (catLower.includes("storage") || catLower.includes("organ")) && !type && !context;
                } else {
                  isActive = catLower === cLower && !type && !context;
                }

                const targetHref = isAll
                  ? `/products${q ? `?q=${encodeURIComponent(q)}` : ""}`
                  : `/products?category=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

                return (
                  <Link
                    key={c}
                    href={targetHref}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${isActive
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
              {type && <input type="hidden" name="type" value={type} />}
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <input
                name="q"
                defaultValue={q}
                placeholder="Search products or categories..."
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
              {type && <span> • Occasion: <strong className="text-slate-900 capitalize">{type}</strong></span>}
              {q && <span> matching &ldquo;<strong className="text-slate-900">{q}</strong>&rdquo;</span>}
            </div>
            {(q || type || context || (category && category !== "All Products")) && (
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((p) => (
              <Card key={p.slug} p={p} context={activeContext} />
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

        {/* Bespoke Enterprise Notice - Premium Executive Card */}
        <div className="pt-10 sm:pt-16 pb-4">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#D9FAE9] border border-emerald-200/90 px-6 sm:px-10 py-10 sm:py-12 text-center shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            {/* Soft ambient accents */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/60 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-xl">
              <Leaf className="mx-auto h-7 w-7 text-emerald-800" strokeWidth={1.8} />

              <p className="mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900">
                B2B Inquiries & Custom Orders
              </p>

              <h3 className="mt-2.5 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                Have Any Query? We're Happy to Help
              </h3>

              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 font-normal max-w-lg mx-auto">
                Exploring options for your business? Share your requirement, whether it is bulk orders, custom colors, logo branding or packaging, and our team will get back to you with the right solution and pricing.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <Link
                  href="#products-catalog"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-700 hover:bg-brand-800 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
                >
                  <ArrowUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Explore Products</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300/80 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 shadow-xs transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20"
                >
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-700" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
