"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  ShieldCheck,
  Search,
  LogOut,
  Building,
  Gift,
  Package,
  Sprout,
  Sparkles,
  ChevronRight
} from "lucide-react";
import NavbarSearch from "./NavbarSearch";
import UserNav from "./UserNav";
import { Count } from "./Quote";
import { useAuth } from "./AuthContext";
import styles from "./Navbar.module.css";

function NavbarInner({ canManageSeo = false }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth() || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const isSeoAdmin =
    canManageSeo ||
    Boolean(
      user?.email &&
        (user.email.toLowerCase() === "greenfibre.marketing@gmail.com" ||
          user.role === "admin")
    );

  const isHome = pathname === "/";

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

  if (
    pathname === "/status/login" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  ) {
    return null;
  }

  const categoryParam = searchParams ? searchParams.get("category") || "" : "";
  const typeParam = searchParams ? searchParams.get("type") || "" : "";
  const catLower = categoryParam.toLowerCase();

  const isGiftingCategory =
    catLower.includes("gift") ||
    catLower.includes("hamper") ||
    Boolean(typeParam) ||
    [
      "corporate",
      "anniversary",
      "birthday",
      "institutional",
      "housewarming",
      "house warming",
      "wedding"
    ].includes(catLower);

  const isAllProductsActive =
    pathname === "/products" && !categoryParam && !typeParam;
  const isGiftingActive =
    pathname === "/category/gift-boxes-hampers" ||
    (pathname.startsWith("/products") && isGiftingCategory);
  const isCorporateGiftingActive = pathname === "/corporate-gifting";
  const isStoryActive = pathname === "/story";

  const displayName =
    user?.fullName ||
    user?.full_name ||
    user?.name ||
    user?.companyName ||
    (user?.email ? user.email.split("@")[0] : "Corporate Buyer");

  return (
    <>
      <header className={isHome ? styles.headerHome : styles.headerOther}>
        <div className={styles.pill}>
          {/* LEFT: Logo & Main Navigation Links */}
          <div className={styles.leftSection}>
            <Link
              href="/"
              className={styles.logoLink}
              aria-label="Green Fibre Home"
            >
              <Image
                src="/images/logo.png"
                alt="Green Fibre Sustainable Living Logo"
                width={175}
                height={36}
                priority
                className={styles.logoImg}
              />
            </Link>

            <nav className={styles.navLinks} aria-label="Main">
              <Link
                href="/products"
                className={`${styles.navLink} ${
                  isAllProductsActive ? styles.navLinkActive : ""
                }`}
              >
                All Products
              </Link>
              <Link
                href="/category/gift-boxes-hampers"
                className={`${styles.navLink} ${
                  isGiftingActive ? styles.navLinkActive : ""
                }`}
              >
                Gifts &amp; Hampers
              </Link>
              <Link
                href="/corporate-gifting"
                className={`${styles.navLink} ${
                  isCorporateGiftingActive ? styles.navLinkActive : ""
                }`}
              >
                Corporate Gifting
              </Link>
              <Link
                href="/story"
                className={`${styles.navLink} ${
                  isStoryActive ? styles.navLinkActive : ""
                }`}
              >
                Our Story
              </Link>
              {isSeoAdmin && (
                <Link
                  href="/status"
                  aria-current={pathname === "/status" ? "page" : undefined}
                  className={`${styles.navLink} ${
                    pathname === "/status" ? styles.navLinkActive : ""
                  }`}
                >
                  Status
                </Link>
              )}
            </nav>
          </div>

          {/* RIGHT: Search, Auth, Cart, Mobile Menu Button */}
          <div className={styles.rightSection}>
            {/* Search Box - Hidden at <= 980px */}
            <div className={styles.searchBox}>
              <NavbarSearch />
            </div>

            {/* User Auth Buttons or Dropdown */}
            {isAuthenticated && user ? (
              <UserNav />
            ) : (
              <>
                <Link href="/login" className={styles.signInBtn}>
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className={styles.registerBtn}
                  aria-label="Register B2B Account"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Register B2B</span>
                </Link>
              </>
            )}

            {/* Cart Button: Round Mint Circle with Orange Count Badge */}
            <Link
              href="/quote"
              className={styles.cartBtn}
              aria-label="View Wholesale Quote Basket"
              title="View Quote Basket"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-900" strokeWidth={2} />
              <Count className={styles.cartBadge} />
            </Link>

            {/* Mobile Hamburger Toggle Button - Visible at <= 980px */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={styles.menuBtn}
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

      {/* MOBILE DRAWER (Existing Drawer Preserved Intact) */}
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
                <Image
                  src="/images/logo.png"
                  alt="Green Fibre Logo"
                  width={140}
                  height={28}
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
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-600" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>Register B2B</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Search Bar inside Drawer */}
              <div className="px-4 py-2">
                <form onSubmit={handleMobileSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="search"
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    placeholder="Search wholesale products..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </form>
              </div>

              {/* Navigation Links inside Drawer */}
              <nav className="p-4 space-y-1" aria-label="Mobile Navigation">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isAllProductsActive
                      ? "bg-brand-50 text-brand-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-brand-600" />
                    <span>All Products</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/category/gift-boxes-hampers"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isGiftingActive
                      ? "bg-brand-50 text-brand-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-brand-600" />
                    <span>Gifts &amp; Hampers</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/corporate-gifting"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isCorporateGiftingActive
                      ? "bg-brand-50 text-brand-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    <span>Corporate Gifting</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/story"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isStoryActive
                      ? "bg-brand-50 text-brand-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sprout className="w-4 h-4 text-brand-600" />
                    <span>Our Story</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                {isSeoAdmin && (
                  <Link
                    href="/status"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <span>SEO Admin Status</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                )}
              </nav>

              {/* B2B Benefits Snippet */}
              <div className="mx-4 mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-[11px] text-slate-600">
                <div className="font-bold text-slate-800 text-xs">
                  Wholesale Procurement
                </div>
                <div>✓ 10 units Minimum Order Quantity</div>
                <div>✓ Free 3D Branding Visual Proof</div>
                <div>✓ GST Input Tax Credit Invoices</div>
              </div>
            </div>

            {/* Drawer Footer with Quote CTA */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
              <Link
                href="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Wholesale Quote Basket</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar(props) {
  return (
    <Suspense fallback={<div className="h-16 w-full" />}>
      <NavbarInner {...props} />
    </Suspense>
  );
}
