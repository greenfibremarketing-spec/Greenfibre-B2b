import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSeoAdmin, assertSameOrigin } from "@/lib/seo-admin";
import { getSeoPages, validSeoPath } from "@/lib/seo-pages";
import { validateSeoSettings, resolveSeoMetadata, seoMetadataToForm } from "@/lib/seo-config";
import { getPageSeoDefaults } from "@/lib/seo-defaults";
import { readSeoSettings, saveSeoSettings } from "@/lib/seo-store";

export const dynamic = "force-dynamic";
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

export async function GET(request) {
  try {
    if (!await getSeoAdmin(request)) return json({ error: "SEO administrator access required." }, 403);
    const pagePath = new URL(request.url).searchParams.get("path") || "/";
    if (!await validSeoPath(pagePath)) return json({ error: "Page not found." }, 404);
    const [saved, baseMetadata] = await Promise.all([readSeoSettings(pagePath), getPageSeoDefaults(pagePath)]);
    const defaults = seoMetadataToForm(resolveSeoMetadata(pagePath, baseMetadata));
    const effective = seoMetadataToForm(resolveSeoMetadata(pagePath, baseMetadata, saved), saved?.focusKeyword || "");
    const pages = new URL(request.url).searchParams.has("pages") ? await getSeoPages() : undefined;
    return json({ settings: saved || defaults, defaults, baseMetadata, effective, source: saved ? "saved" : "defaults", pages, updatedAt: saved?.updatedAt || null });
  } catch (error) {
    console.error("[SEO GET]", error);
    return json({ error: "SEO settings are unavailable. Please try again." }, 503);
  }
}

export async function PUT(request) {
  try {
    const admin = await getSeoAdmin(request);
    if (!admin) return json({ error: "SEO administrator access required." }, 403);
    try { assertSameOrigin(request); } catch (error) { return json({ error: error.message }, 403); }
    let body;
    try {
      const raw = await request.text();
      if (raw.length > 24000) return json({ error: "SEO settings are too large." }, 413);
      body = JSON.parse(raw);
    } catch { return json({ error: "Invalid JSON payload." }, 400); }
    if (!await validSeoPath(body.path)) return json({ error: "Page not found." }, 404);
    let settings;
    try { settings = validateSeoSettings(body.settings); } catch (error) { return json({ error: error.message }, 422); }
    const saved = await saveSeoSettings(body.path, settings, admin.email);
    revalidatePath(body.path);
    revalidatePath("/sitemap.xml");
    const baseMetadata = await getPageSeoDefaults(body.path);
    const effective = seoMetadataToForm(resolveSeoMetadata(body.path, baseMetadata, saved), saved.focusKeyword || "");
    return json({ success: true, updatedAt: saved.updatedAt, settings: saved, effective, baseMetadata });
  } catch (error) {
    console.error("[SEO PUT]", error);
    return json({ error: "Could not save SEO settings. Please try again; your changes have not been published." }, 503);
  }
}
