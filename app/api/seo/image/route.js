import { NextResponse } from "next/server";
import { getSeoAdmin, assertSameOrigin } from "@/lib/seo-admin";
import { saveSeoImage } from "@/lib/seo-store";

export async function POST(request) {
  try {
    if (!await getSeoAdmin(request)) return NextResponse.json({ error: "SEO administrator access required." }, { status: 403 });
    try { assertSameOrigin(request); } catch (error) { return NextResponse.json({ error: error.message }, { status: 403 }); }
    const max = 5 * 1024 * 1024;
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Choose an image." }, { status: 400 });
    const chunks = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > max) {
        await reader.cancel();
        return NextResponse.json({ error: "Image must be smaller than 5 MB." }, { status: 413 });
      }
      chunks.push(value);
    }
    const bytes = Buffer.concat(chunks);
    let contentType;
    if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) contentType = "image/png";
    else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) contentType = "image/jpeg";
    else if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") contentType = "image/webp";
    if (!contentType) return NextResponse.json({ error: "Upload a PNG, JPEG, or WebP image." }, { status: 422 });
    const url = await saveSeoImage(bytes, contentType);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[SEO image upload]", error);
    return NextResponse.json({ error: "Image could not be saved. Please try again." }, { status: 503 });
  }
}
