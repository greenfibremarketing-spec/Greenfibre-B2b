import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

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
    const newPassword = body.newPassword || body.password || "";

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, verification code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const database = await db();
    const users = database.collection("b2b_users");
    const otps = database.collection("b2b_otps");

    // Look up OTP
    const otpRecord = await otps.findOne({ email, type: "forgot_password" });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "No password reset request found. Please request a new code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (otpRecord.otp !== otp && !otpRecord.verified) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Look up user
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found with this email address." },
        { status: 404 }
      );
    }

    const hashedPassword = hashPassword(newPassword);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    // Delete used OTP
    await otps.deleteOne({ _id: otpRecord._id });

    return NextResponse.json(
      {
        success: true,
        message: "Your password has been successfully reset. Please sign in with your new password."
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Reset Password Error]", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to reset password." },
      { status: 500 }
    );
  }
}
