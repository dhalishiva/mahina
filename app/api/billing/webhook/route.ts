import { NextResponse } from "next/server";
import { activateFromOrder, verifyWebhookSignature } from "@/lib/razorpay";

/** Razorpay webhook (events: order.paid). Backstop for when the browser closes before /verify runs. */
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  if (!verifyWebhookSignature(raw, sig)) return NextResponse.json({ error: "bad signature" }, { status: 400 });

  const evt = JSON.parse(raw);
  if (evt.event === "order.paid" || evt.event === "payment.captured") {
    const payment = evt.payload?.payment?.entity;
    const orderId = payment?.order_id || evt.payload?.order?.entity?.id;
    if (orderId && payment?.id) {
      try { await activateFromOrder(orderId, payment.id); }
      catch (e) { console.error("webhook activation failed", orderId, (e as Error).message); return NextResponse.json({ ok: false }, { status: 500 }); }
    }
  }
  return NextResponse.json({ ok: true });
}
