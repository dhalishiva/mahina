import { NextResponse } from "next/server";
import { requestUser } from "@/lib/request-user";
import { activateFromOrder, razorpayConfigured, verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  if (!razorpayConfigured()) return NextResponse.json({ error: "Payments are not enabled." }, { status: 503 });
  const user = await requestUser(req);
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const orderId = String(b?.razorpay_order_id || "");
  const paymentId = String(b?.razorpay_payment_id || "");
  const signature = String(b?.razorpay_signature || "");
  if (!orderId || !paymentId || !/^[a-f0-9]{64}$/.test(signature)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  if (!verifyPaymentSignature(orderId, paymentId, signature)) return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });

  try {
    await activateFromOrder(orderId, paymentId, user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("activation failed", orderId, (e as Error).message);
    return NextResponse.json({ error: "Activation failed" }, { status: 500 });
  }
}
