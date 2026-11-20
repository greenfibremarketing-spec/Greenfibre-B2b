import { NextResponse } from "next/server";
import { verifyGstin } from "@/lib/gstinApi";

export const runtime = "nodejs";

// Rate limiting: 10 requests per minute per IP to protect API credits
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

export async function POST(req) {
  try {
    // 1. Rate limiting by client IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const now = Date.now();

    const clientHits = (rateLimitMap.get(ip) || []).filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (clientHits.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          ok: false,
          code: "RATE_LIMITED",
          message: "Too many GST verification requests. Please wait a minute before trying again."
        },
        { status: 429 }
      );
    }

    rateLimitMap.set(ip, [...clientHits, now]);

    // 2. Parse request payload
    let body = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, code: "INVALID_FORMAT", message: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const rawGstin = body?.gstin;
    if (!rawGstin) {
      return NextResponse.json(
        { ok: false, code: "INVALID_FORMAT", message: "GSTIN is required" },
        { status: 400 }
      );
    }

    // 3. Perform live verification via server lib
    const result = await verifyGstin(rawGstin);

    // Return sanitized JSON result
    return NextResponse.json(result);
  } catch (err) {
    console.error("GSTIN Verify Route Error:", err.message);
    return NextResponse.json(
      {
        ok: false,
        soft: true,
        code: "UPSTREAM",
        message: "GST verification could not be completed right now."
      },
      { status: 500 }
    );
  }
}

