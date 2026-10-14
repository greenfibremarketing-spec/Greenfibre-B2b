import { NextRequest, NextResponse } from "next/server";
import { POST as signIn } from "@/app/api/b2b/login/route";
import { getSeoAdmin, assertSameOrigin } from "@/lib/seo-admin";
import { SEO_ADMIN_EMAIL } from "@/lib/seo-config";

const errorResponse = (error, status) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request) {
  try {
    try { assertSameOrigin(request); } catch (error) { return errorResponse(error.message, 403); }
    let body;
    try { body = await request.clone().json(); } catch { return errorResponse("Invalid sign-in request.", 400); }
    if (typeof body.email !== "string" || typeof body.password !== "string" || !body.password || body.email.length > 120 || body.password.length > 1024) {
      return errorResponse("Enter your administrator email and password.", 400);
    }
    const allowed = (process.env.SEO_ADMIN_EMAILS || SEO_ADMIN_EMAIL).split(",").map((email) => email.trim().toLowerCase());
    if (!allowed.includes(body.email.trim().toLowerCase())) return errorResponse("This account does not have SEO administrator access.", 403);
    const response = await signIn(request);
    if (!response.ok) return response;
    const data = await response.clone().json();
    const authenticated = new NextRequest(request.url, { headers: { authorization: `Bearer ${data.token}` } });
    if (!await getSeoAdmin(authenticated)) return errorResponse("SEO sign-in is unavailable. Check the server JWT secret and administrator configuration.", 503);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    console.error("[SEO sign-in]", error.message);
    return errorResponse("SEO sign-in is unavailable. Please try again.", 503);
  }
}
