import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProduct } from "@/lib/products";
import { generateQuotationPdf } from "@/lib/quotationPdf";
import { sendQuotationEmail } from "@/lib/email";
import {
  validateEmail,
  validateIndianPhone,
  formatIndianPhone,
  validatePinCode
} from "@/lib/validation";

const hits = new Map();

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const h = (hits.get(ip) || []).filter((t) => now - t < 600000);
    
    // Rate limit: 60 requests per 10 minutes
    if (h.length >= 60) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }
    hits.set(ip, [...h, now]);

    let b;
    try {
      b = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    if (!b || b.website) {
      // Honeypot caught spam
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const s = (k, n = 300) => String(b[k] || "").trim().slice(0, n);
    const client = {
      name: s("name"),
      company: s("company"),
      email: s("email"),
      phone: s("phone", 30),
      buyerType: s("buyerType", 100),
      city: s("city", 100),
      pin: s("pin", 10),
      date: s("date", 30),
      gstin: s("gstin", 30),
      notes: s("notes", 5000)
    };

    if (!client.name || client.name.length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid contact name." },
        { status: 422 }
      );
    }

    if (!client.company || client.company.length < 2) {
      return NextResponse.json(
        { error: "Please provide your company or organization name." },
        { status: 422 }
      );
    }

    if (!validateEmail(client.email)) {
      return NextResponse.json(
        { error: "Please provide a valid work/corporate email address (e.g. rahul@company.com)." },
        { status: 422 }
      );
    }

    if (!validateIndianPhone(client.phone)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g. +91 98765 43210)." },
        { status: 422 }
      );
    }

    if (!validatePinCode(client.pin)) {
      return NextResponse.json(
        { error: "Please provide a valid 6-digit Indian PIN code (e.g. 560001)." },
        { status: 422 }
      );
    }

    // Format phone cleanly
    client.phone = formatIndianPhone(client.phone);

    const rawItems = Array.isArray(b.items) ? b.items.slice(0, 50) : [];
    if (!rawItems.length) {
      return NextResponse.json(
        { error: "Please add at least one product to your quote basket." },
        { status: 422 }
      );
    }

    const items = [];
    for (const i of rawItems) {
      let p = null;
      try {
        if (i.slug && i.slug !== "custom") {
          p = await getProduct(i.slug);
        }
      } catch (prodErr) {
        console.warn("getProduct warning:", prodErr.message);
      }

      const qty = Math.max(1, Math.floor(+i.qty || 1));
      const isPairItem = Boolean(i.isPairItem === true || i.isPair === true);
      const minRequired = isPairItem ? 1 : Math.max(10, Number(p?.moq) || 10);

      if (p && !(qty >= minRequired)) {
        return NextResponse.json(
          { error: `${p.name}: Minimum wholesale order quantity is ${minRequired} ${p.unit || "pc"}.` },
          { status: 422 }
        );
      }

      const mrp = +(i.mrp || p?.price || 0);
      const lineGross = mrp * qty;
      // Dynamic Volume Tier Discount: Tier 1 (<=100): 15%, Tier 2 (101–200): 20%, Tier 3 (201+): 25%
      const discountPct = Number(i.discountPct) || (qty >= 201 ? 25 : qty >= 101 ? 20 : 15);
      const tierNumber = Number(i.tierNumber) || (qty >= 201 ? 3 : qty >= 101 ? 2 : 1);
      const lineDiscount = Math.round(lineGross * (discountPct / 100));
      const lineNet = lineGross - lineDiscount;

      items.push({
        slug: p?.slug || i.slug || "custom",
        sku: p?.sku || i.sku || "",
        name: p?.name || i.name || "Green Fibre Eco Product",
        unit: p?.unit || i.unit || "piece",
        colour: String(i.colour || "Standard").slice(0, 40),
        qty,
        mrp,
        lineGross,
        discountPct,
        tierNumber,
        lineDiscount,
        lineNet,
        isPairItem,
        senderName: String(i.senderName || "").slice(0, 100),
        receiverName: String(i.receiverName || "").slice(0, 100),
        giftMessage: String(i.giftMessage || "").slice(0, 500),
        engravingName: String(i.engravingName || "").slice(0, 100),
        customProductName: String(i.customProductName || "").slice(0, 100),
        packagingOption: String(i.packagingOption || "").slice(0, 100),
        brandingNotes: String(i.brandingNotes || "").slice(0, 500),
        selectedCustomizations: Array.isArray(i.selectedCustomizations) ? i.selectedCustomizations : []
      });
    }

    if (!items.length) {
      return NextResponse.json(
        { error: "Please add at least one valid product to your quote basket." },
        { status: 422 }
      );
    }

    // Calculate pricing
    const totalGross = items.reduce((s, it) => s + it.lineGross, 0);
    const totalItemDiscount = items.reduce((s, it) => s + it.lineDiscount, 0);
    const totalUnitsCount = items.reduce((s, it) => s + (it.qty || 0), 0);
    const netSubtotalBeforeBundle = totalGross - totalItemDiscount;

    const hasBundleBonus = Boolean(
      b.hasBundleBonus || (items.some((it) => it.isPairItem) && items.length > 1)
    );
    const bundleBonusAmount = hasBundleBonus ? Math.round(netSubtotalBeforeBundle * 0.05) : 0;
    const estimatedTotal = netSubtotalBeforeBundle - bundleBonusAmount;
    const estimatedGST = Math.round(estimatedTotal * 0.18);
    const totalWithGST = estimatedTotal + estimatedGST;

    const pricing = {
      totalGross,
      totalItemDiscount,
      totalUnitsCount,
      netSubtotalBeforeBundle,
      hasBundleBonus,
      bundleBonusAmount,
      estimatedTotal,
      estimatedGST,
      totalWithGST
    };

    const reference =
      "GF-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    // Generate Official Quotation PDF
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateQuotationPdf({
        reference,
        client,
        items,
        ...pricing
      });
    } catch (pdfErr) {
      console.error("Quotation PDF Generation Error:", pdfErr);
    }

    const enquiryDocument = {
      reference,
      client,
      items,
      pricing,
      userId: b.userId || null,
      isB2BVerified: Boolean(b.isB2BVerified),
      pdfGenerated: Boolean(pdfBuffer),
      status: "New",
      createdAt: new Date()
    };

    // Attempt to save to MongoDB
    try {
      if (process.env.MONGODB_URI) {
        const database = await db();
        await database.collection("enquiries").insertOne(enquiryDocument);
      } else {
        console.log("[DEV MODE] Enquiry received (MONGODB_URI not set):", JSON.stringify(enquiryDocument, null, 2));
      }
    } catch (err) {
      console.error("MongoDB Save Error (non-fatal):", err);
    }

    // Attempt to send email with quotation summary & PDF attachment
    try {
      await sendQuotationEmail({
        to: client.email,
        reference,
        client,
        items,
        pricing,
        pdfBuffer
      });
    } catch (smtpErr) {
      console.error("Enquiry Email Sending Error (non-fatal):", smtpErr);
    }

    return NextResponse.json({
      success: true,
      reference,
      pdfGenerated: Boolean(pdfBuffer)
    });
  } catch (globalErr) {
    console.error("Global /api/enquiry Handler Error:", globalErr);
    return NextResponse.json(
      { error: globalErr.message || "Failed to process quotation request. Please try again." },
      { status: 500 }
    );
  }
}


