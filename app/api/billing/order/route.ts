import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { createOrder, razorpayConfigured } from "@/lib/razorpay";
import { PLANS, type PlanCode } from "@/lib/site";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!razorpayConfigured()) return NextResponse.json({ error: "Payments are not enabled yet." }, { status: 503 });
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  if (!rateLimit("order:" + data.user.id, 10, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts. Wait a few minutes." }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const plan = body?.plan as PlanCode;
  if (!(plan in PLANS)) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  try {
    const order = await createOrder(data.user.id, plan);
    return NextResponse.json({ id: order.id, amount: order.amount });
  } catch {
    return NextResponse.json({ error: "Couldn't start checkout. Try again shortly." }, { status: 502 });
  }
}
