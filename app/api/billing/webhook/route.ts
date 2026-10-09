import { NextResponse } from "next/server";
import { activateFromOrder, syncAutopay, verifyWebhookSignature, type RzSubscription } from "@/lib/razorpay";

/**
 * Razorpay webhook.
 * - order.paid: one-time (yearly) purchases; backstop for when the browser closes before /verify runs.
 * - subscription.*: autopay. `subscription.charged` extends Pro every month; cancelled/halted/completed just record the state
 *   (Pro then ends on its own at the end of the paid month).
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  if (!verifyWebhookSignature(raw, sig)) return NextResponse.json({ error: "bad signature" }, { status: 400 });

  const evt = JSON.parse(raw);
  const payment = evt.payload?.payment?.entity;
  const sub = evt.payload?.subscription?.entity as RzSubscription | undefined;
  try {
    if (typeof evt.event === "string" && evt.event.startsWith("subscription.") && sub?.id) {
      await syncAutopay(sub, evt.event === "subscription.charged" ? payment?.id : undefined);
    } else if ((evt.event === "order.paid" || evt.event === "payment.captured") && !payment?.subscription_id && !payment?.invoice_id) {
      const orderId = payment?.order_id || evt.payload?.order?.entity?.id;
      if (orderId && payment?.id) await activateFromOrder(orderId, payment.id);
    }
  } catch (e) {
    console.error("webhook failed", evt.event, (e as Error).message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
