export function quotationAttachments(pdfBuffer) {
  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length < 100 ||
      pdfBuffer.subarray(0, 5).toString("ascii") !== "%PDF-" ||
      !pdfBuffer.subarray(-32).includes(Buffer.from("%%EOF"))) {
    throw new Error("A complete quotation PDF is required before sending the email.");
  }
  return [{ filename: "GreenFibre_Quotation.pdf", content: pdfBuffer, contentType: "application/pdf", contentDisposition: "attachment" }];
}
