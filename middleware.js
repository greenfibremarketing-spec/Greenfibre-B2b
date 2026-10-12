import { NextResponse } from "next/server";
import { resolveCategorySlug } from "@/lib/categories";

export function middleware(request) {
  const { pathname } = request.nextUrl;

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
    pathname.startsWith("/sitemap.xml");

  if (isPublicAsset) {
    return NextResponse.next();
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

  // If user IS authenticated and visits /login or /signup, redirect them to Home
  if (isAuthenticated && isAuthPage) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico).*)"
  ]
};
