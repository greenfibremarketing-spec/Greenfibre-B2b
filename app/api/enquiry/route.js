import { NextResponse } from "next/server";
import { db, mainDb } from "@/lib/db";
import { getProduct } from "@/lib/products";
import { generateQuotationPdf } from "@/lib/quotationPdf";
import { quotationAttachments } from "@/lib/quotationAttachment";
import { sendQuotationEmail } from "@/lib/email";
import { deductInventoryForOrder } from "@/lib/inventory";
import { validateCartLine } from "@/lib/cartModel";
import {
  validateEmail,
  validateIndianPhone,
  formatIndianPhone,
  validatePinCode
} from "@/lib/validation";

const hits = new Map();
export const runtime = "nodejs";

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
    const productPrimaryTotals = {};

    for (const i of rawItems) {
      let p = null;
      try {
        if (i.slug && i.slug !== "custom") {
          p = await getProduct(i.slug);
        }
      } catch (prodErr) {
        console.warn("getProduct warning:", prodErr.message);
      }

      // ── Strict validation: Require productId, variantId, color, qty, addOn on every line ──
      const lineValidation = validateCartLine({
        ...i,
        productId: i.productId || p?._id || p?.id
      });
      if (!lineValidation.valid) {
        return NextResponse.json(
          { error: lineValidation.error },
          { status: 400 }
        );
      }

      const productId = lineValidation.productId;
      const rawColor = lineValidation.color;
      const qty = lineValidation.qty;
      const isAddon = lineValidation.addOn;

      let variantId = String(i.variantId || "").trim();
      if (!variantId && p && Array.isArray(p.colors) && p.colors.length > 0) {
        const matchedColor = p.colors.find(
          (c) => c && c.name && c.name.trim().toLowerCase() === rawColor.toLowerCase()
        );
        if (matchedColor) {
          variantId = String(matchedColor._id || matchedColor.id || `var-${rawColor}`);
        }
      }
      if (!variantId && p && Array.isArray(p.colors) && p.colors.length > 0) {
        return NextResponse.json(
          { error: `Missing variantId on line item "${i.name || i.slug || 'unknown'}".` },
          { status: 400 }
        );
      }
      if (!variantId) {
        variantId = `var-${rawColor.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      }

      // Track product-level primary totals for MOQ validation
      if (!isAddon) {
        const prodKey = p?.slug || i.slug || productId;
        const minMoq = Math.max(10, Number(p?.moq) || 10);
        if (!productPrimaryTotals[prodKey]) {
          productPrimaryTotals[prodKey] = {
            name: p?.name || i.name || prodKey,
            totalQty: 0,
            requiredMoq: minMoq,
            unit: p?.unit || i.unit || "piece"
          };
        }
        productPrimaryTotals[prodKey].totalQty += qty;
      }

      const mrp = +(i.mrp || p?.price || 0);
      const lineGross = mrp * qty;
      const discountPct = Number(i.discountPct) || (qty >= 201 ? 25 : qty >= 101 ? 20 : 15);
      const tierNumber = Number(i.tierNumber) || (qty >= 201 ? 3 : qty >= 101 ? 2 : 1);
      const lineDiscount = Math.round(lineGross * (discountPct / 100));
      const lineNet = lineGross - lineDiscount;
      const unitPrice = Math.round(mrp * (1 - discountPct / 100));

      const rawImage = i.image || p?.image || (Array.isArray(p?.images) ? p.images[0] : "") || "";
      items.push({
        slug: p?.slug || i.slug || "custom",
        sku: p?.sku || i.raw_sku || i.sku || "GF-B2B",
        raw_sku: i.raw_sku || p?.sku || i.sku || "GF-B2B",
        name: p?.name || i.name || "Green Fibre Eco Product",
        image: rawImage,
        productId,
        variantId,
        channel: "b2b",
        addOn: isAddon,
        unit: p?.unit || i.unit || "piece",
        colour: rawColor,
        color: rawColor,
        colorName: rawColor,
        qty,
        mrp,
        unitPrice,
        price: unitPrice,
        lineGross,
        discountPct,
        tierNumber,
        lineDiscount,
        lineNet,
        isPairItem: isAddon,
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

    // Verify MOQ across product lines (sum of variant quantities >= MOQ)
    for (const key of Object.keys(productPrimaryTotals)) {
      const pTotal = productPrimaryTotals[key];
      if (pTotal.totalQty < pTotal.requiredMoq) {
        return NextResponse.json(
          { error: `${pTotal.name}: Minimum wholesale order quantity is ${pTotal.requiredMoq} ${pTotal.unit} (you have selected ${pTotal.totalQty}).` },
          { status: 422 }
        );
      }
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
      quotationAttachments(pdfBuffer);
    } catch (pdfErr) {
      console.error("Quotation PDF Generation Error:", pdfErr);
      return NextResponse.json({ error: "Could not generate the quotation PDF. Your basket has been kept; please try again." }, { status: 503 });
    }

    // 1. Allocate sequential orderNumber matching the main store's order counter sequence
    let orderNumber = reference;
    try {
      const mainDatabase = await mainDb();
      if (mainDatabase && typeof mainDatabase.collection === "function") {
        const currentYear = new Date().getFullYear();
        const counterResult = await mainDatabase.collection("counters").findOneAndUpdate(
          { _id: `orderNumber_${currentYear}` },
          { $inc: { seq: 1 } },
          { returnDocument: "after", upsert: true }
        );
        const nextSeq = counterResult?.value?.seq || counterResult?.seq;
        if (nextSeq) {
          orderNumber = `GF-${currentYear}-${String(nextSeq).padStart(6, "0")}`;
        }
      }
    } catch (counterErr) {
      console.warn("[Order Counter] Could not increment counter, using reference as orderNumber:", counterErr.message);
    }

    // 2. Build full order document matching greenfibre.orders schema
    const orderDocument = {
      orderNumber,
      reference,
      b2bReference: reference,
      user: b.userId || null,
      orderChannel: "b2b", // Schema field where b2b or b2c is written so dashboard identifies B2B orders
      orderType: "b2b",
      channel: "b2b",
      type: "b2b",
      isB2B: true,
      isB2BOrder: true,
      orderStatus: "pending",
      paymentStatus: "pending",
      paymentMethod: "B2B Purchase Order / Bank Transfer",
      shippingAddress: {
        fullName: client.name,
        companyName: client.company,
        streetAddress: client.city || "Not Provided",
        landmark: client.pin || "",
        city: client.city || "Not Provided",
        state: "",
        pincode: client.pin || "",
        phone: client.phone || "",
        email: client.email || ""
      },
      billingAddress: {
        fullName: client.name,
        companyName: client.company,
        streetAddress: client.city || "Not Provided",
        city: client.city || "Not Provided",
        state: "",
        pincode: client.pin || "",
        phone: client.phone || "",
        email: client.email || "",
        gstin: client.gstin || ""
      },
      totalAmount: pricing.totalGross,
      discountAmount: pricing.totalItemDiscount + (pricing.bundleBonusAmount || 0),
      finalAmount: pricing.totalWithGST,
      estimatedTax: pricing.estimatedGST,
      items: items.map((it) => ({
        product: it.productId || it.slug,
        productId: it.productId,
        variantId: it.variantId,
        slug: it.slug,
        sku: it.raw_sku || it.sku || "GF-B2B",
        raw_sku: it.raw_sku || it.sku || "GF-B2B",
        channel: "b2b",
        addOn: it.addOn,
        name: it.name,
        image: it.image || "",
        colorIndex: 0,
        color: it.colour,
        colour: it.colour,
        colorName: it.colour,
        colorHex: "",
        quantity: it.qty,
        qty: it.qty,
        shippedQuantity: 0,
        price: it.unitPrice || it.price || it.mrp,
        unitPrice: it.unitPrice || it.price || it.mrp,
        mrp: it.mrp,
        discountPct: it.discountPct,
        tierNumber: it.tierNumber,
        discountAmount: it.lineDiscount,
        lineDiscount: it.lineDiscount,
        finalAmount: it.lineNet,
        lineNet: it.lineNet,
        lineGross: it.lineGross,
        unit: it.unit || "piece",
        isPairItem: it.isPairItem,
        customizations: {
          senderName: it.senderName,
          receiverName: it.receiverName,
          giftMessage: it.giftMessage,
          engravingName: it.engravingName,
          customProductName: it.customProductName,
          packagingOption: it.packagingOption,
          brandingNotes: it.brandingNotes,
          selectedCustomizations: it.selectedCustomizations
        }
      })),
      b2bDetails: {
        company: client.company,
        gstin: client.gstin,
        buyerType: client.buyerType,
        requiredBy: client.date,
        notes: client.notes,
        isB2BVerified: Boolean(b.isB2BVerified),
        pdfGenerated: Boolean(pdfBuffer),
        reference
      },
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          note: `B2B Wholesale Order created with PO reference ${reference}`
        }
      ],
      hasStockConflict: false,
      stockDeducted: true,
      stockRestored: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const enquiryDocument = {
      reference,
      orderNumber,
      orderChannel: "b2b",
      orderType: "b2b",
      channel: "b2b",
      type: "b2b",
      isB2B: true,
      client,
      items,
      pricing,
      userId: b.userId || null,
      isB2BVerified: Boolean(b.isB2BVerified),
      pdfGenerated: Boolean(pdfBuffer),
      status: "New",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 3. Persist order & enquiry to databases
    let createdOrderId = null;
    let mainDatabase = null;
    try {
      mainDatabase = await mainDb();
      if (mainDatabase && typeof mainDatabase.collection === "function") {
        const orderInsertRes = await mainDatabase.collection("orders").insertOne(orderDocument);
        createdOrderId = orderInsertRes?.insertedId?.toString() || null;
        console.log(`[Order Backend] Saved B2B order to mainDb.orders: ${orderNumber} (${reference})`);
      }
    } catch (orderErr) {
      console.error("[Order Backend] Failed to write order to mainDb.orders (non-fatal):", orderErr);
    }

    try {
      // Save order & enquiry to b2b database (greenfibre_b2b.orders and greenfibre_b2b.enquiries)
      const b2bDatabase = await db();
      if (b2bDatabase && typeof b2bDatabase.collection === "function") {
        await Promise.allSettled([
          b2bDatabase.collection("orders").insertOne(orderDocument),
          b2bDatabase.collection("enquiries").insertOne(enquiryDocument)
        ]);
        console.log(`[Order Backend] Saved B2B order & enquiry in b2bDatabase: ${reference}`);
      }
    } catch (b2bErr) {
      console.error("[Order Backend] Failed to write to b2bDatabase (non-fatal):", b2bErr);
    }

    // 4. Deduct ordered item quantities from inventory (product stock & variant stock)
    try {
      if (mainDatabase && typeof mainDatabase.collection === "function") {
        await deductInventoryForOrder({
          mainDatabase,
          items,
          orderId: createdOrderId,
          orderNumber,
          reference
        });
      }
    } catch (deductErr) {
      console.error("[Inventory] Error deducting stock for order (non-fatal):", deductErr.message);
    }

    // 4. Send email to client (thank you for ordering) and admin ("me") with attached PO PDF
    let emailSent = false;
    try {
      const emailResult = await sendQuotationEmail({
        to: client.email,
        reference,
        orderNumber,
        client,
        items,
        pricing,
        pdfBuffer
      });
      emailSent = Boolean(emailResult?.success && !emailResult?.devMode);
    } catch (smtpErr) {
      console.error("Enquiry Email Sending Error (non-fatal):", smtpErr);
    }

    return NextResponse.json({
      success: true,
      reference,
      orderNumber,
      orderId: createdOrderId,
      pdfGenerated: true,
      emailSent,
      ...(!emailSent && { warning: "Your quotation was received, but the email could not be sent. Please contact our team with your quotation reference." })
    });
  } catch (globalErr) {
    console.error("Global /api/enquiry Handler Error:", globalErr);
    return NextResponse.json(
      { error: globalErr.message || "Failed to process quotation request. Please try again." },
      { status: 500 }
    );
  }
}


