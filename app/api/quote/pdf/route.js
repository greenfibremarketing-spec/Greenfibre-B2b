import { NextResponse } from "next/server";
import { generateQuotationPdf } from "@/lib/quotationPdf";

export async function POST(req) {
  try {
    const body = await req.json();

    const reference =
      body.reference ||
      "GF-EST-" + Date.now().toString(36).toUpperCase();

    const client = body.client || {
      name: body.name || "Prospective B2B Client",
      company: body.company || "Enterprise Buyer",
      email: body.email || "support.greenfibre@gmail.com",
      phone: body.phone || "+91 92173 28777",
      city: body.city || "Pan-India",
      pin: body.pin || "000000",
      buyerType: body.buyerType || "Corporate Wholesale",
      date: body.date || "Immediate",
      gstin: body.gstin || "N/A",
      notes: body.notes || ""
    };

    const items = Array.isArray(body.items) ? body.items : [];
    const totalGross = Number(body.totalGross || 0);
    const totalItemDiscount = Number(body.totalItemDiscount || 0);
    const netSubtotalBeforeBundle = Number(body.netSubtotalBeforeBundle || 0);
    const hasBundleBonus = Boolean(body.hasBundleBonus);
    const bundleBonusAmount = Number(body.bundleBonusAmount || 0);
    const estimatedTotal = Number(body.estimatedTotal || 0);
    const estimatedGST = Number(body.estimatedGST || 0);
    const totalWithGST = Number(body.totalWithGST || 0);

    const pdfBuffer = await generateQuotationPdf({
      reference,
      client,
      items,
      totalGross,
      totalItemDiscount,
      netSubtotalBeforeBundle,
      hasBundleBonus,
      bundleBonusAmount,
      estimatedTotal,
      estimatedGST,
      totalWithGST
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="GreenFibre_Quotation_${reference}.pdf"`
      }
    });
  } catch (err) {
    console.error("Quotation PDF Generation Error:", err);
    return NextResponse.json(
      { error: "Failed to generate quotation PDF: " + err.message },
      { status: 500 }
    );
  }
}
