import { Resend } from "resend";

export const CONTACT_TO = "info@smstudios-om.com";

export class MailConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "MailConfigError";
    this.status = 503;
  }
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getFromAddress() {
  const from = String(process.env.RESEND_FROM_EMAIL || "").trim();
  return from || "SM Studios <beth.t@example.com>";
}

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new MailConfigError(
      "Email service is not configured. Please email info@smstudios-om.com directly.",
    );
  }
  return new Resend(apiKey);
}

/**
 * @param {{
 *   subject: string,
 *   html: string,
 *   text: string,
 *   replyTo?: string,
 *   attachments?: { filename: string, content: Buffer }[],
 * }} payload
 */
export async function sendStudioEmail(payload) {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to: CONTACT_TO,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo || undefined,
    attachments: payload.attachments,
  });

  if (error) {
    const message = error.message || "Email provider rejected the message.";
    const err = new Error(message);
    err.status = 502;
    throw err;
  }

  return data;
}

export function rowsToHtml(title, rows) {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;">${escapeHtml(value || "—")}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
    <h1 style="font-size:18px;margin:0 0 16px;">${escapeHtml(title)}</h1>
    <table style="border-collapse:collapse;width:100%;max-width:640px;">${body}</table>
  </body>
</html>`;
}

export function rowsToText(title, rows) {
  const lines = rows.map(([label, value]) => `${label}: ${value || "—"}`);
  return `${title}\n\n${lines.join("\n")}`;
}
