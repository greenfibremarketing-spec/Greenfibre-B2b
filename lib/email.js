import nodemailer from "nodemailer";

/**
 * Creates and returns a Nodemailer transporter configured with environment variables.
 */
export function getMailTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = port === 465;

  const cleanPass = pass.replace(/\s+/g, "");

  if (host.includes("gmail")) {
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
