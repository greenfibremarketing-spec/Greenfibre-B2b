import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { getProduct } from "@/lib/products";

const hits = new Map();

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const now = Date.now();
  const h = (hits.get(ip) || []).filter((t) => now - t < 600000);
  
  // Rate limit: 10 requests per 10 minutes
  if (h.length >= 10) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  hits.set(ip, [...h, now]);

  const b = await req.json().catch(() => null);
  if (!b || b.website) {
    // Honeypot caught spam
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const s = (k, n = 200) => String(b[k] || "").trim().slice(0, n);
  const e = {
    name: s("name"),
    company: s("company"),
    email: s("email"),
    phone: s("phone", 25),
    buyerType: s("buyerType", 50),
    city: s("city", 100),
    pin: s("pin", 6),
    date: s("date", 15),
    gstin: s("gstin", 20),
    notes: s("notes", 3000)
  };

  if (!e.name || !e.company || !/^\S+@\S+\.\S+$/.test(e.email) || !/^\d{6}$/.test(e.pin)) {
    return NextResponse.json(
      { error: "Please provide a valid contact name, company, email, and 6-digit PIN code." },
      { status: 422 }
    );
  }

  const items = [];
  for (const i of Array.isArray(b.items) ? b.items.slice(0, 50) : []) {
    const p = await getProduct(i.slug);
    if (!p) continue;
    const qty = Math.floor(+i.qty);
    const minRequired = (i.isPairItem || i.isPair || i.bundleDiscountApplied || i.moq === 1) ? 1 : (p.moq || 1);
    if (!(qty >= minRequired)) {
      return NextResponse.json(
        { error: `${p.name}: Minimum wholesale order quantity is ${minRequired} ${p.unit}.` },
        { status: 422 }
      );
    }
    items.push({
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      unit: p.unit,
      price: p.price,
      colour: String(i.colour || "Default").slice(0, 40),
      qty
    });
  }

  if (!items.length) {
    return NextResponse.json(
      { error: "Please add at least one product to your quote basket." },
      { status: 422 }
    );
  }

  const reference =
    "GF-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase();

  const enquiryDocument = {
    reference,
    ...e,
    items,
    status: "New",
    createdAt: new Date()
  };

  // Attempt to save to MongoDB if URI is configured
  if (process.env.MONGODB_URI) {
    try {
      const database = await db();
      await database.collection("enquiries").insertOne(enquiryDocument);
    } catch (err) {
      console.error("MongoDB Save Error:", err);
      return NextResponse.json(
        { error: "Enquiry could not be saved to database. Please contact orders@greenfibre.org directly." },
        { status: 503 }
      );
    }
  } else {
    console.log("[DEV MODE] Enquiry received (MONGODB_URI not set):", JSON.stringify(enquiryDocument, null, 2));
  }

  // Attempt to send email if SMTP host configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: [e.email, process.env.SALES_EMAIL].filter(Boolean),
        subject: `Green Fibre Wholesale Enquiry [${reference}] - ${e.company}`,
        text: `Green Fibre B2B Enquiry Confirmation\n\nReference: ${reference}\nClient: ${e.name} (${e.company})\nEmail: ${e.email}\nPhone: ${e.phone}\nDelivery City: ${e.city} (${e.pin})\n\nRequested Items:\n` +
          items.map((i) => `• ${i.name} [${i.colour}] × ${i.qty} ${i.unit}`).join("\n") +
          `\n\nNotes:\n${e.notes || "None"}\n`
      }).catch((err) => console.error("SMTP Mailer Error:", err));
    } catch (smtpErr) {
      console.error("SMTP Config Error:", smtpErr);
    }
  }

  return NextResponse.json({ reference });
}
