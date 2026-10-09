import { NextResponse } from "next/server";
import { requestUser } from "@/lib/request-user";
import { createSubscription, fetchSubscription, getAutopay, razorpayConfigured, syncAutopay } from "@/lib/razorpay";
import { rateLimit } from "@/lib/ratelimit";

/** Starts ₹149/month autopay. Returns a Razorpay subscription id to open Checkout with. */
export async function POST(req: Request) {
  if (!razorpayConfigured()) return NextResponse.json({ error: "Payments are not enabled yet." }, { status: 503 });
  const user = await requestUser(req);
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  if (!rateLimit("sub:" + user.id, 6, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts. Wait a few minutes." }, { status: 429 });

  const current = await getAutopay(user.id);
  if (current.subscription_id && ["active", "authenticated", "pending"].includes(current.status || "")) {
    return NextResponse.json({ error: "Autopay is already on for your account." }, { status: 409 });
  }
  try {
    // Reuse the user's unfinished checkout instead of creating a new subscription on every click.
    if (current.subscription_id && current.status === "created") {
      const old = await fetchSubscription(current.subscription_id).catch(() => null);
      const startOk = !old?.start_at || old.start_at > Date.now() / 1000 + 3600;
      const proNow = !!current.pro_until && new Date(current.pro_until).getTime() > Date.now() + 86400_000;
      if (old && old.status === "created" && old.notes?.user_id === user.id && startOk && !!old.start_at === proNow) {
        return NextResponse.json({ subscription_id: old.id, starts_at: old.charge_at ?? null });
      }
    }
    const sub = await createSubscription(user.id, current.pro_until);
    await syncAutopay(sub).catch((e) => console.error("record created sub failed:", (e as Error).message));
    return NextResponse.json({ subscription_id: sub.id, starts_at: sub.charge_at ?? null });
  } catch (e) {
    console.error("subscription create failed:", (e as Error).message);
    return NextResponse.json({ error: "Couldn't start autopay. Try again shortly." }, { status: 502 });
  }
}
