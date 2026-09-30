import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { SignJWT } from "jose";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

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
    const fullName = (body.fullName || body.full_name || "").trim();
    const companyName = (body.companyName || "").trim();
    const rawEmail = (body.email || "").trim().toLowerCase();
    const email = rawEmail.replace(/,([a-z0-9-]+)/gi, ".$1").replace(/,/g, ".");
    const phone = (body.phone || "").trim();
    const businessType = body.businessType || "Corporate Gifting & HR";
    const gstin = (body.gstin || "").trim().toUpperCase();
    const password = body.password || "";

    if (!fullName || !companyName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Full name, company name, email and password are required" },
        { status: 400 }
      );
    }

    const database = await db();
    const users = database.collection("b2b_users");

    // Check if email already exists
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);

    const newUser = {
      fullName,
      full_name: fullName,
      companyName,
      email,
      phone,
      businessType,
      gstin,
      password: hashedPassword,
      role: "b2b_client",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    const safeUser = {
      _id: result.insertedId.toString(),
      fullName,
      email,
      companyName,
      phone,
      businessType,
      gstin,
      role: "b2b_client",
    };

    const token = await signToken({ userId: safeUser._id, email: safeUser.email });

    const response = NextResponse.json(
      {
        success: true,
        message: "Enterprise account registered successfully",
        token,
        user: safeUser,
      },
      { status: 201 }
    );

    response.cookies.set("b2b_token", token, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (err) {
    console.error("[B2B Register]", err);
    return NextResponse.json(
      { success: false, message: err.message || "Registration error" },
      { status: 500 }
    );
  }
}
