import nodemailer from "nodemailer";

const isConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

let transporter = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587/25
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn(
    "[avatar-realty] Email notifications are disabled — set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally SMTP_PORT, SMTP_SECURE, ENQUIRY_NOTIFY_TO) in server/.env."
  );
}

/**
 * Fire-and-forget notification email for a new enquiry. Never throws —
 * a failed email should never block or fail the enquiry submission itself.
 */
export async function sendEnquiryNotification(enquiry) {
  if (!transporter) return;

  const to = process.env.ENQUIRY_NOTIFY_TO || process.env.SMTP_USER;
  const propertyLine = enquiry.propertyId ? `Property ID: ${enquiry.propertyId}\n` : "";

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      replyTo: enquiry.email,
      subject: `New enquiry from ${enquiry.name}`,
      text:
        `New enquiry received on Avatar Realty Group.\n\n` +
        `Name: ${enquiry.name}\n` +
        `Email: ${enquiry.email}\n` +
        `Phone: ${enquiry.phone || "—"}\n` +
        propertyLine +
        `\nMessage:\n${enquiry.message || "—"}\n`,
    });
  } catch (err) {
    console.error("[avatar-realty] Failed to send enquiry notification email:", err.message);
  }
}