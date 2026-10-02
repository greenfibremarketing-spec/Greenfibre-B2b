import nodemailer from "nodemailer";

/**
 * Creates and returns a Nodemailer transporter configured with environment variables.
 */
export function getMailTransporter() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  const cleanPass = pass.replace(/\s+/g, "");

  if (host.toLowerCase().includes("gmail")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass: cleanPass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: false, // Prevents failure with corporate relays or self-signed certs
    },
  });
}

/**
 * Sends a 6-digit verification OTP email for either "registration" or "forgot_password".
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.otp - 6-digit OTP string
 * @param {string} options.type - "registration" | "forgot_password"
 * @param {string} [options.userName] - Optional recipient name
 */
export async function sendOtpEmail({ to, otp, type = "registration", userName = "" }) {
  const transporter = getMailTransporter();
  const isRegistration = type === "registration";

  const subject = isRegistration
    ? `[Green Fibre] Your Verification Code: ${otp}`
    : `[Green Fibre] Password Reset Code: ${otp}`;

  const title = isRegistration
    ? "Verify Your Enterprise Account"
    : "Reset Your Enterprise Password";

  const description = isRegistration
    ? "Thank you for creating an enterprise account with Green Fibre. Please use the verification code below to confirm your corporate email address and complete registration."
    : "We received a request to reset the password for your Green Fibre enterprise account. Use the verification code below to set a new password.";

  const actionNotice = isRegistration
    ? "This code is valid for 10 minutes. If you did not request this registration, please disregard this email."
    : "This code is valid for 10 minutes. If you did not request a password reset, your account is safe and you can ignore this email.";

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        .header { background: #1b382b; padding: 32px 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: #86efac; margin: 6px 0 0 0; font-size: 13px; font-weight: 500; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
        .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .otp-box { background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #15803d; letter-spacing: 1px; margin-bottom: 6px; }
        .otp-code { font-size: 36px; font-weight: 800; color: #14532d; letter-spacing: 8px; font-family: monospace, monospace; }
        .notice { font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 20px; }
        .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>GREEN FIBRE</h1>
          <p>Sustainable B2B Tableware &amp; Packaging</p>
        </div>
        <div class="content">
          <div class="greeting">${userName ? `Hello ${userName},` : "Hello,"}</div>
          <p class="text">${description}</p>
          <div class="otp-box">
            <div class="otp-label">Your One-Time Verification Code</div>
            <div class="otp-code">${otp}</div>
          </div>
          <p class="text" style="font-size: 13px; color: #64748b;">
            Enter this code on the verification screen to proceed. Never share this code with anyone. Green Fibre staff will never ask for your verification code.
          </p>
          <div class="notice">
            ${actionNotice}
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Green Fibre B2B Portal. All rights reserved.<br/>
          Direct Manufacturer &bull; Circular Bio-Composite Tableware
        </div>
      </div>
    </body>
    </html>
  `;

  const plainText = `
Green Fibre B2B Portal
${title}

${userName ? `Hello ${userName},` : "Hello,"}

${description}

Your 6-Digit Verification Code: ${otp}

${actionNotice}
This code will expire in 10 minutes.
  `.trim();

  // If SMTP is not yet configured, log OTP prominently to console so testing is completely unblocked
  if (!transporter) {
    console.log("\n=======================================================");
    console.log(`[SMTP DEV MODE] No SMTP configuration found in .env`);
    console.log(`[SMTP DEV MODE] Email To: ${to}`);
    console.log(`[SMTP DEV MODE] Purpose:  ${type}`);
    console.log(`[SMTP DEV MODE] OTP Code: ${otp}`);
    console.log("=======================================================\n");
    return {
      success: true,
      devMode: true,
      message: `[DEV MODE] OTP generated: ${otp} (Logged to server console)`
    };
  }

  const senderUser = process.env.SMTP_USER?.trim();
  const fromAddress = process.env.SMTP_FROM?.trim() || `"Green Fibre B2B" <${senderUser}>`;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: plainText,
      html: htmlContent,
    });

    console.log(`[SMTP] Verification email sent to ${to} (Message ID: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error(`[SMTP Error] Failed to send email to ${to}:`, err);
    throw new Error(`Failed to deliver verification email. Please verify SMTP settings or try again. (${err.message})`);
  }
}

/**
 * Sends B2B Wholesale Quotation & Order Summary emails with attached PDF.
 * - Client receives a simple, polite thank-you email on a light green background with PDF attached.
 * - Green Fibre team receives full notification with client details and attached PDF.
 *
 * @param {Object} options
 * @param {string} options.to - Client email address
 * @param {string} options.reference - Quotation reference ID
 * @param {Object} options.client - Client form details
 * @param {Array} options.items - Array of item breakdown objects
 * @param {Object} options.pricing - Financial calculation totals
 * @param {Buffer} [options.pdfBuffer] - Optional generated PDF buffer
 */
export async function sendQuotationEmail({
  to,
  reference,
  client = {},
  items = [],
  pricing = {},
  pdfBuffer
}) {
  const transporter = getMailTransporter();
  const senderUser = process.env.SMTP_USER?.trim() || "support.greenfibre@gmail.com";
  const fromAddress = process.env.SMTP_FROM?.trim() || `"Green Fibre B2B" <${senderUser}>`;
  const salesEmail = process.env.SALES_EMAIL?.trim() || "support.greenfibre@gmail.com";

  const attachments = [];
  if (pdfBuffer && Buffer.isBuffer(pdfBuffer)) {
    attachments.push({
      filename: `GreenFibre_Order_Summary_${reference}.pdf`,
      content: pdfBuffer,
      contentType: "application/pdf"
    });
  }

  // ── 1. Client Email: Simple, Polite, Light Green Theme (No Extra Complex Tables) ──
  const clientSubject = `Thank You! Your Order Has Been Received [${reference}]`;

  const clientHtmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${clientSubject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0fdf4; color: #1e293b; margin: 0; padding: 0; }
        .wrapper { max-width: 560px; margin: 24px auto; background: #ffffff; border-radius: 16px; border: 1px solid #bbf7d0; overflow: hidden; box-shadow: 0 4px 16px rgba(21,128,61,0.06); }
        .header { background: #eaf7ed; padding: 22px 28px; border-bottom: 1px solid #cbebd4; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #15803d; letter-spacing: -0.3px; }
        .header p { margin: 3px 0 0 0; color: #2d6a4f; font-size: 12px; font-weight: 600; }
        .content { padding: 28px; }
        .title { margin: 0 0 14px 0; font-size: 18px; font-weight: 800; color: #14532d; }
        .text { font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 14px 0; }
        .ref-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px 18px; margin: 18px 0; }
        .ref-label { font-size: 11px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px; }
        .ref-code { font-size: 22px; font-weight: 900; color: #14532d; font-family: monospace, monospace; margin-top: 4px; }
        .pdf-box { background: #eaf7ed; border-left: 4px solid #15803d; border-radius: 6px; padding: 14px 16px; margin: 20px 0; font-size: 13px; color: #14532d; line-height: 1.5; }
        .support { margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12.5px; color: #64748b; line-height: 1.6; }
        .footer { background: #f7fdf9; border-top: 1px solid #e2f9ec; padding: 16px 24px; font-size: 11px; color: #64748b; text-align: center; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>GREEN FIBRE</h1>
          <p>Sustainable B2B Tableware &amp; Packaging</p>
        </div>

        <div class="content">
          <h2 class="title">Thank You! Your order has been received.</h2>
          
          <p class="text">
            Hello <strong>${client.name || "there"}</strong>,
          </p>

          <p class="text">
            Thank you for reaching out to Green Fibre. Your order inquiry has been received. Our inquiry team will review your requirements and get in touch with you soon.
          </p>

          <div class="ref-box">
            <div class="ref-label">Order / Quotation Reference</div>
            <div class="ref-code">${reference}</div>
            <div style="font-size: 12px; color: #475569; margin-top: 6px;">
              Company: <strong>${client.company || "N/A"}</strong> &bull; Location: <strong>${client.city || "N/A"}</strong>
            </div>
          </div>

          <div class="pdf-box">
            <strong style="color: #14532d;">📎 Official Order Summary &amp; Quotation PDF Attached:</strong><br/>
            Please find your attached quotation PDF (<code>GreenFibre_Order_Summary_${reference}.pdf</code>) with itemized wholesale pricing, discounts, and 18% GST breakdown.
          </div>

          <div class="support">
            Need urgent assistance or branding artwork consultation? Feel free to reach out:<br/>
            Email: <a href="mailto:support.greenfibre@gmail.com" style="color:#15803d; font-weight:700; text-decoration:underline;">support.greenfibre@gmail.com</a><br/>
            Direct Phone: <a href="tel:+919217328777" style="color:#15803d; font-weight:700; text-decoration:underline;">+91 92173 28777</a> | WhatsApp: <a href="https://wa.me/919211338066" style="color:#15803d; font-weight:700; text-decoration:underline;">+91 92113 38066</a>
          </div>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Green Fibre B2B Corporate Division &bull; All rights reserved.<br/>
          Circular Bio-Composite &amp; Upcycled Rice Husk Tableware
        </div>
      </div>
    </body>
    </html>
  `;

  const clientPlainText = `
GREEN FIBRE B2B
Thank you! Your order has been received.

Hello ${client.name || "there"},

Thank you for reaching out to Green Fibre. Your order inquiry has been received.
Our inquiry team will review your requirements and get in touch with you soon.

Order / Quotation Reference: ${reference}
Company: ${client.company || "N/A"}
Delivery Location: ${client.city || "N/A"}

Please find your official Order Summary & Quotation attached as a PDF:
GreenFibre_Order_Summary_${reference}.pdf

Need assistance?
Email: support.greenfibre@gmail.com
Direct Phone: +91 92173 28777
WhatsApp: +91 92113 38066
  `.trim();

  // ── 2. Admin Notification: Green Fibre Management Team ────────────────────
  const adminSubject = `[New Order Received] Ref: ${reference} - ${client.company || "Client"} (${client.name || "N/A"})`;

  const itemRowsHtml = items.map((it, idx) => {
    const variant = it.colour && it.colour !== "Standard" ? ` <span style="color:#64748b;font-size:12px;">(${it.colour})</span>` : "";
    const pairTag = it.isPairItem ? ` <span style="background:#dcfce7;color:#14532d;border:1px solid #86efac;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;">Paired</span>` : "";
    const rowBg = idx % 2 === 0 ? "#ffffff" : "#f0fdf4";
    const discountPct = it.discountPct || (it.qty >= 100 ? 20 : it.qty >= 50 ? 15 : 10);
    return `
      <tr style="background-color: ${rowBg}; border-bottom: 1px solid #dcfce7;">
        <td style="padding: 8px 10px; font-size: 12px; color: #0f172a; font-weight: 600;">
          ${it.name}${variant}${pairTag}
        </td>
        <td style="padding: 8px 10px; font-size: 12px; color: #334155; text-align: center; font-weight: 600;">
          ${it.qty} ${it.unit || "pc"}
        </td>
        <td style="padding: 8px 10px; font-size: 12px; color: #64748b; text-align: right;">
          ₹${(it.mrp || 0).toLocaleString("en-IN")}
        </td>
        <td style="padding: 8px 10px; font-size: 12px; color: #047857; font-weight: 700; text-align: right;">
          -₹${(it.lineDiscount || 0).toLocaleString("en-IN")} (${discountPct}%)
        </td>
        <td style="padding: 8px 10px; font-size: 12px; color: #14532d; font-weight: 800; text-align: right;">
          ₹${(it.lineNet || 0).toLocaleString("en-IN")}
        </td>
      </tr>
    `;
  }).join("");

  const adminHtmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${adminSubject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0fdf4; color: #0f172a; margin: 0; padding: 0; }
        .wrapper { max-width: 640px; margin: 20px auto; background: #ffffff; border-radius: 14px; border: 1px solid #bbf7d0; overflow: hidden; box-shadow: 0 4px 16px rgba(21,128,61,0.08); }
        .header { background: #eaf7ed; padding: 22px 26px; border-bottom: 1px solid #cbebd4; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #15803d; }
        .badge-ref { display: inline-block; background: #15803d; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; font-family: monospace; margin-top: 8px; }
        .content { padding: 24px; }
        .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #15803d; margin: 0 0 10px 0; border-bottom: 2px solid #dcfce7; padding-bottom: 4px; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12.5px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; }
        .details-table td { padding: 7px 10px; vertical-align: top; border-bottom: 1px solid #e2f9ec; }
        .details-label { color: #475569; font-weight: 600; width: 36%; }
        .details-val { color: #0f172a; font-weight: 600; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; border: 1px solid #bbf7d0; }
        .items-table th { background: #15803d; color: #ffffff; font-weight: 800; padding: 8px 10px; font-size: 11.5px; }
        .calc-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 14px; margin-bottom: 20px; }
        .footer { background: #f7fdf9; border-top: 1px solid #bbf7d0; padding: 16px 20px; font-size: 11px; color: #475569; text-align: center; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>GREEN FIBRE &bull; NEW INQUIRY RECEIVED</h1>
          <div class="badge-ref">Ref: ${reference}</div>
        </div>

        <div class="content">
          <h3 class="section-title">Client Information</h3>
          <table class="details-table">
            <tr><td class="details-label">Contact Name:</td><td class="details-val">${client.name || "N/A"}</td></tr>
            <tr><td class="details-label">Company:</td><td class="details-val" style="color:#15803d; font-weight:800;">${client.company || "N/A"}</td></tr>
            <tr><td class="details-label">Email:</td><td class="details-val"><a href="mailto:${client.email}" style="color:#15803d; font-weight:700;">${client.email || "N/A"}</a></td></tr>
            <tr><td class="details-label">Phone / WhatsApp:</td><td class="details-val">${client.phone || "N/A"}</td></tr>
            <tr><td class="details-label">Purpose:</td><td class="details-val">${client.buyerType || "Corporate Gifting"}</td></tr>
            <tr><td class="details-label">Location:</td><td class="details-val">${client.city || "N/A"} (${client.pin || "N/A"})</td></tr>
            <tr><td class="details-label">Required By:</td><td class="details-val">${client.date || "Standard"}</td></tr>
            <tr><td class="details-label">GSTIN:</td><td class="details-val">${client.gstin || "Not Provided"}</td></tr>
            <tr><td class="details-label">Notes:</td><td class="details-val">${client.notes || "None"}</td></tr>
          </table>

          <h3 class="section-title">Items Ordered</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th style="text-align: left;">Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">MRP</th>
                <th style="text-align: right;">Disc</th>
                <th style="text-align: right;">Net</th>
              </tr>
            </thead>
            <tbody>
              ${itemRowsHtml}
            </tbody>
          </table>

          <h3 class="section-title">Financial Summary</h3>
          <div class="calc-box">
            <table style="width: 100%; font-size: 12.5px; color: #0f172a;">
              <tr>
                <td style="padding: 3px 0; color: #475569;">Catalog Gross:</td>
                <td style="text-align: right; font-weight: 700;">₹${(pricing.totalGross || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; color: #047857;">Volume Tier Discount:</td>
                <td style="text-align: right; color: #047857; font-weight: 700;">-₹${(pricing.totalItemDiscount || 0).toLocaleString("en-IN")}</td>
              </tr>
              ${pricing.hasBundleBonus && pricing.bundleBonusAmount > 0 ? `
                <tr>
                  <td style="padding: 3px 0; color: #15803d; font-weight: 700;">5% Bundle Bonus:</td>
                  <td style="text-align: right; color: #15803d; font-weight: 700;">-₹${pricing.bundleBonusAmount.toLocaleString("en-IN")}</td>
                </tr>
              ` : ""}
              <tr>
                <td style="padding: 3px 0; font-weight: 700;">Net Taxable Subtotal:</td>
                <td style="text-align: right; font-weight: 700;">₹${(pricing.estimatedTotal || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; color: #64748b;">Estimated 18% GST:</td>
                <td style="text-align: right; color: #64748b;">₹${(pricing.estimatedGST || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr style="border-top: 2px solid #15803d;">
                <td style="padding: 6px 0; font-size: 14px; font-weight: 900; color: #15803d;">TOTAL (INCL. GST):</td>
                <td style="text-align: right; font-size: 14px; font-weight: 900; color: #15803d; padding: 6px 0;">₹${(pricing.totalWithGST || 0).toLocaleString("en-IN")}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="footer">
          Green Fibre Internal Dispatch Alert &bull; PDF Quotation Attached
        </div>
      </div>
    </body>
    </html>
  `;

  const adminPlainText = `
GREEN FIBRE - NEW ORDER INQUIRY
Ref: ${reference}

Client: ${client.name} | ${client.company}
Email: ${client.email} | Phone: ${client.phone}
City: ${client.city} (${client.pin}) | Purpose: ${client.buyerType}
GSTIN: ${client.gstin || "None"}
Notes: ${client.notes || "None"}

Financials:
Gross: ₹${pricing.totalGross} | Net: ₹${pricing.estimatedTotal} | Total + 18% GST: ₹${pricing.totalWithGST}

Attachment: GreenFibre_Order_Summary_${reference}.pdf
  `.trim();

  if (!transporter) {
    console.log(`[SMTP DEV MODE] No SMTP transporter configured. Emails simulated for ${to}`);
    return { success: true, devMode: true };
  }

  try {
    // 1. Send simple polite light green email to the client
    if (to && /^\S+@\S+\.\S+$/.test(to)) {
      await transporter.sendMail({
        from: fromAddress,
        to: to,
        subject: clientSubject,
        text: clientPlainText,
        html: clientHtmlContent,
        attachments
      });
      console.log(`[SMTP] Client confirmation email sent to ${to}`);
    }

    // 2. Send notification to Green Fibre team
    const adminRecipients = Array.from(new Set(["support.greenfibre@gmail.com", "greenfibre.marketing@gmail.com", salesEmail, senderUser].filter(Boolean)));
    if (adminRecipients.length > 0) {
      await transporter.sendMail({
        from: fromAddress,
        to: adminRecipients,
        subject: adminSubject,
        text: adminPlainText,
        html: adminHtmlContent,
        attachments
      });
      console.log(`[SMTP] Admin notification email sent to ${adminRecipients.join(", ")}`);
    }

    return { success: true };
  } catch (err) {
    console.error(`[SMTP Error] Failed to send quotation email:`, err);
    return {
      success: false,
      error: err.message
    };
  }
}


