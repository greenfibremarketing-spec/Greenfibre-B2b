import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendContactFormEmail } from "@/lib/email";
import {
  validateEmail,
  validateIndianPhone,
  formatIndianPhone
} from "@/lib/validation";

const hits = new Map();

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const h = (hits.get(ip) || []).filter((t) => now - t < 600000);

    // Rate limit: 30 requests per 10 minutes
    if (h.length >= 30) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }
    hits.set(ip, [...h, now]);

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    if (!body || body.website) {
      // Honeypot caught spam
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    const s = (k, n = 300) => String(body[k] || "").trim().slice(0, n);

    const contactData = {
      name: s("name", 150),
      company: s("company", 150),
      email: s("email", 150),
      phone: s("phone", 50),
      city: s("city", 100),
      inquiryType: s("inquiryType", 100) || "Bulk Wholesale Order",
      quantity: s("quantity", 100) || "50 - 250 units",
      message: s("message", 3000),
      createdAt: new Date(),
      status: "New"
    };

    if (!contactData.name || !contactData.company) {
      return NextResponse.json(
        { error: "Please provide both your name and company/organization name." },
        { status: 422 }
      );
    }

    if (!validateEmail(contactData.email)) {
      return NextResponse.json(
        { error: "Please enter a valid business/corporate email address (e.g. name@company.com)." },
        { status: 422 }
      );
    }

    if (!validateIndianPhone(contactData.phone)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit Indian phone number starting with 6, 7, 8, or 9 (e.g. +91 98765 43210)." },
        { status: 422 }
      );
    }

    // Format phone cleanly
    contactData.phone = formatIndianPhone(contactData.phone);

    // Attempt to store in MongoDB collection "contacts" / "b2b_inquiries"
    try {
      const database = await db();
      await database.collection("b2b_contacts").insertOne(contactData);
    } catch (dbErr) {
      console.error("[MongoDB Contact Save Error] (non-fatal):", dbErr.message);
    }

    // Send email notification to Admin and confirmation to Client
    try {
      await sendContactFormEmail({
        name: contactData.name,
        company: contactData.company,
        email: contactData.email,
        phone: contactData.phone,
        city: contactData.city,
        inquiryType: contactData.inquiryType,
        quantity: contactData.quantity,
        message: contactData.message
      });
    } catch (emailErr) {
      console.error("[Contact Email Error] (non-fatal):", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been successfully received. We will get back to you within 2-4 business hours."
    });
  } catch (err) {
    console.error("Contact Form API Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your inquiry. Please contact us directly via WhatsApp or phone." },
      { status: 500 }
    );
  }
}
