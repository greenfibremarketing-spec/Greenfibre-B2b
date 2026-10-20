import { readSeoSettings } from "@/lib/seo-store";
import { resolveSeoMetadata } from "@/lib/seo-config";

export async function applySeoSettings(pagePath, baseMetadata) {
  try {
    return resolveSeoMetadata(pagePath, baseMetadata, await readSeoSettings(pagePath));
  } catch (error) {
    console.error("[SEO] Unable to load saved metadata:", error.message);
    return resolveSeoMetadata(pagePath, baseMetadata);
  }
}
