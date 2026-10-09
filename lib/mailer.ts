import "server-only";
import nodemailer from "nodemailer";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export const mailerConfigured = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

function transport() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

/** Emails a contact-form message to the support inbox. Reply-To is the sender, so replying from the inbox reaches them. */
export async function sendSupportNotification(m: { name: string; email: string; topic: string; message: string }) {
  if (!mailerConfigured()) return { sent: false, reason: "smtp not configured" };
  const to = process.env.SUPPORT_INBOX || "support@kriosity.in";
  const from = process.env.SMTP_FROM || `Mahina <${process.env.SMTP_USER}>`;
  const name = oneLine(m.name).slice(0, 80);
  await transport().sendMail({
    from,
    to,
    replyTo: { name, address: m.email },
    subject: `[Mahina · ${m.topic}] ${name}`,
    text: `From: ${name} <${m.email}>\nTopic: ${m.topic}\n\n${m.message}\n\nReply to this email to answer them.`,
    html: `<p><b>From:</b> ${esc(name)} &lt;${esc(m.email)}&gt;<br><b>Topic:</b> ${esc(m.topic)}</p><p style="white-space:pre-wrap">${esc(m.message)}</p><p style="color:#5b6178">Reply to this email to answer them. Also listed in Mahina admin → Support.</p>`,
  });
  return { sent: true };
}
