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

/* ---------------- Autopay (Razorpay Subscriptions) ---------------- */

const secret = () => process.env.MAHINA_SERVER_SECRET;
export const AUTOPAY = { rupees: 149, paise: 14900, label: "Pro monthly autopay", cycles: 60 } as const;

async function rz<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "content-type": "application/json", authorization: auth(), ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`razorpay ${path.split("/")[1]} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as T;
}

/** The ₹149/month plan. Uses RAZORPAY_PLAN_ID if set, otherwise creates the plan once and remembers it in the database. */
export async function autopayPlanId() {
  if (process.env.RAZORPAY_PLAN_ID) return process.env.RAZORPAY_PLAN_ID;
  const db = supabaseAnon();
  const { data: saved } = await db.rpc("billing_setting", { p_secret: secret(), p_key: "billing_plan_monthly" });
  if (saved) return saved as string;
  const plan = await rz<{ id: string }>("/plans", {
    method: "POST",
    body: JSON.stringify({ period: "monthly", interval: 1, item: { name: "Mahina Pro (monthly)", amount: AUTOPAY.paise, currency: "INR", description: "Unlimited members, renews every month" } }),
  });
  await db.rpc("billing_setting", { p_secret: secret(), p_key: "billing_plan_monthly", p_value: plan.id });
  return plan.id;
}

export type RzSubscription = { id: string; plan_id: string; status: string; current_end: number | null; charge_at: number | null; notes: { user_id?: string } };
type RzPayment = { id: string; order_id: string | null; amount: number; status: string; subscription_id?: string };

export async function getAutopay(userId: string) {
  const { data } = await supabaseAnon().rpc("get_autopay", { p_secret: secret(), p_user: userId });
  return (data || { subscription_id: null, status: null, pro_until: null }) as { subscription_id: string | null; status: string | null; pro_until: string | null };
}

/**
 * Creates the autopay subscription. If the user already has Pro paid until a future date, the first charge is
 * scheduled for that date (Razorpay then only takes a small refundable authorisation now).
 */
export async function createSubscription(userId: string, proUntil?: string | null) {
  const until = proUntil ? Math.floor(new Date(proUntil).getTime() / 1000) : 0;
  const startAt = until > Date.now() / 1000 + 86400 ? until : undefined;
  return rz<RzSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: await autopayPlanId(), total_count: AUTOPAY.cycles, quantity: 1, customer_notify: 1,
      ...(startAt ? { start_at: startAt } : {}),
      notes: { user_id: userId, plan: "pro_autopay" },
    }),
  });
}

export const fetchSubscription = (id: string) => {
  if (!/^sub_[A-Za-z0-9]{6,40}$/.test(id)) throw new Error("bad subscription id");
  return rz<RzSubscription>(`/subscriptions/${id}`);
};
const fetchPayment = (id: string) => {
  if (!/^pay_[A-Za-z0-9]{6,40}$/.test(id)) throw new Error("bad payment id");
  return rz<RzPayment>(`/payments/${id}`);
};

/** Stops future charges. Pro stays active until the end of the period already paid for. */
export async function cancelSubscription(id: string) {
  return rz<RzSubscription>(`/subscriptions/${id}/cancel`, { method: "POST", body: JSON.stringify({ cancel_at_cycle_end: 0 }) });
}

export function verifySubscriptionSignature(paymentId: string, subscriptionId: string, signature: string) {
  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(`${paymentId}|${subscriptionId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

const STATUSES = new Set(["created", "authenticated", "active", "pending", "halted", "cancelled", "completed", "expired", "paused"]);

/**
 * Saves the subscription state and, when a captured payment is given, extends Pro to the end of the paid cycle.
 * Everything is re-read from Razorpay, so the caller's input is never trusted for amounts or dates.
 */
export async function syncAutopay(sub: RzSubscription, paymentId?: string, expectUser?: string) {
  const user = sub.notes?.user_id;
  if (!user) throw new Error("subscription missing user");
  if (expectUser && user !== expectUser) throw new Error("subscription belongs to another user");
  let pay: RzPayment | null = null;
  if (paymentId) {
    pay = await fetchPayment(paymentId);
    if (!["captured", "authorized"].includes(pay.status) || pay.amount < AUTOPAY.paise) pay = null;
  }
  const until = pay
    ? new Date(sub.current_end ? sub.current_end * 1000 : Date.now() + 31 * 86400_000).toISOString()
    : null;
  const { error } = await supabaseAnon().rpc("record_autopay", {
    p_secret: secret(), p_user: user, p_sub: sub.id, p_status: STATUSES.has(sub.status) ? sub.status : "pending",
    p_payment: pay?.id ?? null, p_order: pay?.order_id ?? null, p_amount: pay?.amount ?? null, p_until: until,
  });
  if (error) throw new Error(error.message);
}
