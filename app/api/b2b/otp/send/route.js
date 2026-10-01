import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";

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
    const type = body.type || "registration"; // "registration" | "forgot_password"
    const userName = (body.fullName || body.userName || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid corporate work email address." },
        { status: 400 }
      );
    }

    if (!["registration", "forgot_password"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP request type." },
        { status: 400 }
      );
    }

    const database = await db();
    const users = database.collection("b2b_users");
    const otps = database.collection("b2b_otps");

    const existingUser = await users.findOne({ email });

    if (type === "registration" && existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An enterprise account with this email is already registered. Please sign in instead."
        },
        { status: 409 }
      );
    }

    if (type === "forgot_password" && !existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "No registered enterprise account found with this work email address."
        },
        { status: 404 }
      );
    }

    // Rate Limiting / 60s cooldown check
    const existingOtp = await otps.findOne({ email, type });
    if (existingOtp && existingOtp.createdAt) {
      const elapsedMs = Date.now() - new Date(existingOtp.createdAt).getTime();
      if (elapsedMs < 60000) {
        const waitSec = Math.ceil((60000 - elapsedMs) / 1000);
        return NextResponse.json(
          {
            success: false,
            message: `Please wait ${waitSec}s before requesting a new verification code.`
          },
          { status: 429 }
        );
      }
    }

    // Generate 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert into b2b_otps collection
    await otps.updateOne(
      { email, type },
      {
        $set: {
          email,
          type,
          otp,
          expiresAt,
          createdAt: new Date(),
          attempts: 0,
          verified: false
        }
      },
      { upsert: true }
    );

    // Send email using SMTP Nodemailer service
    const resolvedName = userName || existingUser?.fullName || existingUser?.full_name || "";
    const emailResult = await sendOtpEmail({
      to: email,
      otp,
      type,
      userName: resolvedName
    });

    return NextResponse.json(
      {
        success: true,
        message: `A 6-digit verification code has been sent to ${email}.`,
        devMode: Boolean(emailResult?.devMode)
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[OTP Send Error]", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to generate verification code. Please try again."
      },
      { status: 500 }
    );
  }
}
