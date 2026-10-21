import { NextResponse } from "next/server";
import { resolveCategorySlug } from "@/lib/categories";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Recover links created by the old customer signup redirect.
  const destination = request.nextUrl.searchParams.get("redirect") || "";
  if ((pathname === "/signup" || pathname === "/login") && /^\/status(?:\/|$)/.test(destination)) {
    return NextResponse.redirect(new URL("/status/login", request.url));
  }

  // SEO routes perform JWT and administrator checks on the server. Let them
  // handle missing/expired sessions before the customer registration redirect.
  if (pathname === "/status" || pathname.startsWith("/status/")) {
    if (pathname !== "/status/login" && !request.cookies.get("b2b_token")?.value) {
      return NextResponse.redirect(new URL("/status/login", request.url));
    }
    return NextResponse.next();
  }

  // Public paths that do not require authentication
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.endsWith(".html");

  if (isPublicAsset) {
    return NextResponse.next();
  }

  // 301 Permanent redirect from alias /our-story to canonical /story
  if (pathname === "/our-story") {
    const dest = new URL("/story", request.url);
    return NextResponse.redirect(dest, { status: 301 });
  }

  // 301 Permanent redirect from legacy /products?category=<Name> to clean /category/<slug>
  if (pathname === "/products" && request.nextUrl.searchParams.has("category")) {
    const categoryParam = request.nextUrl.searchParams.get("category");
    if (
      categoryParam &&
      categoryParam.trim() &&
      categoryParam !== "All Products" &&
      categoryParam.toLowerCase() !== "all"
    ) {
      const slug = resolveCategorySlug(categoryParam);
      if (slug) {
        const dest = new URL(`/category/${slug}`, request.url);
        return NextResponse.redirect(dest, { status: 301 });
      }
    }
  }

  // Check for b2b_token in cookies
  const token = request.cookies.get("b2b_token")?.value;
  const isAuthenticated = Boolean(token && token.trim().length > 0);

  // Public pages that do not require authentication for browsing
  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/corporate-gifting") ||
    pathname.startsWith("/custom-branded-water-bottles") ||
    pathname.startsWith("/diwali-corporate-gifts") ||
    pathname.startsWith("/story") ||
    pathname.startsWith("/our-story") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/quote") ||
    pathname.startsWith("/contact") ||
    isAuthPage;

  // If user is NOT authenticated and trying to access strictly protected routes (e.g. /quote)
  if (!isAuthenticated && !isPublicPage) {
    const signupUrl = new URL("/signup", request.url);
    signupUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signupUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico|txt|xml|woff2?|html)$).*)"
  ]
};
