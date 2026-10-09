"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Alert, Button, Field, Select } from "@/components/ui";
import { PageTitle } from "./bits";
import { SignOut } from "./AppShell";
import { Loading } from "./views";
import { PLANS, SITE, type PlanCode } from "@/lib/site";
import type { Lang } from "@/lib/reminders";

const TYPES = ["Home tuition", "Coaching centre", "Tiffin service", "Gym or fitness", "Yoga", "Music or dance", "PG or hostel", "Milk or newspaper", "Society or RWA", "Sports coaching", "Daycare or playschool", "Other"];

/* ---------------- SETTINGS ---------------- */
export function SettingsView({ welcome = false }: { welcome?: boolean }) {
  const { profile, loading, saveProfile } = useStore();
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  if (loading || !profile) return <Loading />;

  return (
    <>
      <PageTitle title={welcome ? "Welcome to Mahina" : "Settings"} sub={welcome ? "Two details and you're ready to send your first reminder." : "Your business details appear on reminders, payment pages and receipts."} />
      <form
        className="max-w-xl space-y-5 rounded-2xl bg-white p-5 ring-1 ring-line sm:p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const upi = String(fd.get("upi_id") || "").trim().toLowerCase();
          if (upi && !/^[a-z0-9._-]{2,64}@[a-z]{2,32}$/.test(upi)) { setMsg({ kind: "error", text: "That UPI ID doesn't look right. It should look like name@okhdfcbank." }); return; }
          setBusy(true);
          const err = await saveProfile({
            full_name: String(fd.get("full_name")).trim() || null,
            business_name: String(fd.get("business_name")).trim() || null,
            business_type: String(fd.get("business_type")) || null,
            phone: String(fd.get("phone")).trim() || null,
            upi_id: upi || null,
            upi_name: String(fd.get("upi_name")).trim() || null,
            reminder_lang: String(fd.get("reminder_lang")) as Lang,
          });
          setBusy(false);
          setMsg(err ? { kind: "error", text: err } : { kind: "ok", text: "Settings saved." });
          if (!err && welcome) location.href = "/app/members?add=1";
        }}
      >
        <Field label="Business name" name="business_name" required maxLength={80} defaultValue={profile.business_name || ""} placeholder="Sharma Tuition Classes" hint="Shown on reminders and receipts." />
        <Select label="What kind of business?" name="business_type" defaultValue={profile.business_type || ""}>
          <option value="">Choose one</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </Select>
        <div className="rounded-xl bg-surface p-4">
          <p className="font-semibold">Where members pay you</p>
          <div className="mt-3 space-y-4">
            <Field label="UPI ID" name="upi_id" maxLength={100} defaultValue={profile.upi_id || ""} placeholder="yourname@okhdfcbank" autoCapitalize="none" autoCorrect="off" spellCheck={false} hint="Find it in GPay, PhonePe or Paytm under your profile. Payments go straight to this account." />
            <Field label="Name on the UPI account" name="upi_name" maxLength={60} defaultValue={profile.upi_name || ""} placeholder="Ramesh Sharma" />
          </div>
        </div>
        <Select label="Default reminder language" name="reminder_lang" defaultValue={profile.reminder_lang}>
          <option value="hinglish">Hinglish (Hindi in English letters)</option>
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
        </Select>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" name="full_name" maxLength={80} defaultValue={profile.full_name || ""} autoComplete="name" />
          <Field label="Your phone" name="phone" type="tel" maxLength={20} defaultValue={profile.phone || ""} hint="Shown on receipts." />
        </div>
        {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
        <Button disabled={busy} className="w-full py-3 sm:w-auto">{busy ? "Saving…" : welcome ? "Save and add members" : "Save settings"}</Button>
      </form>
      <div className="mt-8 max-w-xl rounded-2xl bg-white p-5 ring-1 ring-line">
        <p className="text-sm text-muted">Signed in as</p>
        <p className="truncate font-semibold">{profile.email}</p>
        <SignOut className="mt-4 w-full rounded-xl px-4 py-3 font-semibold text-due ring-1 ring-due/30 hover:bg-due-soft sm:w-auto" />
        <p className="mt-4 text-sm text-muted">To delete your account and all data, <Link href="/contact" className="text-ink underline">contact us</Link>.</p>
      </div>
    </>
  );
}

/* ---------------- BILLING ---------------- */
declare global {
  interface Window { Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void } }
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function BillingView() {
  const { profile, isPro, loading, members, reload } = useStore();
  const [busy, setBusy] = useState<"autopay" | "yearly" | "cancel" | null>(null);
  const [confirmOff, setConfirmOff] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error" | "info"; text: string } | null>(null);
  if (loading || !profile) return <Loading />;
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const autopayOn = !!profile.subscription_id && ["active", "authenticated", "pending"].includes(profile.subscription_status || "");
  const exp = profile.plan_expires_at ? new Date(profile.plan_expires_at) : null;
  const expText = exp?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  type Success = { razorpay_payment_id: string; razorpay_signature: string; razorpay_order_id?: string; razorpay_subscription_id?: string };
  async function checkout(kind: "autopay" | "yearly", opts: Record<string, unknown>) {
    const ok = await loadRazorpay();
    if (!ok) { setBusy(null); setMsg({ kind: "error", text: "Couldn't load the payment window. Check your connection and try again." }); return; }
    const rz = new window.Razorpay!({
      key: keyId,
      name: "Mahina by SlotRecover",
      image: `${location.origin}/icon-192.png`,
      prefill: { email: profile!.email || "", name: profile!.full_name || "", contact: profile!.phone || "" },
      theme: { color: "#2433A6" },
      ...opts,
      handler: async (r: Success) => {
        const v = await fetch("/api/billing/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(r) });
        setBusy(null);
        if (v.ok) { setMsg({ kind: "ok", text: kind === "autopay" ? (isPro && expText ? `Autopay is set up. Your Pro continues as is, and the first ₹149 charge will be around ${expText}.` : "Autopay is on and Pro is active. We'll charge ₹149 every month until you turn it off.") : "Payment received. Pro is active for a year." }); await reload(); }
        else setMsg({ kind: "error", text: `Payment received but activation is taking a while. Refresh in a minute, or contact us with payment ID ${r.razorpay_payment_id}.` });
      },
      modal: { ondismiss: () => setBusy(null) },
    });
    rz.on("payment.failed", () => { setBusy(null); setMsg({ kind: "error", text: "The payment didn't go through. No money was taken; try again." }); });
    rz.open();
  }

  async function start(kind: "autopay" | "yearly") {
    setMsg(null);
    if (!keyId) { setMsg({ kind: "info", text: "Online payments are being set up. Write to us from the contact page and we'll activate Pro for you." }); return; }
    setBusy(kind);
    const res = await fetch(kind === "autopay" ? "/api/billing/subscribe" : "/api/billing/order", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ plan: "pro_yearly" }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setBusy(null); setMsg({ kind: "error", text: d.error || "Couldn't start checkout. Try again." }); return; }
    if (kind === "autopay") await checkout(kind, { subscription_id: d.subscription_id, description: "Pro · ₹149 every month" });
    else await checkout(kind, { order_id: d.id, amount: d.amount, currency: "INR", description: PLANS.pro_yearly.label });
  }

  async function turnOff() {
    setBusy("cancel"); setMsg(null);
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setBusy(null); setConfirmOff(false);
    if (!res.ok) { setMsg({ kind: "error", text: d.error || "Couldn't turn off autopay. Try again." }); return; }
    setMsg({ kind: "ok", text: `Autopay is off. You won't be charged again${expText ? `, and Pro stays active until ${expText}` : ""}.` });
    await reload();
  }

  const sub = isPro
    ? `Pro${autopayOn ? " · autopay on" : ""} · ${autopayOn ? "renews" : "active until"} ${expText}`
    : `Free plan · ${members.length} of ${SITE.freeLimit} members used`;

  return (
    <>
      <PageTitle title="Your plan" sub={sub} />
      {msg && <div className="mb-5 max-w-3xl"><Alert kind={msg.kind}>{msg.text}</Alert></div>}
      <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-ink p-6 text-white">
          <p className="text-white/75">Pro monthly · autopay</p>
          <p className="mt-1 font-display text-4xl font-extrabold">₹{PLANS.pro_monthly.rupees}<span className="text-lg font-semibold text-white/75"> / month</span></p>
          <p className="text-sm text-white/75">Charged automatically every month. Turn off anytime.</p>
          <ul className="mt-4 space-y-1.5 text-sm text-white/90">
            <li>Unlimited members</li><li>Priority email support</li><li>UPI autopay or card</li>
          </ul>
          {autopayOn ? (
            confirmOff ? (
              <div className="mt-5 rounded-xl bg-white/10 p-3 text-sm">
                <p>Stop future charges? Pro stays active until {expText}.</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={turnOff} disabled={!!busy} className="flex-1 rounded-lg bg-white px-3 py-2 font-semibold text-due disabled:opacity-60">{busy === "cancel" ? "Turning off…" : "Turn off"}</button>
                  <button onClick={() => setConfirmOff(false)} className="flex-1 rounded-lg px-3 py-2 font-semibold ring-1 ring-white/40">Keep it</button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-center font-semibold">Autopay is on</p>
                <button onClick={() => setConfirmOff(true)} className="mt-2 w-full text-sm text-white/80 underline">Turn off autopay</button>
              </>
            )
          ) : (
            <button onClick={() => start("autopay")} disabled={!!busy} className="mt-5 w-full rounded-xl bg-white px-4 py-3 font-semibold text-ink disabled:opacity-60">
              {busy === "autopay" ? "Opening checkout…" : "Start autopay"}
            </button>
          )}
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
          <p className="text-muted">{PLANS.pro_yearly.label} · one-time</p>
          <p className="mt-1 font-display text-4xl font-extrabold">₹{PLANS.pro_yearly.rupees.toLocaleString("en-IN")}<span className="text-lg font-semibold text-muted"> / year</span></p>
          <p className="text-sm text-muted">₹124 a month, two months free. Doesn&apos;t renew on its own.</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            <li>Unlimited members</li><li>Priority email support</li><li>Pay once, no mandate</li>
          </ul>
          <button onClick={() => start("yearly")} disabled={!!busy} className="mt-5 w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white disabled:opacity-60">
            {busy === "yearly" ? "Opening checkout…" : isPro ? "Add a year" : "Buy a year"}
          </button>
        </div>
      </div>
      <p className="mt-6 max-w-3xl text-sm text-muted">Payments are handled by Razorpay. With autopay you approve a UPI autopay mandate or card once, and ₹149 is charged each month; you can turn it off here at any time and Pro stays active until the end of the month you&apos;ve paid for. A yearly purchase adds 12 months to your current plan. See the <Link href="/refund-policy" className="underline">cancellation and refund policy</Link>.</p>
    </>
  );
}
