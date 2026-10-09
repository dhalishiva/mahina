import { NextResponse } from "next/server";
import { requestUser } from "@/lib/request-user";
import { createOrder, razorpayConfigured } from "@/lib/razorpay";
import { PLANS, type PlanCode } from "@/lib/site";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!razorpayConfigured()) return NextResponse.json({ error: "Payments are not enabled yet." }, { status: 503 });
  const user = await requestUser(req);
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  if (!rateLimit("order:" + user.id, 10, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts. Wait a few minutes." }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const plan = body?.plan as PlanCode;
  // Monthly is autopay now (/api/billing/subscribe); one-time orders are yearly only.
  if (plan !== "pro_yearly" || !(plan in PLANS)) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  try {
    const order = await createOrder(user.id, plan);
    return NextResponse.json({ id: order.id, amount: order.amount });
  } catch {
    return NextResponse.json({ error: "Couldn't start checkout. Try again shortly." }, { status: 502 });
  }
}
