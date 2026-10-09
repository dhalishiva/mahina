"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Alert, Button, Field, Select } from "@/components/ui";
import { PageTitle } from "./bits";
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
      <div className="mt-8 max-w-xl text-sm text-muted">
        <p>Signed in as {profile.email}. To delete your account and all data, <Link href="/contact" className="text-ink underline">contact us</Link>.</p>
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
  const [busy, setBusy] = useState<PlanCode | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "error" | "info"; text: string } | null>(null);
  if (loading || !profile) return <Loading />;
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  async function buy(plan: PlanCode) {
    setMsg(null);
    if (!keyId) { setMsg({ kind: "info", text: "Online payments are being set up. Write to us from the contact page and we'll activate Pro for you." }); return; }
    setBusy(plan);
    const ok = await loadRazorpay();
    const res = await fetch("/api/billing/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ plan }) });
    const order = await res.json().catch(() => ({}));
    if (!ok || !res.ok) { setBusy(null); setMsg({ kind: "error", text: order.error || "Couldn't start checkout. Try again." }); return; }
    const rz = new window.Razorpay!({
      key: keyId,
      order_id: order.id,
      amount: order.amount,
      currency: "INR",
      name: "Mahina by SlotRecover",
      description: PLANS[plan].label,
      image: `${location.origin}/icon-192.png`,
      prefill: { email: profile!.email || "", name: profile!.full_name || "", contact: profile!.phone || "" },
      theme: { color: "#2433A6" },
      handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const v = await fetch("/api/billing/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(r) });
        setBusy(null);
        if (v.ok) { setMsg({ kind: "ok", text: "Payment received. Pro is active." }); await reload(); }
        else setMsg({ kind: "error", text: `Payment received but activation failed. Contact us with payment ID ${r.razorpay_payment_id}.` });
      },
      modal: { ondismiss: () => setBusy(null) },
    });
    rz.on("payment.failed", () => { setBusy(null); setMsg({ kind: "error", text: "The payment didn't go through. No money was taken; try again." }); });
    rz.open();
  }

  const exp = profile.plan_expires_at ? new Date(profile.plan_expires_at) : null;
  return (
    <>
      <PageTitle title="Your plan" sub={isPro ? `Pro until ${exp?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : `Free plan · ${members.length} of ${SITE.freeLimit} members used`} />
      {msg && <div className="mb-5 max-w-3xl"><Alert kind={msg.kind}>{msg.text}</Alert></div>}
      <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
        {(Object.keys(PLANS) as PlanCode[]).map((code) => {
          const p = PLANS[code];
          return (
            <div key={code} className={`rounded-2xl p-6 ${code === "pro_yearly" ? "bg-ink text-white" : "bg-white ring-1 ring-line"}`}>
              <p className={code === "pro_yearly" ? "text-white/75" : "text-muted"}>{p.label}</p>
              <p className="mt-1 font-display text-4xl font-extrabold">₹{p.rupees.toLocaleString("en-IN")}</p>
              <p className={`text-sm ${code === "pro_yearly" ? "text-white/75" : "text-muted"}`}>{code === "pro_yearly" ? "₹124 a month, two months free" : "for 1 month"}</p>
              <ul className={`mt-4 space-y-1.5 text-sm ${code === "pro_yearly" ? "text-white/90" : ""}`}>
                <li>Unlimited members</li><li>Priority email support</li><li>No auto-renewal</li>
              </ul>
              <button onClick={() => buy(code)} disabled={!!busy}
                className={`mt-5 w-full rounded-xl px-4 py-3 font-semibold disabled:opacity-60 ${code === "pro_yearly" ? "bg-white text-ink" : "bg-ink text-white"}`}>
                {busy === code ? "Opening checkout…" : isPro ? "Extend Pro" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-6 max-w-3xl text-sm text-muted">Pay with UPI, card or net banking through Razorpay. Pro is prepaid and doesn&apos;t renew on its own. Extending adds time to your current plan. See the <Link href="/refund-policy" className="underline">refund policy</Link>.</p>
    </>
  );
}
