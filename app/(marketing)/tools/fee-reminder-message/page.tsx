import type { Metadata } from "next";
import Link from "next/link";
import { ReminderGenerator } from "./ReminderGenerator";
import { Faq } from "@/components/marketing/Faq";

export const metadata: Metadata = {
  title: "Fee Reminder Message Generator — Hindi & English WhatsApp Templates (Free)",
  description: "Free tool to write a polite fee reminder message for WhatsApp in Hindi, Hinglish or English. Works for tuition fees, school fees, rent, gym and tiffin payments. Copy or send in one tap.",
  alternates: { canonical: "/tools/fee-reminder-message" },
};

export default function Page() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">Fee reminder message generator</h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">
          Write a polite payment reminder for WhatsApp in Hindi, Hinglish or English. Fill in the details, pick a tone, then copy the message or open it straight in WhatsApp. Free, with no sign-up.
        </p>
        <ReminderGenerator />
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">How to write a fee reminder people don&apos;t mind receiving</h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          <p>Keep it short and specific. Say whose fee it is, for which month, and the exact amount. Vague messages like &ldquo;please clear pending dues&rdquo; invite a reply asking how much, which delays payment by a day.</p>
          <p>Make paying easy. A UPI ID or QR in the same message means the parent or customer can pay while they still have the message open. Every extra step loses some people.</p>
          <p>Give a graceful exit. Adding &ldquo;if you have already paid, please ignore this&rdquo; protects the relationship when payments cross in the post.</p>
          <p>Send it in the morning, a day or two after the due date. People pay more readily early in the day and early in the month, when salary has just arrived.</p>
        </div>
        <p className="mt-8 rounded-2xl bg-ink-soft p-6 text-lg">
          Sending these every month? <Link href="/signup" className="font-semibold text-ink underline">Mahina</Link> fills in the name, amount and month for every member, adds your personal UPI payment link, and keeps track of who paid. Free for up to 15 members.
        </p>
      </section>

      <div className="h-20" />
      <Faq
        items={[
          { q: "How do I write a fee reminder message in Hindi?", a: "Start with नमस्ते, mention the student's name, the month and the exact amount, add your UPI ID, and end with धन्यवाद. The generator above writes the full message for you in Hindi or Hinglish." },
          { q: "Is it rude to send a fee reminder on WhatsApp?", a: "No, when it's polite and specific. Most people pay late because they forgot, and a short reminder with the amount and a way to pay is usually welcome." },
          { q: "When should I send a fee reminder?", a: "One to three days after the due date works well. A second, firmer reminder a week later is reasonable if the fee is still pending." },
        ]}
      />
    </>
  );
}
