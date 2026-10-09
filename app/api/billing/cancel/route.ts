import { NextResponse } from "next/server";
import { requestUser } from "@/lib/request-user";
import { cancelSubscription, fetchSubscription, getAutopay, razorpayConfigured, syncAutopay } from "@/lib/razorpay";
import { rateLimit } from "@/lib/ratelimit";

/** Turns autopay off. Pro stays active until the end of the month already paid for. */
export async function POST(req: Request) {
  if (!razorpayConfigured()) return NextResponse.json({ error: "Payments are not enabled." }, { status: 503 });
  const user = await requestUser(req);
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  if (!rateLimit("cancel:" + user.id, 6, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts. Wait a few minutes." }, { status: 429 });

  const { subscription_id } = await getAutopay(user.id);
  if (!subscription_id) return NextResponse.json({ error: "Autopay isn't on." }, { status: 400 });
  try {
    const sub = await fetchSubscription(subscription_id);
    if (sub.notes?.user_id !== user.id) return NextResponse.json({ error: "Not your subscription." }, { status: 403 });
    const after = ["cancelled", "completed", "expired"].includes(sub.status) ? sub : await cancelSubscription(subscription_id);
    await syncAutopay(after, undefined, user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("cancel failed:", (e as Error).message);
    return NextResponse.json({ error: "Couldn't turn off autopay. Try again or contact us." }, { status: 502 });
  }
}
