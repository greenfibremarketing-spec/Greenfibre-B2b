"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
  User,
  Search,
  LogOut,
  Building
} from "lucide-react";
import NavbarSearch from "./NavbarSearch";
import UserNav from "./UserNav";
import { Count, useQuote } from "./Quote";
import { useAuth } from "./AuthContext";

function NavbarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth() || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
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

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    const q = mobileSearchQuery.trim();
    if (q) {
      setMobileMenuOpen(false);
      router.push(`/products?q=${encodeURIComponent(q)}`);
    }
  };

  if (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password") {
    return null;
  }

  const categoryParam = searchParams ? searchParams.get("category") || "" : "";
  const typeParam = searchParams ? searchParams.get("type") || "" : "";
  const catLower = categoryParam.toLowerCase();

  const isGiftingCategory =
    catLower.includes("gift") ||
    catLower.includes("hamper") ||
    Boolean(typeParam) ||
    ["corporate", "anniversary", "birthday", "institutional", "housewarming", "house warming", "wedding"].includes(catLower);

  const isAllProductsActive =
    pathname === "/products" && !categoryParam && !typeParam;
  const isGiftingActive =
    pathname.startsWith("/products") && isGiftingCategory;
  const isStoryActive = pathname === "/story";

  const displayName =
    user?.fullName ||
    user?.full_name ||
    user?.name ||
    user?.companyName ||
    (user?.email ? user.email.split("@")[0] : "Corporate Buyer");

  return (
    <>
      <header className="relative z-40 w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-3 transition-all">
        <div className="max-w-[1440px] mx-auto bg-[#fbfdf9]/95 sm:bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full px-4 sm:px-6 h-[60px] sm:h-14 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all">

          {/* LEFT: Logo + Nav */}
          <div className="flex items-center gap-3 sm:gap-6 xl:gap-8 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center h-full group select-none flex-shrink-0 py-1"
              aria-label="Green Fibre Home"
            >
              <img
                src="/images/logo.png"
                alt="Green Fibre Sustainable Living Logo"
                className="h-[36px] sm:h-8 md:h-9 w-auto max-w-[145px] sm:max-w-[175px] object-contain group-hover:scale-105 transition-transform flex-shrink-0"
              />
            </Link>

            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-semibold text-slate-700"
              aria-label="Main Navigation"
            >
              {/* All Products */}
              <Link
                href="/products"
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] xl:text-sm font-semibold transition-all duration-150 relative ${isAllProductsActive
                  ? "text-emerald-950 bg-emerald-50 font-bold border border-emerald-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
              >
                <span className="relative z-10">All Products</span>
              </Link>

              {/* Gifts & Hampers */}
              <Link
                href="/products?category=Gift+Hampers"
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] xl:text-sm font-semibold transition-all duration-150 relative ${isGiftingActive
                  ? "text-emerald-950 bg-emerald-50 font-bold border border-emerald-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
              >
                <span className="relative z-10">Gifts &amp; Hampers</span>
              </Link>

              {/* Our Story */}
              <Link
                href="/story"
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] xl:text-sm font-semibold transition-all duration-150 relative ${isStoryActive
                  ? "text-emerald-950 bg-emerald-50 font-bold border border-emerald-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
              >
                <span className="relative z-10">Our Story</span>
              </Link>
            </nav>
          </div>

          {/* RIGHT: Actions (Search, User, Dark Green Quote Circle, Mobile Hamburger) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <NavbarSearch />
            <UserNav />

            {/* Light Green Circular Quote Basket Icon with Notification Badge */}
            <Link
              href="/quote"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100/90 hover:bg-emerald-200/90 text-emerald-950 border border-emerald-300/80 flex items-center justify-center shadow-xs transition-all duration-200 active:scale-95 flex-shrink-0 group"
              aria-label="View Wholesale Quote Basket"
              title="View Quote Basket"
            >
              <ShoppingBag className="w-4.0 h-4.0 sm:w-5 sm:h-5 text-emerald-900 group-hover:scale-105 transition-transform" strokeWidth={1.8} />
              <span className="absolute -top-1 -right-1 flex items-center justify-center">
                <Count className="bg-[#ea580c] text-white font-black text-[9.5px] sm:text-[10px] min-w-[17px] sm:min-w-[18px] h-[17px] sm:h-[18px] px-1 rounded-full ring-2 ring-white shadow-xs flex items-center justify-center" />
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 bg-white/80 transition-all cursor-pointer shadow-2xs active:scale-95 flex-shrink-0"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" strokeWidth={1.75} />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" strokeWidth={1.75} />
              )}
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
          <div className="fixed top-0 right-0 bottom-0 w-[80vw] sm:w-[75vw] max-w-[360px] sm:max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
            <div>
              {/* Drawer Header with Logo & Close Button */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
                <img
                  src="/images/logo.png"
                  alt="Green Fibre Logo"
                  className="h-7 w-auto object-contain flex-shrink-0"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Account / Profile Card in Sidebar */}
              <div className="p-4 pb-2">
                {isAuthenticated && user ? (
                  <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                        {displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {displayName}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium truncate flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>{user.companyName || "Verified B2B Buyer"}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout?.();
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 flex-shrink-0">
                        <User className="w-4.5 h-4.5 text-emerald-700" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          Corporate B2B Desk
                        </span>
                        <span className="text-[11px] text-slate-500 block leading-tight">
                          Unlock wholesale tier pricing &amp; GST invoices
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <User className="w-3.5 h-3.5 text-slate-600" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Building className="w-3.5 h-3.5 text-white" />
                        <span>Register B2B</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Search Bar */}
              <div className="px-4 pb-2">
                <form onSubmit={handleMobileSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    placeholder="Search eco tableware catalog..."
                    className="w-full h-10 text-xs font-medium pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 flex items-center"
                  />
                  {mobileSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMobileSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
              </div>

              {/* Navigation Menu */}
              <div className="p-4 pt-1 space-y-1.5">
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

                {/* Gifts & Hampers */}
                <Link
                  href="/products?category=Gift+Hampers"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${isGiftingActive
                    ? "bg-brand-50 text-brand-900 font-bold border border-brand-200/80"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isGiftingActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <Gift className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">Gifts &amp; Hampers</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                {/* Quote Basket */}
                <Link
                  href="/quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl transition-all text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-800">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">Quote Basket</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Count className="bg-emerald-600 text-white font-extrabold shadow-xs text-[10px] px-1.5 py-0.5 rounded-full" />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>

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
                  href="tel:+919217328777"
                  className="font-bold text-brand-800 flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 92173 28777</span>
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



