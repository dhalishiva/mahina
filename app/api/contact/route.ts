import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendSupportNotification } from "@/lib/mailer";

const TOPICS = new Set(["general", "billing", "refund", "bug", "feature"]);

export async function POST(req: Request) {
  if (!rateLimit("contact:" + clientIp(req), 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many messages. Try again in a few minutes." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  if (body.company) return NextResponse.json({ ok: true }); // honeypot
  if (!(await verifyTurnstile(body.captchaToken, clientIp(req)))) {
    return NextResponse.json({ error: "Bot check failed. Refresh the page and try again." }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const email = String(body.email || "").trim().slice(0, 120);
  const message = String(body.message || "").trim().slice(0, 2000);
  const topic = TOPICS.has(body.topic) ? body.topic : "general";
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 5) {
    return NextResponse.json({ error: "Enter your name, a valid email and a message of at least 5 characters." }, { status: 400 });
  }
  const supabase = await supabaseServer();
  const { error } = await supabase.from("support_messages").insert({ name, email, topic, message });
  if (error) return NextResponse.json({ error: "Message not sent. Try again shortly." }, { status: 500 });
  // The message is already saved (admin → Support), so an email failure is logged but not shown to the sender.
  try {
    const r = await sendSupportNotification({ name, email, topic, message });
    if (!r.sent) console.warn("support email skipped:", r.reason);
  } catch (e) {
    console.error("support email failed:", (e as Error).message);
  }
  return NextResponse.json({ ok: true });
}
