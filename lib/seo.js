import { unstable_noStore as noStore } from "next/cache";
import { readSeoSettings } from "@/lib/seo-store";
import { mergeSeoMetadata } from "@/lib/seo-config";

export async function applySeoSettings(pagePath, baseMetadata) {
  noStore();
  try {
    return mergeSeoMetadata(baseMetadata, await readSeoSettings(pagePath));
  } catch (error) {
    console.error("[SEO] Unable to load saved metadata:", error.message);
    return baseMetadata;
  }
}
