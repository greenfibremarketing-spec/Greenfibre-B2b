import PDFDocument from "pdfkit";

/**
 * Generates an official B2B Quotation & Order Summary PDF buffer using PDFKit.
 *
 * @param {Object} data
 * @param {string} data.reference - Quotation Reference ID (e.g. GF-MUQN2BU8-8EQG)
 * @param {Object} data.client - Client information (name, company, email, phone, city, pin, gstin, buyerType, date, notes)
 * @param {Array} data.items - Array of items { name, colour, qty, unit, mrp, lineGross, lineDiscount, lineNet, isPairItem, selectedCustomizations, engravingName, customProductName, giftMessage }
 * @param {number} data.totalGross - Total gross before discounts
 * @param {number} data.totalItemDiscount - 10% volume discount sum
 * @param {number} data.netSubtotalBeforeBundle - Subtotal after 10% discount
 * @param {boolean} data.hasBundleBonus - Whether 5% bundle bonus applied
 * @param {number} data.bundleBonusAmount - 5% bundle bonus amount
 * @param {number} data.estimatedTotal - Net taxable subtotal (excl. GST)
 * @param {number} data.estimatedGST - 18% GST
 * @param {number} data.totalWithGST - Grand total
 * @returns {Promise<Buffer>}
 */
export function generateQuotationPdf(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: "A4",
        info: {
          Title: `Green Fibre Order Summary & Quotation - ${data.reference}`,
          Author: "Green Fibre B2B",
          Subject: "Official Wholesale Order Summary & Quotation"
        }
      });

      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      const primaryGreen = "#15803d";
      const deepGreen = "#14532d";
      const lightGreenBg = "#f0fdf4";
      const lightMintBg = "#eaf7ed";
      const mintHighlight = "#dcfce7";
      const lightGreenBorder = "#bbf7d0";
      const darkText = "#0f172a";
      const bodyText = "#1e293b";
      const mutedText = "#475569";
      const discountGreen = "#047857";

      // ── Header Banner (Light Green Theme) ──────────────────────────────────
      doc.rect(40, 40, 515, 62).fill(lightMintBg).stroke(lightGreenBorder);

      // Logo / Title Text
      doc.fillColor(primaryGreen)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("GREEN FIBRE", 55, 50);

      doc.fillColor(deepGreen)
        .fontSize(8.5)
        .font("Helvetica")
        .text("SUSTAINABLE B2B Tableware & Packaging Manufacturer", 55, 74);

      // Quotation Reference Badge (Right aligned)
      doc.fillColor(deepGreen)
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("ORDER SUMMARY & QUOTATION", 320, 50, { width: 220, align: "right" });

      doc.fillColor(primaryGreen)
        .fontSize(9.5)
        .font("Helvetica-Bold")
        .text(`Ref: ${data.reference}`, 320, 64, { width: 220, align: "right" });

      const issueDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      doc.fillColor(mutedText).font("Helvetica").fontSize(8.5).text(`Date: ${issueDate}`, 320, 77, { width: 220, align: "right" });

      // ── Client & Order Details Section (Light Green Theme) ─────────────────
      let currentY = 114;

      doc.rect(40, currentY, 515, 90).fill(lightGreenBg).stroke(lightGreenBorder);

      // Left Column: Client & Company
      doc.fillColor(primaryGreen)
        .fontSize(9.5)
        .font("Helvetica-Bold")
        .text("CLIENT & BILLING DETAILS", 55, currentY + 10);

      doc.fillColor(bodyText).fontSize(8.5).font("Helvetica");
      doc.text(`Contact Name: ${data.client.name || "N/A"}`, 55, currentY + 25);
      doc.text(`Company: ${data.client.company || "N/A"}`, 55, currentY + 38);
      doc.text(`Work Email: ${data.client.email || "N/A"}`, 55, currentY + 51);
      doc.text(`Phone / WhatsApp: ${data.client.phone || "N/A"}`, 55, currentY + 64);
      doc.text(`GSTIN: ${data.client.gstin || "Not Provided"}`, 55, currentY + 77);

      // Right Column: Delivery & Purpose
      doc.fillColor(primaryGreen)
        .fontSize(9.5)
        .font("Helvetica-Bold")
        .text("DISPATCH & PURPOSE", 310, currentY + 10);

      doc.fillColor(bodyText).fontSize(8.5).font("Helvetica");
      doc.text(`Delivery Location: ${data.client.city || "N/A"} (${data.client.pin || "N/A"})`, 310, currentY + 25);
      doc.text(`Order Purpose: ${data.client.buyerType || "Corporate Gifting"}`, 310, currentY + 38);
      doc.text(`Required By: ${data.client.date || "Flexible / Standard Production"}`, 310, currentY + 51);
      doc.text(`Pricing Tier: Direct Factory Wholesale Rate`, 310, currentY + 64);
      doc.text(`GST Benefit: 18% Input Tax Credit Eligible`, 310, currentY + 77);

      currentY += 102;

      // ── Items Table Header (Light Mint Green) ──────────────────────────────
      doc.rect(40, currentY, 515, 22).fill(mintHighlight).stroke(lightGreenBorder);

      doc.fillColor(deepGreen).fontSize(8.5).font("Helvetica-Bold");
      doc.text("#", 48, currentY + 6, { width: 20 });
      doc.text("ITEM DESCRIPTION & FINISH", 70, currentY + 6, { width: 195 });
      doc.text("QTY", 268, currentY + 6, { width: 45, align: "center" });
      doc.text("MRP", 315, currentY + 6, { width: 52, align: "right" });
      doc.text("DISCOUNT", 370, currentY + 6, { width: 85, align: "right" });
      doc.text("NET AMOUNT", 460, currentY + 6, { width: 85, align: "right" });

      currentY += 22;

      // ── Table Rows ─────────────────────────────────────────────────────────
      (data.items || []).forEach((it, idx) => {
        const rowHeight = 24;
        const isEven = idx % 2 === 0;

        if (isEven) {
          doc.rect(40, currentY, 515, rowHeight).fill("#ffffff");
        } else {
          doc.rect(40, currentY, 515, rowHeight).fill(lightGreenBg);
        }
        doc.rect(40, currentY, 515, rowHeight).stroke(lightGreenBorder);

        doc.fillColor(darkText).fontSize(8.5).font("Helvetica");
        doc.text(String(idx + 1).padStart(2, "0"), 48, currentY + 7, { width: 20 });

        // Item Name + Variant
        const variantText = it.colour && it.colour !== "Standard" ? ` (${it.colour})` : "";
        const pairTag = it.isPairItem ? " [Pair]" : " [Primary]";
        doc.font("Helvetica-Bold").text(`${it.name}${variantText}${pairTag}`, 70, currentY + 7, { width: 195, lineBreak: false });

        doc.font("Helvetica").text(`${it.qty} ${it.unit || "pc"}`, 268, currentY + 7, { width: 45, align: "center" });
        doc.text(`₹${(it.mrp || 0).toLocaleString("en-IN")}`, 315, currentY + 7, { width: 52, align: "right" });

        const discountPct = it.discountPct || (it.qty >= 201 ? 25 : it.qty >= 101 ? 20 : 15);
        doc.fillColor(discountGreen).font("Helvetica-Bold").text(`-₹${(it.lineDiscount || 0).toLocaleString("en-IN")} (${discountPct}%)`, 370, currentY + 7, { width: 85, align: "right" });

        doc.fillColor(deepGreen).font("Helvetica-Bold").text(`₹${(it.lineNet || 0).toLocaleString("en-IN")}`, 460, currentY + 7, { width: 85, align: "right" });

        currentY += rowHeight;
      });

      currentY += 12;

      // ── Financial Summary & Calculation Box ────────────────────────────────
      const summaryBoxY = currentY;
      const summaryBoxWidth = 240;
      const summaryBoxX = 555 - summaryBoxWidth;

      doc.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, 130).fill(lightGreenBg).stroke(lightGreenBorder);

      let sumLineY = summaryBoxY + 10;

      function drawSummaryLine(label, value, isBold = false, color = darkText) {
        doc.fillColor(color).fontSize(8.5).font(isBold ? "Helvetica-Bold" : "Helvetica");
        doc.text(label, summaryBoxX + 12, sumLineY, { width: 130 });
        doc.text(value, summaryBoxX + 145, sumLineY, { width: 83, align: "right" });
        sumLineY += 16;
      }

      const totalUnits = (data.items || []).reduce((s, i) => s + (i.qty || 0), 0);
      drawSummaryLine(`Catalog Gross (${totalUnits} units):`, `₹${(data.totalGross || 0).toLocaleString("en-IN")}`);
      drawSummaryLine("Volume Tier Discount:", `-₹${(data.totalItemDiscount || 0).toLocaleString("en-IN")}`, false, discountGreen);
      drawSummaryLine("Subtotal after Discount:", `₹${(data.netSubtotalBeforeBundle || 0).toLocaleString("en-IN")}`, true);

      if (data.hasBundleBonus && data.bundleBonusAmount > 0) {
        drawSummaryLine("Bundle Bonus (5% Extra):", `-₹${data.bundleBonusAmount.toLocaleString("en-IN")}`, true, primaryGreen);
      }

      drawSummaryLine("Net Taxable Subtotal:", `₹${(data.estimatedTotal || 0).toLocaleString("en-IN")}`, true, deepGreen);
      drawSummaryLine("Estimated 18% GST:", `₹${(data.estimatedGST || 0).toLocaleString("en-IN")}`);

      // Final Grand Total Bar (Light Green Highlight)
      doc.rect(summaryBoxX, sumLineY - 2, summaryBoxWidth, 24).fill(mintHighlight).stroke(lightGreenBorder);
      doc.fillColor(deepGreen).fontSize(9.5).font("Helvetica-Bold");
      doc.text("FINAL QUOTATION (INCL. GST):", summaryBoxX + 10, sumLineY + 5, { width: 140 });
      doc.fillColor(primaryGreen).text(`₹${(data.totalWithGST || 0).toLocaleString("en-IN")}`, summaryBoxX + 145, sumLineY + 5, { width: 85, align: "right" });

      // Left of Summary Box: Notes & Customization Details
      const notesBoxWidth = 255;
      const notesBoxX = 40;
      doc.rect(notesBoxX, summaryBoxY, notesBoxWidth, 130).fill(lightGreenBg).stroke(lightGreenBorder);

      doc.fillColor(primaryGreen).fontSize(9).font("Helvetica-Bold").text("BRANDING & NOTES SPECIFICATIONS", notesBoxX + 10, summaryBoxY + 10);

      doc.fillColor(darkText).fontSize(7.5).font("Helvetica");
      const itemCustomizations = (data.items || [])
        .map((it) => {
          const parts = [];
          if (it.senderName) parts.push(`From: ${it.senderName}`);
          if (it.receiverName) parts.push(`To: ${it.receiverName}`);
          if (it.engravingName) parts.push(`Engraving: ${it.engravingName}`);
          if (it.customProductName) parts.push(`Custom: ${it.customProductName}`);
          if (it.giftMessage) parts.push(`Msg: "${it.giftMessage}"`);
          if (parts.length > 0) return `${it.name}: ${parts.join(" | ")}`;
          return null;
        })
        .filter(Boolean);

      const clientNote = data.client.notes?.trim();
      const combinedNotes = [
        clientNote ? `Note: ${clientNote}` : null,
        ...itemCustomizations
      ].filter(Boolean).join("\n• ");

      const notesContent = combinedNotes
        ? (combinedNotes.startsWith("•") ? combinedNotes : `• ${combinedNotes}`)
        : "Standard production dispatch. No special artwork notes provided.";
      doc.text(notesContent, notesBoxX + 10, summaryBoxY + 24, { width: notesBoxWidth - 20, height: 62, ellipsis: true });

      doc.fillColor(primaryGreen).fontSize(7.5).font("Helvetica-Bold").text("B2B ADVANTAGES & CERTIFICATIONS:", notesBoxX + 10, summaryBoxY + 90);
      doc.fillColor(mutedText).fontSize(7.5).font("Helvetica");
      doc.text("• 100% Biodegradable & Upcycled Rice Husk Agro-composite", notesBoxX + 10, summaryBoxY + 102);
      doc.text("• Microwave, Dishwasher & Food-Grade FDA Certified", notesBoxX + 10, summaryBoxY + 114);

      // ── Footer & Terms (Light Green Theme) ─────────────────────────────────
      const footerY = 720;
      doc.rect(40, footerY, 515, 60).fill(lightMintBg).stroke(lightGreenBorder);

      doc.fillColor(primaryGreen).fontSize(8).font("Helvetica-Bold").text("TERMS & CONDITIONS", 50, footerY + 8);
      doc.fillColor(mutedText).fontSize(7).font("Helvetica");
      doc.text("1. Quotation Validity: 30 days from issuance date. Standard production lead time: 5–7 business days after artwork approval.", 50, footerY + 20);
      doc.text("2. Tax Credit: Official GST Invoice with 18% ITC credit provided upon shipment. Pan-India dispatch from Greater Noida facility.", 50, footerY + 30);
      doc.text("3. Support & Accounts: support.greenfibre@gmail.com | Phone: +91 92173 28777 | WhatsApp: +91 92113 38066 | Website: https://greenfibre.org", 50, footerY + 40);

      // Final signature text
      doc.fillColor(primaryGreen).fontSize(8).font("Helvetica-Bold").text("GREEN FIBRE B2B CORPORATE DIVISION", 330, footerY + 48, { width: 215, align: "right" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

