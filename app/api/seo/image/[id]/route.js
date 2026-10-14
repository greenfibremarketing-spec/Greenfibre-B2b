import { readSeoImage } from "@/lib/seo-store";

export async function GET(request, { params }) {
  if (!/^[a-f0-9-]{36}$/.test(params.id)) return new Response("Not found", { status: 404 });
  try {
    const image = await readSeoImage(params.id);
    if (!image) return new Response("Not found", { status: 404 });
    return new Response(image.bytes, { headers: { "Content-Type": image.contentType, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response("Image unavailable", { status: 503 }); }
}
