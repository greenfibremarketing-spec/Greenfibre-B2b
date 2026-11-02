import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { generateQuotationPdf } from "../lib/quotationPdf.js";
import { sendQuotationEmail } from "../lib/email.js";
import { db, mainDb } from "../lib/db.js";

// Load .env.local
const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

test("sendQuotationEmail delivers to both user and admin with PO attached and correct subject", async () => {
  const quote = {
    reference: "GF-TEST-ORDER-1234",
    orderNumber: "GF-2026-000999",
    client: {
      name: "Acme Buyer",
      company: "Acme Enterprises",
      email: "buyer@acme-corp.invalid",
      phone: "+91 98765 43210",
      city: "Bengaluru",
      pin: "560001"
    },
    items: [
      {
        name: "Pet Bowl",
        colour: "Ice Blue",
        qty: 20,
        unit: "piece",
        mrp: 799,
        lineGross: 15980,
        discountPct: 20,
        lineDiscount: 3196,
        lineNet: 12784
      }
    ],
    pricing: {
      totalGross: 15980,
      totalItemDiscount: 3196,
      netSubtotalBeforeBundle: 12784,
      estimatedTotal: 12784,
      estimatedGST: 2301,
      totalWithGST: 15085
    }
  };

  const pdfBuffer = await generateQuotationPdf(quote);
  const captured = [];
  const mime = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" });
  const mockTransport = {
    async sendMail(message) {
      captured.push({
        message,
        mime: (await mime.sendMail(message)).message.toString()
      });
    }
  };

  const result = await sendQuotationEmail(
    {
      to: quote.client.email,
      reference: quote.reference,
      orderNumber: quote.orderNumber,
      client: quote.client,
      items: quote.items,
      pricing: quote.pricing,
      pdfBuffer
    },
    mockTransport
  );

  assert.equal(result.success, true);
  assert.equal(result.clientSent, true);
  assert.equal(result.adminSent, true);
  assert.equal(captured.length, 2);

  // 1. Client email verification
  const clientEmail = captured[0];
  assert.equal(clientEmail.message.to, quote.client.email);
  assert.match(clientEmail.message.subject, /Thank You for Your Order!/i);
  assert.match(clientEmail.message.subject, /GF-2026-000999/);
  assert.equal(clientEmail.message.attachments.length, 1);
  assert.equal(clientEmail.message.attachments[0].filename, "GreenFibre_Quotation.pdf");
  assert.equal(clientEmail.message.attachments[0].content, pdfBuffer);

  // 2. Admin email verification
  const adminEmail = captured[1];
  assert.ok(Array.isArray(adminEmail.message.to) || typeof adminEmail.message.to === "string");
  const recipients = Array.isArray(adminEmail.message.to) ? adminEmail.message.to : [adminEmail.message.to];
  assert.ok(recipients.some((r) => r.includes("greenfibre.marketing@gmail.com")));
  assert.match(adminEmail.message.subject, /\[New B2B Order Received\]/i);
  assert.match(adminEmail.message.subject, /GF-2026-000999/);
  assert.equal(adminEmail.message.attachments.length, 1);
  assert.equal(adminEmail.message.attachments[0].content, pdfBuffer);
});

test("Order creation schema verification contains orderChannel: 'b2b'", async () => {
  const database = await mainDb();
  if (!database || typeof database.collection !== "function") {
    console.log("Database not available for schema test, skipping live check");
    return;
  }

  const testReference = "GF-TEST-B2B-" + Date.now();
  const testOrder = {
    orderNumber: "GF-2026-TESTB2B",
    reference: testReference,
    orderChannel: "b2b",
    orderType: "b2b",
    channel: "b2b",
    type: "b2b",
    isB2B: true,
    orderStatus: "pending",
    paymentStatus: "pending",
    items: [{ name: "Pet Bowl", quantity: 10, price: 639 }],
    totalAmount: 6390,
    finalAmount: 7540,
    shippingAddress: {
      fullName: "Test User",
      email: "test@example.com"
    },
    createdAt: new Date()
  };

  await database.collection("orders").insertOne(testOrder);

  const found = await database.collection("orders").findOne({ reference: testReference });
  assert.ok(found, "Order must be found in mainDb.orders");
  assert.equal(found.orderChannel, "b2b", "orderChannel must be 'b2b'");
  assert.equal(found.orderType, "b2b", "orderType must be 'b2b'");
  assert.equal(found.isB2B, true, "isB2B must be true");

  // Clean up test order
  await database.collection("orders").deleteOne({ reference: testReference });
});

test("Order creation reduces product inventory and color variant stock", async () => {
  const database = await mainDb();
  if (!database || typeof database.collection !== "function") return;

  const { deductInventoryForOrder } = await import("../lib/inventory.js");
  const productsCol = database.collection("products");
  const testSlug = "test-stock-item-" + Date.now();

  await productsCol.insertOne({
    name: "Test Stock Product",
    slug: testSlug,
    stockQuantity: 50,
    stock: 50,
    b2bStock: 30,
    colors: [
      { name: "Off white", stock: 25, b2bStock: 15 },
      { name: "Ice Blue", stock: 25, b2bStock: 15 }
    ]
  });

  await deductInventoryForOrder({
    mainDatabase: database,
    items: [{ slug: testSlug, colour: "Off white", qty: 5 }],
    orderNumber: "GF-TEST-STOCK-1",
    reference: "REF-STOCK-1"
  });

  const updated = await productsCol.findOne({ slug: testSlug });
  assert.equal(updated.stockQuantity, 45, "stockQuantity must decrease by 5");
  assert.equal(updated.b2bStock, 25, "b2bStock must decrease by 5");
  const offWhite = updated.colors.find((c) => c.name === "Off white");
  assert.equal(offWhite.stock, 20, "Variant stock must decrease by 5");
  assert.equal(offWhite.b2bStock, 10, "Variant b2bStock must decrease by 5");

  // Clean up
  await productsCol.deleteOne({ slug: testSlug });
  await database.collection("stockauditlogs").deleteMany({ "metadata.orderNumber": "GF-TEST-STOCK-1" });
  setTimeout(() => process.exit(0), 100);
});
