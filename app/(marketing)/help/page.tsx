import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/marketing/Faq";
import { JsonLd } from "@/components/marketing/JsonLd";

export const metadata: Metadata = {
  title: "Help centre",
  description: "How to set up Mahina, add members, send WhatsApp fee reminders with UPI links, record payments and share receipts.",
  alternates: { canonical: "/help" },
};

const sections = [
  {
    id: "setup",
    title: "Getting started",
    items: [
      { q: "How do I set up my account?", a: "Sign up with your email, then open Settings and add your business name and your UPI ID (for example yourname@okhdfcbank). The UPI ID is what your members pay into, so double-check it." },
      { q: "Where do I find my UPI ID?", a: "Open GPay, PhonePe, Paytm or your bank's app and look at your profile. It looks like name@bank, for example ravi.kumar@okaxis." },
      { q: "Can I use Mahina on my phone?", a: "Yes. Open Mahina in Chrome or Safari and choose \"Add to Home screen\" to use it like an app." },
    ],
  },
  {
    id: "members",
    title: "Members",
    items: [
      { q: "How do I add a member?", a: "Go to Members and tap Add member. Enter the name, the WhatsApp number of whoever pays (a parent, for students), the monthly fee and the due day." },
      { q: "What is the due day?", a: "The day of the month the fee is expected, from 1 to 28. Until that day the current month shows as upcoming; after it, unpaid months show as due." },
      { q: "A member joined in an earlier month. How do I add their history?", a: "Set the start month when adding them. Mahina creates every month from then on, and you can record past payments against each month." },
      { q: "Someone left. Should I delete them?", a: "Mark them inactive instead. They stop counting for future months but their history and any pending dues remain. Deleting removes their payments too." },
    ],
  },
  {
    id: "reminders",
    title: "Reminders and payments",
    items: [
      { q: "How do reminders work?", a: "Tap Remind next to a member. Mahina opens WhatsApp with a ready message containing the amount, the months and a payment link. You review it and press send from your own WhatsApp." },
      { q: "What does the payment link show?", a: "A page with your business name, the member's first name, the amount due, your UPI QR code and a button that opens their UPI app with the amount filled in. No other details are shown." },
      { q: "Does Mahina detect payments automatically?", a: "No. Payments go straight from your member to your bank through UPI, so Mahina doesn't see them. When you see the money arrive, tap Record payment. This is what keeps it commission-free." },
      { q: "How do I share a receipt?", a: "After recording a payment, tap Send receipt. WhatsApp opens with a receipt link the member can view or print." },
    ],
  },
  {
    id: "billing",
    title: "Plans and billing",
    items: [
      { q: "What does the free plan include?", a: "Everything, for up to 15 members." },
      { q: "How do I upgrade to Pro?", a: "Open Billing in the app and choose monthly (₹149) or yearly (₹1,490). Pay with UPI, card or net banking through Razorpay. Pro starts immediately." },
      { q: "What happens when Pro ends?", a: "Your data stays. You can keep using all existing members; adding new ones beyond 15 needs Pro again." },
    ],
  },
];

export default function Help() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: sections.flatMap((s) => s.items).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Help centre</h1>
      <p className="mt-4 text-lg text-muted">Answers to the most common questions. Can&apos;t find yours? <Link href="/contact" className="font-semibold text-ink underline">Write to us</Link> and we&apos;ll reply within one working day.</p>
      <nav aria-label="Help topics" className="mt-8 flex flex-wrap gap-2">
        {sections.map((s) => <a key={s.id} href={`#${s.id}`} className="rounded-full border border-line px-4 py-2 hover:border-ink hover:text-ink">{s.title}</a>)}
      </nav>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-14 scroll-mt-20">
          <Faq heading={s.title} items={s.items} schema={false} />
        </section>
      ))}
    </div>
  );
}
