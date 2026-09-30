import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const category = searchParams.get("category") || "";

    const allProducts = await getProducts();

    const filtered = allProducts.filter((p) => {
      const matchesCategory = !category || category === "All Products" || p.category === category;
      const matchesSearch =
        !q ||
        `${p.name} ${p.sku} ${p.category} ${p.tagline || ""} ${p.desc}`.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    return NextResponse.json({ success: true, products: filtered });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message, products: [] },
      { status: 500 }
    );
  }
}
