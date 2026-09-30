import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { SignJWT } from "jose";

// Hash password using SHA-256 (matches register route hashing)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Sign a JWT token
async function signToken(payload) {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "greenfibre_b2b_secret_key_2024"
  );
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const rawEmail = (body.email || "").trim().toLowerCase();
    const email = rawEmail.replace(/,([a-z0-9-]+)/gi, ".$1").replace(/,/g, ".");
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const database = await db();
    const users = database.collection("b2b_users");

    // Find user by email
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email" },
        { status: 401 }
      );
    }

    // Verify password — supports both SHA-256 hash and plain text (legacy)
    const hashedInput = hashPassword(password);
    const passwordMatch =
      user.password === hashedInput || user.password === password;

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Build user object (exclude password)
    const safeUser = {
      _id: user._id.toString(),
      fullName: user.fullName || user.full_name || "",
      email: user.email,
      companyName: user.companyName || "",
      phone: user.phone || "",
      businessType: user.businessType || "",
      gstin: user.gstin || "",
      role: user.role || "b2b_client",
    };

    const token = await signToken({ userId: safeUser._id, email: safeUser.email });

    const response = NextResponse.json(
      {
        success: true,
        message: "Sign in successful",
        token,
        user: safeUser,
      },
      { status: 200 }
    );

    response.cookies.set("b2b_token", token, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (err) {
    console.error("[B2B Login]", err);
    return NextResponse.json(
      { success: false, message: err.message || "Authentication error" },
      { status: 500 }
    );
  }
}
