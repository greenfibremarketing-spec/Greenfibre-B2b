"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Menu,
  X,
  Gift,
  Package,
  Sprout,
  ShoppingBag,
  ArrowRight,
  Phone,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Cake,
  Heart,
  Building2,
  Home,
  Star
} from "lucide-react";
import NavbarSearch from "./NavbarSearch";
import UserNav from "./UserNav";
import { Count } from "./Quote";

const giftingCategories = [
  {
    label: "Corporate",
    desc: "Branded bulk gifting for offices",
    icon: Briefcase,
    href: "/products?category=Gifting&type=corporate",
    color: "bg-emerald-50 text-emerald-700"
  },
  {
    label: "Anniversary",
    desc: "Celebrate milestones with elegance",
    icon: Heart,
    href: "/products?category=Gifting&type=anniversary",
    color: "bg-rose-50 text-rose-600"
  },
  {
    label: "Birthday",
    desc: "Thoughtful eco gifts for birthdays",
    icon: Cake,
    href: "/products?category=Gifting&type=birthday",
    color: "bg-amber-50 text-amber-600"
  },
  {
    label: "Institutional",
    desc: "Schools, hospitals & org gifting",
    icon: Building2,
    href: "/products?category=Gifting&type=institutional",
    color: "bg-blue-50 text-blue-600"
  },
  {
    label: "House Warming",
    desc: "Sustainable gifts for new homes",
    icon: Home,
    href: "/products?category=Gifting&type=housewarming",
    color: "bg-orange-50 text-orange-600"
  },
  {
    label: "Wedding",
    desc: "Premium sets for the big day",
    icon: Star,
    href: "/products?category=Gifting&type=wedding",
    color: "bg-purple-50 text-purple-600"
  }
];

function NavbarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [giftingOpen, setGiftingOpen] = useState(false);
  const [mobileGiftingOpen, setMobileGiftingOpen] = useState(false);
  const giftingTimeout = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setGiftingOpen(false);
  }, [pathname, searchParams]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleGiftingMouseEnter = () => {
    if (giftingTimeout.current) clearTimeout(giftingTimeout.current);
    setGiftingOpen(true);
  };

  const handleGiftingMouseLeave = () => {
    giftingTimeout.current = setTimeout(() => {
      setGiftingOpen(false);
    }, 120);
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const categoryParam = searchParams ? searchParams.get("category") || "" : "";
  const typeParam = searchParams ? searchParams.get("type") || "" : "";
  const catLower = categoryParam.toLowerCase();

  const isGiftingCategory =
    catLower.includes("gift") ||
    Boolean(typeParam) ||
    ["corporate", "anniversary", "birthday", "institutional", "housewarming", "house warming", "wedding"].includes(catLower);

  const isAllProductsActive =
    pathname.startsWith("/products") && !isGiftingCategory;
  const isGiftingActive =
    pathname.startsWith("/products") && isGiftingCategory;
  const isStoryActive = pathname === "/story";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">

          {/* LEFT: Logo + Nav */}
          <div className="flex items-center gap-4 sm:gap-6 xl:gap-8 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center group select-none flex-shrink-0"
              aria-label="Green Fibre Home"
            >
              <img
                src="/images/logo.png"
                alt="Green Fibre Sustainable Living Logo"
                className="h-12 sm:h-14 w-auto max-w-[200px] object-contain group-hover:scale-105 transition-transform flex-shrink-0 py-0.5"
              />
            </Link>

            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700"
              aria-label="Main Navigation"
            >
              {/* All Products */}
              <Link
                href="/products"
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-[13px] xl:text-sm font-semibold transition-all duration-150 relative ${isAllProductsActive
                    ? "text-brand-900 bg-brand-50/80 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
              >
                <span className="relative z-10">All Products</span>
                {isAllProductsActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-600 rounded-full" />
                )}
              </Link>

              {/* Gifting with hover dropdown */}
              <div
                className="relative"
                onMouseEnter={handleGiftingMouseEnter}
                onMouseLeave={handleGiftingMouseLeave}
              >
                <Link
                  href="/products?category=Gifting"
                  className={`flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg text-[13px] xl:text-sm font-semibold transition-all duration-150 relative ${isGiftingActive
                      ? "text-brand-900 bg-brand-50/80 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                >
                  <span className="relative z-10">Gifting</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${giftingOpen ? "rotate-180" : "rotate-0"
                      }`}
                  />
                  {isGiftingActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-600 rounded-full" />
                  )}
                </Link>

                {/* Dropdown */}
                <div
                  className={`absolute top-full left-0 mt-2 w-72 transition-all duration-200 ease-out origin-top-left z-50 ${giftingOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                >
                  {/* Invisible hover bridge */}
                  <div className="absolute -top-2 left-0 right-0 h-2" />
                  <div
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xl shadow-slate-900/10"
                  >
                    {/* Dropdown header */}
                    <div className="px-3.5 py-3 border-b border-slate-100 bg-gradient-to-r from-brand-50/70 to-emerald-50/40">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center shadow-xs">
                          <Gift className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">Gifting Occasions</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Eco gifts for every moment</p>
                        </div>
                      </div>
                    </div>

                    {/* Straight Vertical List */}
                    <div className="p-1.5 space-y-0.5">
                      {giftingCategories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.label}
                            href={cat.href}
                            className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-all duration-150 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${cat.color}`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 group-hover:text-brand-700 transition-colors leading-tight">
                                  {cat.label}
                                </p>
                                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                  {cat.desc}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1.5" />
                          </Link>
                        );
                      })}
                    </div>

                    {/* Footer CTA */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                      <Link
                        href="/products?category=Gifting"
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-700 hover:text-brand-900 hover:bg-brand-50/70 transition-colors group"
                      >
                        <span>Browse all gifting products</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Our Story */}
              <Link
                href="/story"
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-[13px] xl:text-sm font-semibold transition-all duration-150 relative ${isStoryActive
                    ? "text-brand-900 bg-brand-50/80 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
              >
                <span className="relative z-10">Our Story</span>
                {isStoryActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-600 rounded-full" />
                )}
              </Link>
            </nav>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <NavbarSearch />
            <UserNav />
            <Link
              href="/quote"
              className="btn-primary flex items-center gap-2 shadow-xs hover:shadow-md text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-xl flex-shrink-0 transition-all active:scale-95"
              aria-label="View Wholesale Quote Basket"
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">Quote Basket</span>
              <Count />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
            <div>
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <img
                  src="/images/logo.png"
                  alt="Green Fibre Logo"
                  className="h-11 w-auto max-w-[150px] object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-1.5">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Menu Navigation
                </div>

                {/* All Products */}
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${isAllProductsActive
                      ? "bg-brand-50 text-brand-900 font-bold border border-brand-200/80"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAllProductsActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">All Products</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                {/* Gifting expandable */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileGiftingOpen(!mobileGiftingOpen)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isGiftingActive
                        ? "bg-brand-50 text-brand-900 font-bold border border-brand-200/80"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isGiftingActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Gift className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">Gifting</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileGiftingOpen ? "rotate-180" : ""}`} />
                  </button>

                  {mobileGiftingOpen && (
                    <div className="mt-1.5 ml-4 space-y-1 border-l-2 border-brand-100 pl-3">
                      {giftingCategories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.label}
                            href={cat.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-brand-700 transition-all"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold leading-tight">{cat.label}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{cat.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Our Story */}
                <Link
                  href="/story"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${isStoryActive
                      ? "bg-brand-50 text-brand-900 font-bold border border-brand-200/80"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isStoryActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <Sprout className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">Our Story</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Factory highlights */}
              <div className="p-4 mx-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-700" />
                  <span>Enterprise B2B Supply</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                    <span>100% Upcycled Agricultural Rice Husk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                    <span>In-House Precision Laser Engraving</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                    <span>Pan-India Bulk Logistics Fulfillment</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Direct B2B Desk:</span>
                <a
                  href="tel:+919810844210"
                  className="font-bold text-brand-800 flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 98108 44210</span>
                </a>
              </div>
              <Link
                href="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold rounded-xl shadow-sm"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-18 sm:h-20 bg-white border-b border-slate-200" />}>
      <NavbarInner />
    </Suspense>
  );
}



