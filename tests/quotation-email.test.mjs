import test from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { generateQuotationPdf } from "../lib/quotationPdf.js";
import { sendQuotationEmail } from "../lib/email.js";

const quote = {
  reference: "GF-PDF-ATTACHMENT-TEST",
  client: { name: "Attachment Test", company: "Test Company", email: "buyer@example.invalid", phone: "+91 98765 43210", city: "Noida", pin: "201306" },
  items: [{ name: "Test Rice Husk Bottle", colour: "Green", qty: 10, unit: "piece", mrp: 1199, lineGross: 11990, lineDiscount: 1799, lineNet: 10191 }],
  totalGross: 11990, totalItemDiscount: 1799, netSubtotalBeforeBundle: 10191, estimatedTotal: 10191, estimatedGST: 1834, totalWithGST: 12025
};

test("both customer and internal emails contain the same complete PDF attachment", async () => {
  const pdfBuffer = await generateQuotationPdf(quote);
  assert.equal(pdfBuffer.subarray(0, 5).toString(), "%PDF-");
  const captured = [];
  const mime = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" });
  const transport = { async sendMail(message) { captured.push({ message, mime: (await mime.sendMail(message)).message.toString() }); } };
  const result = await sendQuotationEmail({ to: quote.client.email, ...quote, pricing: quote, pdfBuffer }, transport);
  assert.equal(result.success, true);
  assert.equal(captured.length, 2);
  assert.equal(captured[0].message.to, quote.client.email);
  for (const email of captured) {
    assert.equal(email.message.attachments.length, 1);
    assert.equal(email.message.attachments[0].content, pdfBuffer);
    assert.match(email.mime, /Content-Type: application\/pdf/);
    assert.match(email.mime, /Content-Disposition: attachment;/);
    assert.ok(email.mime.replace(/\r?\n/g, "").includes(pdfBuffer.toString("base64")));
  }
});

test("missing or incomplete PDFs prevent quotation emails from being sent", async () => {
  let sent = 0;
  const transport = { async sendMail() { sent++; } };
  for (const pdfBuffer of [undefined, Buffer.alloc(0), Buffer.from("not a PDF"), Buffer.from("%PDF-" + "x".repeat(200))]) {
    await assert.rejects(sendQuotationEmail({ to: quote.client.email, ...quote, pdfBuffer }, transport), /complete quotation PDF/);
  }
  assert.equal(sent, 0);
});

test("SMTP rejection is reported as a delivery failure", async () => {
  const pdfBuffer = await generateQuotationPdf(quote);
  const result = await sendQuotationEmail({ to: quote.client.email, ...quote, pdfBuffer }, { async sendMail() { throw new Error("Test SMTP rejection"); } });
  assert.equal(result.success, false);
});
