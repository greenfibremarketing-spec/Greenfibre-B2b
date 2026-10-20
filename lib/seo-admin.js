import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db, persistentDb } from "@/lib/db";
import { SEO_ADMIN_EMAIL } from "@/lib/seo-config";

export async function getSeoAdmin(request) {
  const secret = process.env.JWT_SECRET;
  // The application's legacy public fallback secret must not grant admin access.
  if (!secret || secret.length < 32 || secret === "greenfibre_b2b_secret_key_2024" || secret.startsWith("replace-with-")) return null;
  const authorization = request?.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : (request ? request.cookies.get("b2b_token")?.value : cookies().get("b2b_token")?.value);
  if (!token) return null;
  let payload;
  try {
    ({ payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] }));
  } catch { return null; }
  if (typeof payload.email !== "string" || typeof payload.userId !== "string") return null;
  const allowed = (process.env.SEO_ADMIN_EMAILS || SEO_ADMIN_EMAIL).split(",").map((email) => email.trim().toLowerCase());
  if (!allowed.includes(payload.email.toLowerCase())) return null;
  const database = process.env.NODE_ENV === "production" ? await persistentDb() : await db();
  const user = await database.collection("b2b_users").findOne({ email: payload.email });
  if (!user || String(user._id) !== payload.userId) return null;
  return allowed.includes(user.email.toLowerCase()) ? user : null;
}

export function assertSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    throw new Error("Invalid request origin.");
  }
}
