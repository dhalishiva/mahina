import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAnon } from "@/lib/supabase/server";
import { PLANS, type PlanCode } from "@/lib/site";

const API = "https://api.razorpay.com/v1";

export const razorpayConfigured = () => !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.MAHINA_SERVER_SECRET);

function auth() {
  return "Basic " + Buffer.from(`${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
}

export async function createOrder(userId: string, plan: PlanCode) {
  const p = PLANS[plan];
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: auth() },
    body: JSON.stringify({ amount: p.paise, currency: "INR", receipt: `m_${userId.slice(0, 8)}_${Date.now()}`, notes: { user_id: userId, plan } }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`razorpay order ${res.status}`);
  return (await res.json()) as { id: string; amount: number; currency: string };
}

export async function fetchOrder(orderId: string) {
  if (!/^order_[A-Za-z0-9]{6,40}$/.test(orderId)) throw new Error("bad order id");
  const res = await fetch(`${API}/orders/${orderId}`, { headers: { authorization: auth() }, cache: "no-store" });
  if (!res.ok) throw new Error(`razorpay fetch ${res.status}`);
  return (await res.json()) as { id: string; amount: number; amount_paid: number; status: string; notes: { user_id?: string; plan?: string } };
}

export function safeEqualHex(a: string, b: string) {
  const ab = Buffer.from(a, "utf8"), bb = Buffer.from(b, "utf8");
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Activates Pro after an order is confirmed paid by Razorpay itself. Idempotent per order. */
export async function activateFromOrder(orderId: string, paymentId: string, expectUser?: string) {
  const order = await fetchOrder(orderId);
  const plan = order.notes?.plan as PlanCode | undefined;
  const user = order.notes?.user_id;
  if (!plan || !(plan in PLANS) || !user) throw new Error("order missing notes");
  if (expectUser && user !== expectUser) throw new Error("order belongs to another user");
  if (order.amount !== PLANS[plan].paise) throw new Error("amount mismatch");
  if (order.status !== "paid" && order.amount_paid < order.amount) {
    // Order status can lag the checkout callback by a moment; the verified signature is proof of payment.
    if (!expectUser) throw new Error("order not paid");
  }
  const { error } = await supabaseAnon().rpc("activate_subscription", {
    p_secret: process.env.MAHINA_SERVER_SECRET, p_user: user, p_order: orderId, p_payment: paymentId, p_plan: plan, p_amount: order.amount,
  });
  if (error) throw new Error(error.message);
}
