import Link from "next/link";
import type { Metadata } from "next";
import { Faq } from "@/components/marketing/Faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — Free for 15 members, Pro at ₹149/month",
  description: "Mahina is free for up to 15 members. Pro costs ₹149 per month or ₹1,490 per year for unlimited members, reminders and receipts. No commission on payments.",
  alternates: { canonical: "/pricing" },
};

const rows: [string, string, string][] = [
  ["Members", `Up to ${SITE.freeLimit}`, "Unlimited"],
  ["WhatsApp reminders with UPI link", "Unlimited", "Unlimited"],
  ["Hindi, Hinglish and English messages", "Yes", "Yes"],
  ["Payment receipts", "Yes", "Yes"],
  ["Batches and groups", "Yes", "Yes"],
  ["Export to CSV", "Yes", "Yes"],
  ["Commission on payments", "None", "None"],
  ["Support", "Email", "Priority email"],
];

export default function Pricing() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Simple pricing in rupees</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">Start free. Upgrade only when you have more than {SITE.freeLimit} people paying you every month. Payments go straight to your UPI, so there is never a commission.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-line p-8">
            <h2 className="font-display text-2xl font-bold">Free</h2>
            <p className="mt-3 font-display text-5xl font-extrabold">₹0</p>
            <p className="mt-2 text-muted">For a single batch or a small side business.</p>
            <Link href="/signup" className="mt-6 inline-block rounded-xl border-2 border-ink px-5 py-3 font-semibold text-ink hover:bg-ink-soft">Start free</Link>
          </div>
          <div className="rounded-3xl bg-ink p-8 text-white">
            <h2 className="font-display text-2xl font-bold">Pro</h2>
            <p className="mt-3 font-display text-5xl font-extrabold">₹149<span className="text-lg font-semibold text-white/70"> / month</span></p>
            <p className="mt-2 text-white/80">Or ₹1,490 a year. That&apos;s two months free.</p>
            <Link href="/signup?plan=pro" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-ink hover:bg-ink-soft">Start free, upgrade anytime</Link>
          </div>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <caption className="sr-only">Plan comparison</caption>
            <thead>
              <tr className="border-b-2 border-text">
                <th scope="col" className="py-3 font-semibold">Feature</th>
                <th scope="col" className="py-3 font-semibold">Free</th>
                <th scope="col" className="py-3 font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([f, a, b]) => (
                <tr key={f} className="border-b border-line">
                  <th scope="row" className="py-3 pr-4 font-normal text-muted">{f}</th>
                  <td className="py-3 pr-4">{a}</td>
                  <td className="py-3 font-semibold">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-muted">Prices include GST where applicable. Pro is a prepaid plan that does not auto-renew; you choose when to renew. See our <Link className="underline" href="/refund-policy">cancellation and refund policy</Link>.</p>
      </section>
      <div className="h-20" />
      <Faq
        heading="Pricing questions"
        items={[
          { q: "What happens if I go over 15 members on the free plan?", a: "Your existing members and history stay. You just can't add a 16th member until you upgrade or mark someone inactive and remove them." },
          { q: "Does Pro renew automatically?", a: "No. Pro is prepaid for one month or one year. We'll remind you before it ends, and nothing is charged unless you choose to renew." },
          { q: "How do I pay for Pro?", a: "Through Razorpay with UPI, debit or credit card, or net banking." },
          { q: "Can I get a refund?", a: "If you're not happy within 7 days of your first Pro payment, write to us and we'll refund it in full. Details are in the refund policy." },
        ]}
      />
    </>
  );
}
