import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/marketing/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Ask Parents for Tuition Fees Politely (with Hindi Message Samples)",
  description: "A practical guide for tutors and small businesses in India on asking for pending fees without awkwardness — timing, wording, WhatsApp message samples in Hindi and English, and how to handle repeat late payers.",
  alternates: { canonical: "/guides/how-to-ask-for-fees-politely" },
  openGraph: { type: "article" },
};

export default function Guide() {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Article",
        headline: "How to ask parents for tuition fees politely",
        datePublished: "2026-10-09", dateModified: "2026-10-09",
        author: { "@type": "Organization", name: "SlotRecover" },
        publisher: { "@type": "Organization", name: "SlotRecover", logo: { "@type": "ImageObject", url: `${SITE.url}/icon-512.png` } },
        mainEntityOfPage: `${SITE.url}/guides/how-to-ask-for-fees-politely`,
      }} />
      <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">How to ask for fees politely, without the awkwardness</h1>
      <p className="mt-4 text-muted">A guide for tutors, coaches, tiffin services and anyone else paid by the month.</p>

      <div className="prose-legal mt-10 text-[1.08rem]">
        <p>Almost every small teacher or service provider in India has the same problem: the work is easy to talk about, but money isn&apos;t. Parents are friendly, customers are regulars, and asking &ldquo;fees kab doge?&rdquo; feels like it could spoil the relationship. So the ask gets delayed, and one late month becomes two.</p>
        <p>Here is what actually works.</p>

        <h2>1. Set the rule once, in writing, at the start</h2>
        <p>When a new student or customer joins, send one short message with the monthly fee, the due date and your UPI ID. Something like: &ldquo;Fees are ₹1,500 per month, due by the 5th. UPI: sharma@okaxis.&rdquo; Later reminders then refer back to an agreement rather than feeling like a fresh demand.</p>

        <h2>2. Remind in writing, not in person</h2>
        <p>Asking at the gate in front of the child, or at the door in front of family, is what makes it awkward. A WhatsApp message is private, can be read later, and gives the other person a moment to pay without having to respond to you face to face.</p>

        <h2>3. Be specific: name, month, amount</h2>
        <p>&ldquo;Please clear pending fees&rdquo; makes people reply asking how much. &ldquo;Aarav ki October ki fees ₹1,500 due hai&rdquo; can be paid immediately.</p>

        <h2>4. Put the payment option in the same message</h2>
        <p>Include your UPI ID, or better, a link that opens their UPI app with the amount filled in. Every extra step — finding your number, typing the amount — loses some people until &ldquo;later&rdquo;.</p>

        <h2>5. Leave a graceful exit</h2>
        <p>End with &ldquo;If you have already paid, please ignore this message.&rdquo; Payments do cross, and this line means nobody feels accused.</p>

        <h2>Sample messages</h2>
        <h3>Gentle, Hinglish</h3>
        <p>Namaste 🙏 Sharma Tuition Classes: Aarav ki October ki fees ₹1,500 due hai. UPI: sharma@okaxis. Agar payment ho gaya hai toh is message ko ignore karein. Thank you!</p>
        <h3>Gentle, Hindi</h3>
        <p>नमस्ते 🙏 शर्मा ट्यूशन क्लासेज़: आरव की अक्टूबर की फीस ₹1,500 देय है। UPI: sharma@okaxis. अगर भुगतान हो गया है तो कृपया इस संदेश को अनदेखा करें। धन्यवाद!</p>
        <h3>Firm, English (second reminder)</h3>
        <p>Hello, Sharma Tuition Classes: the fee of ₹3,000 for Aarav (September and October) is still pending. Please clear it by Friday. UPI: sharma@okaxis. Thank you.</p>
        <p>You can generate these with your own details using the free <Link href="/tools/fee-reminder-message">fee reminder message generator</Link>.</p>

        <h2>6. Handle repeat late payers kindly but clearly</h2>
        <p>If someone is late every month, talk once, privately: ask whether a different due date would suit them, for example after their salary date. Many &ldquo;late payers&rdquo; are simply paid on the 7th, not the 1st. If someone is two months behind, it&apos;s reasonable to pause the service until dues are cleared, as long as you said so at the start.</p>

        <h2>7. Send receipts</h2>
        <p>A receipt after every payment builds trust and ends the &ldquo;I already paid last month&rdquo; argument before it starts.</p>

        <h2>Let a tool do the remembering</h2>
        <p><Link href="/">Mahina</Link> keeps a register of who has paid each month, writes these reminders with the right name, month and amount, adds a UPI payment link, and sends receipts. It&apos;s free to try with up to 2 members.</p>
      </div>
    </article>
  );
}
