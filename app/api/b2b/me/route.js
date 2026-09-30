import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : req.cookies.get("b2b_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "greenfibre_b2b_secret_key_2024"
    );

    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    // Look up user in MongoDB
    const database = await db();
    const users = database.collection("b2b_users");

    let user = null;
    if (payload.userId) {
      try {
        user = await users.findOne({ _id: new ObjectId(payload.userId) });
      } catch {
        user = await users.findOne({ email: payload.email });
      }
    }

    if (!user) {
      user = await users.findOne({ email: payload.email });
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const safeUser = {
      _id: user._id.toString(),
      fullName: user.fullName || user.full_name || "",
      email: user.email,
      companyName: user.companyName || "",
      phone: user.phone || "",
      businessType: user.businessType || "",
      gstin: user.gstin || "",
      role: user.role || "b2b_client",
      isB2BVerified: user.isB2BVerified ?? true,
      accountType: "B2B",
    };

    return NextResponse.json({ success: true, user: safeUser }, { status: 200 });
  } catch (err) {
    console.error("[B2B /me]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
