"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import {
  Search,
  Gift,
  Utensils,
  Coffee,
  Home,
  Package,
  LayoutGrid,
  Box,
  Leaf,
  Mail,
  ArrowUp,
  X,
  Sparkles,
  SearchX
} from "lucide-react";

function matchesProductCategory(p, selectedCategory) {
  if (!selectedCategory || selectedCategory === "All Products" || selectedCategory === "all") {
    return true;
  }

  const pCat = (
    typeof p?.category === "string"
      ? p.category
      : p?.category?.name || p?.category?.title || ""
  ).toLowerCase().trim();

  const pSubCat = (
    typeof p?.subCategory === "string"
      ? p.subCategory
      : p?.subCategory?.name || p?.subCategory?.title || ""
  ).toLowerCase().trim();

  const target = selectedCategory.toLowerCase().trim();

  // 1. Direct exact match
  if (pCat === target || pSubCat === target) {
    return true;
  }

  // 2. Gift Hampers / Gifting
  if (target.includes("gift") || target.includes("hamper")) {
    return (
      pCat.includes("gift") ||
      pCat.includes("hamper") ||
      pSubCat.includes("gift") ||
      pSubCat.includes("hamper")
    );
  }

  // 3. Tableware
  if (target.includes("table")) {
    return (
      pCat.includes("table") ||
      pCat.includes("dining") ||
      pSubCat.includes("table") ||
      pSubCat.includes("dining")
    );
  }

  // 4. Kitchenware
  if (target.includes("kitch") || target.includes("dining")) {
    return (
      pCat.includes("kitch") ||
      pCat.includes("dining") ||
      pSubCat.includes("kitch") ||
      pSubCat.includes("dining")
    );
  }

  // 5. Drinkware
  if (target.includes("drink") || target.includes("coffee") || target.includes("cup") || target.includes("mug")) {
    return (
      pCat.includes("drink") ||
      pCat.includes("coffee") ||
      pCat.includes("cup") ||
      pCat.includes("mug") ||
      pSubCat.includes("drink") ||
      pSubCat.includes("coffee") ||
      pSubCat.includes("cup") ||
      pSubCat.includes("mug")
    );
  }

  // 6. Home & Living
  if (target.includes("home") || target.includes("living") || target.includes("planter")) {
    return (
      pCat.includes("home") ||
      pCat.includes("living") ||
      pCat.includes("planter") ||
      pCat.includes("decor") ||
      pSubCat.includes("home") ||
      pSubCat.includes("living") ||
      pSubCat.includes("planter") ||
      pSubCat.includes("decor")
    );
  }

  // 7. Storage & Organizers
  if (target.includes("storage") || target.includes("organ") || target.includes("canister") || target.includes("box")) {
    return (
      pCat.includes("storage") ||
      pCat.includes("organ") ||
      pCat.includes("canister") ||
      pCat.includes("box") ||
      pSubCat.includes("storage") ||
      pSubCat.includes("organ") ||
      pSubCat.includes("canister") ||
      pSubCat.includes("box")
    );
  }

  return pCat.includes(target) || pSubCat.includes(target);
}

const CATEGORY_ICONS = {
  "All Products": LayoutGrid,
  "Gift Hampers": Gift,
  "Tableware": Utensils,
  "Kitchenware": Box,
  "Drinkware": Coffee,
  "Home & Living": Home,
  "Storage & Organizers": Package,
};

const ALL_CATEGORIES = [
  "All Products",
  "Gift Hampers",
  "Tableware",
  "Kitchenware",
  "Drinkware",
  "Home & Living",
  "Storage & Organizers"
];

function getHeaderInfo({ category = "", type = "", context = "" }) {
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
    badge: "Eco Products & Gifting",
    title: "Sustainable Products & Curated Gift Hampers",
    desc: "Certified food-safe, agricultural crop-waste homeware and corporate gifts for bulk orders and eco living."
  };
}

export default function ProductsCatalogView({
  initialProducts = [],
  initialCategory = "",
  initialQuery = "",
  initialType = "",
  initialContext = "",
  activeContext = null
}) {
  const [category, setCategory] = useState(initialCategory || "All Products");
  const [query, setQuery] = useState(initialQuery || "");
  const [isPending, startTransition] = useTransition();

  // Keep browser URL cleanly in sync without triggering full page reloads or full screen loaders
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (category && category !== "All Products") params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    if (initialType) params.set("type", initialType);
    if (initialContext) params.set("context", initialContext);

    const queryString = params.toString();
    const newUrl = queryString ? `/products?${queryString}` : "/products";
    window.history.replaceState(null, "", newUrl);
  }, [category, query, initialType, initialContext]);

  const headerInfo = useMemo(() => {
    return getHeaderInfo({ category, type: initialType, context: initialContext });
  }, [category, initialType, initialContext]);

  const filteredProducts = useMemo(() => {
    const searchTerm = query.toLowerCase().trim();
    const searchTokens = searchTerm ? searchTerm.split(/\s+/).filter(Boolean) : [];
    const targetOccasion = initialType || initialContext;

    const list = initialProducts.filter((p) => {
      // Occasion filter
      if (targetOccasion) {
        const occKey = targetOccasion.toLowerCase().replace(/[^a-z0-9]/g, "");
        const pCategory = (typeof p.category === "string" ? p.category : p.category?.name || "").toLowerCase();
        const pSubCategory = (typeof p.subCategory === "string" ? p.subCategory : p.subCategory?.name || "").toLowerCase();
        const pOccasions = (Array.isArray(p.occasions) ? p.occasions : []).map((o) => o.toLowerCase());
        const pTags = (Array.isArray(p.tags) ? p.tags : []).map((t) => t.toLowerCase());

        const matchesOccasion =
          pCategory.includes(occKey) ||
          pSubCategory.includes(occKey) ||
          pOccasions.some((o) => o.replace(/[^a-z0-9]/g, "").includes(occKey) || occKey.includes(o.replace(/[^a-z0-9]/g, ""))) ||
          pTags.some((t) => t.replace(/[^a-z0-9]/g, "").includes(occKey) || occKey.includes(t.replace(/[^a-z0-9]/g, "")));

        if (!matchesOccasion) return false;
      } else if (category && category !== "All Products") {
        if (!matchesProductCategory(p, category)) return false;
      }

      if (!searchTerm) return true;

      const name = (p.name || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      const cat = (typeof p.category === "string" ? p.category : p.category?.name || "").toLowerCase();
      const subCat = (typeof p.subCategory === "string" ? p.subCategory : p.subCategory?.name || "").toLowerCase();
      const tagline = (p.tagline || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      const tags = (Array.isArray(p.tags) ? p.tags.join(" ") : "").toLowerCase();
      const occasions = (Array.isArray(p.occasions) ? p.occasions.join(" ") : "").toLowerCase();
      const slug = (p.slug || "").toLowerCase().replace(/-/g, " ");

      const fullSearchableText = `${name} ${sku} ${cat} ${subCat} ${tagline} ${desc} ${tags} ${occasions} ${slug}`;

      // 1. Direct exact query substring
      if (fullSearchableText.includes(searchTerm)) return true;

      // 2. All tokens match
      if (searchTokens.length > 1 && searchTokens.every((token) => fullSearchableText.includes(token))) {
        return true;
      }

      // 3. Partial keyword match on name, category or slug
      if (searchTokens.some((token) => token.length >= 2 && (name.includes(token) || cat.includes(token) || slug.includes(token)))) {
        return true;
      }

      return false;
    });

    // Score & Rank relevance
    if (searchTerm) {
      list.sort((a, b) => {
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();
        const aExact = aName === searchTerm ? 100 : aName.startsWith(searchTerm) ? 50 : aName.includes(searchTerm) ? 25 : 0;
        const bExact = bName === searchTerm ? 100 : bName.startsWith(searchTerm) ? 50 : bName.includes(searchTerm) ? 25 : 0;
        return bExact - aExact;
      });
    }

    return list;
  }, [initialProducts, category, query, initialType, initialContext]);

  const handleCategorySelect = (c) => {
    startTransition(() => {
      setCategory(c);
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    startTransition(() => {
      setQuery(val);
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      setCategory("All Products");
      setQuery("");
    });
  };

  const hasActiveFilters = (category && category !== "All Products") || query.trim() !== "" || initialType || initialContext;

  return (
    <div className="w-full max-w-full overflow-hidden pt-3 sm:pt-6 pb-10 sm:pb-16">
      <div id="products-catalog" className="max-w-[1400px] mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Dynamic Premium Green Page Header (Compact & Mobile-Optimized) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1b7a4b] via-[#15803d] to-[#0f5c35] text-white rounded-xl sm:rounded-2xl md:rounded-3xl px-3.5 py-3 sm:px-6 sm:py-5 md:px-8 md:py-7 lg:px-9 lg:py-8 shadow-md shadow-emerald-950/10 border border-emerald-400/30">
          {/* Subtle Eco Ambient Radial Overlays */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,231,183,0.2),transparent_60%)]" />
          <div className="pointer-events-none absolute -right-8 -top-8 sm:-right-16 sm:-top-16 h-36 sm:h-72 w-36 sm:w-72 rounded-full bg-emerald-300/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-6 sm:-bottom-20 sm:-left-12 h-36 sm:h-64 w-36 sm:w-64 rounded-full bg-lime-300/15 blur-2xl" />

          <div className="relative z-10 max-w-3xl space-y-1.5 sm:space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>{headerInfo.badge}</span>
            </div>

            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight sm:leading-snug drop-shadow-2xs">
              {headerInfo.title}
            </h1>

            <p className="text-[11px] sm:text-xs md:text-sm text-emerald-50/90 leading-snug sm:leading-relaxed font-normal max-w-2xl line-clamp-2 sm:line-clamp-none">
              {headerInfo.desc}
            </p>
          </div>
        </div>

        {/* Filter and Search Bar with Categorization Tabs */}
        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
            
            {/* Category Navigation Pills with Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar touch-pan-x">
              {ALL_CATEGORIES.map((c) => {
                const isAll = c === "All Products";
                const cLower = c.toLowerCase();
                const catLower = (category || "").toLowerCase();
                const IconComponent = CATEGORY_ICONS[c] || Sparkles;

                let isActive = false;
                if (isAll) {
                  isActive = (!category || category === "All Products");
                } else if (cLower.includes("gift") || cLower.includes("hamper")) {
                  isActive = catLower.includes("gift") || catLower.includes("hamper");
                } else if (cLower.includes("table")) {
                  isActive = catLower.includes("table");
                } else if (cLower.includes("kitch")) {
                  isActive = catLower.includes("kitchen") || catLower.includes("dining");
                } else if (cLower.includes("drink")) {
                  isActive = catLower.includes("drink");
                } else if (cLower.includes("home") || cLower.includes("living")) {
                  isActive = catLower.includes("home") || catLower.includes("living");
                } else if (cLower.includes("storage") || cLower.includes("organ")) {
                  isActive = catLower.includes("storage") || catLower.includes("organ");
                } else {
                  isActive = catLower === cLower;
                }

                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCategorySelect(c)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 flex-shrink-0 ${
                      isActive
                        ? "bg-[#15803d] text-white shadow-xs ring-2 ring-[#15803d]/30"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs"
                    }`}
                  >
                    <IconComponent className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>

            {/* Instant Client Search Form */}
            <div className="relative flex-shrink-0 w-full lg:w-auto min-w-0 lg:min-w-[280px]">
              <span className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search products..."
                aria-label="Search catalog"
                className="w-full text-xs font-medium pl-8 sm:pl-9 pr-8 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results summary bar */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 pt-2.5 sm:pt-3 border-t border-slate-100">
            <div className="min-w-0 truncate">
              Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "product" : "products"}
              {category && category !== "All Products" && (
                <span> in <strong className="text-slate-900 font-semibold">{category}</strong></span>
              )}
              {initialType && (
                <span> • Occasion: <strong className="text-slate-900 font-semibold capitalize">{initialType}</strong></span>
              )}
              {query.trim() && (
                <span> matching &ldquo;<strong className="text-slate-900 font-semibold">{query.trim()}</strong>&rdquo;</span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] sm:text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline inline-flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <span>✕ Clear filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Products Grid & In-place Skeletons */}
        {isPending ? (
          /* Inline Skeleton Cards while user is actively searching */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="aspect-square bg-slate-100 rounded-lg sm:rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                  <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="h-8 bg-slate-100 rounded-lg w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {filteredProducts.map((p) => (
              <Card key={p.slug} p={p} context={activeContext} />
            ))}
          </div>
        ) : (
          /* Sleek in-place empty state when product not found */
          <div className="bg-white rounded-xl sm:rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-1 shadow-2xs">
              <SearchX className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              We can&apos;t find the product
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find any products matching &ldquo;<strong className="text-slate-800 font-semibold">{query}</strong>&rdquo;. Try searching for &quot;mug&quot;, &quot;bowl&quot;, &quot;bottle&quot;, or exploring the categories above.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#15803d] hover:bg-[#166534] text-white shadow-xs transition-all cursor-pointer active:scale-95"
              >
                View all products
              </button>
            </div>
          </div>
        )}

        {/* Bespoke Enterprise Notice - Premium Executive Consultation Card */}
        <div className="pt-6 sm:pt-10 pb-4">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#D9FAE9] border border-emerald-200/90 px-4 sm:px-8 md:px-10 py-8 sm:py-12 text-center shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            {/* Soft ambient accents */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/60 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-xl">
              <Leaf className="mx-auto h-7 w-7 text-emerald-800" strokeWidth={1.8} />

              <p className="mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900">
                B2B Inquiries & Custom Orders
              </p>

              <h3 className="mt-2.5 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                Have Any Query? We&apos;re Happy to Help
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
