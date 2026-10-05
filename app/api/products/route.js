import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const category = searchParams.get("category") || "";

    const allProducts = await getProducts();

    if (!q && (!category || category === "All Products")) {
      return NextResponse.json({ success: true, products: allProducts });
    }

    const searchTokens = q ? q.split(/\s+/).filter(Boolean) : [];

    const filtered = allProducts.filter((p) => {
      const matchesCategory = !category || category === "All Products" || p.category === category;
      if (!matchesCategory) return false;

      if (!q) return true;

      const name = (p.name || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      const cat = (typeof p.category === "string" ? p.category : p.category?.name || "").toLowerCase();
      const subCat = (typeof p.subCategory === "string" ? p.subCategory : p.subCategory?.name || "").toLowerCase();
      const tagline = (p.tagline || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      const tags = (Array.isArray(p.tags) ? p.tags.join(" ") : "").toLowerCase();
      const occasions = (Array.isArray(p.occasions) ? p.occasions.join(" ") : "").toLowerCase();
      const slug = (p.slug || "").toLowerCase().replace(/-/g, " ");

      const fullSearchableText = `${name} ${sku} ${cat} ${subCat} ${tagline} ${desc} ${tags} ${occasions} ${slug}`;

      // 1. Direct exact query substring match
      if (fullSearchableText.includes(q)) return true;

      // 2. All tokens match somewhere in product
      if (searchTokens.length > 1 && searchTokens.every((token) => fullSearchableText.includes(token))) {
        return true;
      }

      // 3. Partial keyword match on name, category or slug
      if (searchTokens.some((token) => token.length >= 2 && (name.includes(token) || cat.includes(token) || slug.includes(token)))) {
        return true;
      }

      return false;
    });

    // Score & Rank: Exact name match > Starts with name > Partial name match > Other matches
    if (q) {
      filtered.sort((a, b) => {
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();
        const aExact = aName === q ? 100 : aName.startsWith(q) ? 50 : aName.includes(q) ? 25 : 0;
        const bExact = bName === q ? 100 : bName.startsWith(q) ? 50 : bName.includes(q) ? 25 : 0;
        return bExact - aExact;
      });
    }

    return NextResponse.json({ success: true, products: filtered });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message, products: [] },
      { status: 500 }
    );
  }
}
