import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function sanitizeEmail(val) {
  if (!val) return "";
  let clean = String(val).trim().toLowerCase();
  clean = clean.replace(/,([a-zA-Z0-9-]+)/g, ".$1");
  clean = clean.replace(/,/g, ".");
  return clean;
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = sanitizeEmail(body.email);
    const otp = String(body.otp || "").trim();
    const type = body.type || "registration";

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const database = await db();
    const otps = database.collection("b2b_otps");

    const record = await otps.findOne({ email, type });

    if (!record) {
      return NextResponse.json(
        { success: false, message: "No verification code found. Please request a new code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(record.expiresAt)) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if ((record.attempts || 0) >= 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many failed attempts. Please request a new verification code."
        },
        { status: 429 }
      );
    }

    if (record.otp !== otp) {
      await otps.updateOne(
        { _id: record._id },
        { $inc: { attempts: 1 } }
      );
      return NextResponse.json(
        { success: false, message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Mark as verified
    await otps.updateOne(
      { _id: record._id },
      { $set: { verified: true, verifiedAt: new Date() } }
    );

    return NextResponse.json(
      { success: true, message: "Verification code verified successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[OTP Verify Error]", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to verify code." },
      { status: 500 }
    );
  }
}
