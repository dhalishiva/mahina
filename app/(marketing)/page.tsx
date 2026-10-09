import Link from "next/link";
import Image from "next/image";
import { RegisterHero } from "@/components/marketing/RegisterHero";
import { Faq } from "@/components/marketing/Faq";
import { JsonLd } from "@/components/marketing/JsonLd";
import { SEGMENTS } from "@/lib/segments";
import { SITE } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

const FAQS = [
  { q: "Does the money go to Mahina?", a: "No. Your members pay straight into your own UPI ID through GPay, PhonePe, Paytm or any UPI app. Mahina never touches your money and charges no commission." },
  { q: "Do my students or customers need to install anything?", a: "No. They receive a normal WhatsApp message from your number with a link. The link opens a page with your UPI QR code, the exact amount, and a button that opens their UPI app." },
  { q: "How does Mahina know someone has paid?", a: "You record the payment in one tap when you see it in your UPI app or receive cash. This keeps the money in your account with no gateway fees, and you stay in control of what counts as paid." },
  { q: "Can I send reminders in Hindi?", a: "Yes. Reminders can go in Hindi, Hinglish or English, in a gentle or firm tone." },
  { q: "What does it cost?", a: `Free for up to ${SITE.freeLimit} members, forever. Pro is ₹149 a month or ₹1,490 a year for unlimited members. No card is needed to start.` },
  { q: "Is my data safe?", a: "Your data is stored in a secured database in Mumbai, India. Every record is locked to your account, and the payment links your members receive show only their first name and the amount due." },
  { q: "Can I use it on my phone?", a: "Yes. Mahina is built for phones first and works in any browser. You can add it to your home screen like an app." },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name: SITE.fullName,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web, Android, iOS",
              url: SITE.url,
              description: SITE.description,
              inLanguage: ["en-IN", "hi-IN"],
              offers: [
                { "@type": "Offer", name: "Free", price: "0", priceCurrency: "INR" },
                { "@type": "Offer", name: "Pro monthly", price: "149", priceCurrency: "INR" },
                { "@type": "Offer", name: "Pro yearly", price: "1490", priceCurrency: "INR" },
              ],
            },
            {
              "@type": "Organization",
              name: "SlotRecover",
              legalName: SITE.legalEntity,
              url: SITE.url,
              logo: `${SITE.url}/icon-512.png`,
              address: { "@type": "PostalAddress", addressLocality: "Noida", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
            },
            { "@type": "WebSite", name: SITE.fullName, url: SITE.url, inLanguage: "en-IN" },
          ],
        }}
      />

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-[-0.03em] text-text sm:text-6xl">
            Get every month&apos;s fees on time, without asking twice.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
            Mahina is the fee register for tutors, tiffin services, gyms and classes. It shows who hasn&apos;t paid, sends them a polite WhatsApp reminder with your UPI QR, and gives them a receipt when they do.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/signup" className="rounded-xl bg-ink px-6 py-3.5 text-lg font-semibold text-white shadow-sm hover:bg-ink-dark">
              Start free
            </Link>
            <Link href="#how" className="rounded-xl px-5 py-3.5 text-lg font-semibold text-ink hover:bg-ink-soft">
              See how it works
            </Link>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <li className="flex items-center gap-2"><Check /> Free for {SITE.freeLimit} members</li>
            <li className="flex items-center gap-2"><Check /> Money goes straight to your UPI</li>
            <li className="flex items-center gap-2"><Check /> Hindi and English reminders</li>
          </ul>
        </div>
        <RegisterHero />
      </section>

      {/* THE AWKWARD ASK */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">The fee was never the hard part. Asking for it was.</h2>
            <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-muted">
              Most people pay late because they forget. But reminding a parent at the gate, a customer at the door or a member mid-workout feels awkward, so you wait. By the 15th you&apos;re unsure who paid in cash, who paid by UPI, and who hasn&apos;t paid at all.
            </p>
            <p className="mt-4 max-w-[34rem] text-lg leading-relaxed text-muted">
              Mahina sends the reminder for you, in your words and from your WhatsApp, with a link that lets them pay in two taps.
            </p>
          </div>
          <WhatsAppPreview />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">Four steps, once a month</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-4">
          {[
            { t: "Add your members", d: "Name, phone number, monthly fee and due date. Import a whole batch in a couple of minutes." },
            { t: "See who owes what", d: "On the due date Mahina marks each person paid, partly paid or due, with the total outstanding." },
            { t: "Send the reminder", d: "One tap opens WhatsApp with a ready message and your personal UPI payment link." },
            { t: "Record and share a receipt", d: "When the money arrives, mark it paid. A receipt link goes back to them on WhatsApp." },
          ].map((s, i) => (
            <li key={s.t} className="relative">
              <span className="font-display text-5xl font-extrabold text-ink/15" aria-hidden>{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{s.t}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* SCREENSHOTS */}
      <section className="overflow-hidden bg-ink py-20 text-white" aria-labelledby="inside-h">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="inside-h" className="max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">What you see when you open Mahina</h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">Real screens from the app, with sample data from a home tuition class.</p>

          <figure className="mt-12">
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20">
              <div className="flex h-8 items-center gap-1.5 border-b border-line bg-surface px-4" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <Image src="/screens/dashboard.webp" alt="Mahina dashboard showing ₹14,800 collected this month, ₹10,200 pending, and a list of members to remind" width={1440} height={900} className="h-auto w-full" priority={false} />
            </div>
            <figcaption className="mt-4 text-white/75">The dashboard: this month&apos;s collection, what&apos;s pending, and who to remind today.</figcaption>
          </figure>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            <Phone src="/screens/member.webp" alt="Member page for Meera Joshi showing a month-by-month payment grid and a WhatsApp reminder button" caption="Each member's month-by-month history, with one-tap reminders." />
            <Phone src="/screens/reminder.webp" alt="Reminder composer with Hindi, Hinglish and English options and a gentle or firm tone" caption="Pick the language and tone. The UPI link is added for you." />
            <Phone src="/screens/paypage.webp" alt="Payment page a parent sees with the amount due, a UPI QR code and a Pay with UPI app button" caption="What your member sees: the amount, your QR, and a pay button." />
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-labelledby="who-h">
        <h2 id="who-h" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Made for anyone paid by the month</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">If people pay you a fixed amount every month, Mahina fits. These are the people who use it most.</p>
        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
          {SEGMENTS.map((s) => (
            <li key={s.slug} className="border-b border-line">
              <Link href={`/for/${s.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <span>
                  <span className="block text-lg font-semibold capitalize group-hover:text-ink">{s.who}</span>
                  <span className="block text-sm text-muted">{s.h1}</span>
                </span>
                <span aria-hidden className="text-ink transition-transform group-hover:translate-x-1">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* PRICING TEASER */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-labelledby="price-h">
        <div className="grid gap-10 rounded-3xl border border-line bg-surface p-8 sm:p-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 id="price-h" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Less than one day&apos;s fee from one student</h2>
            <p className="mt-4 max-w-lg text-lg text-muted">
              Start free with up to {SITE.freeLimit} members. When you grow, Pro is ₹149 a month for unlimited members. If Mahina helps you recover even one late fee, it has paid for itself.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
            <p className="text-muted">Pro</p>
            <p className="mt-1 font-display text-5xl font-extrabold">₹149<span className="text-lg font-semibold text-muted">/month</span></p>
            <p className="mt-1 text-sm text-muted">or ₹1,490 a year, two months free</p>
            <Link href="/pricing" className="mt-5 inline-block rounded-xl bg-ink px-5 py-3 font-semibold text-white hover:bg-ink-dark">Compare plans</Link>
          </div>
        </div>
      </section>

      <div className="h-20" />
      <Faq items={FAQS} />

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Next month, let the register fill itself.</h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted">Set up your first batch in under five minutes. Free, with no card needed.</p>
        <Link href="/signup" className="mt-8 inline-block rounded-xl bg-ink px-7 py-4 text-lg font-semibold text-white hover:bg-ink-dark">Create your free register</Link>
      </section>
    </>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="shrink-0 text-paid"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

function Phone({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      <div className="mx-auto w-full max-w-[300px] rounded-[2.2rem] bg-[#0d1240] p-2.5 shadow-2xl ring-1 ring-white/15">
        <div className="overflow-hidden rounded-[1.75rem] bg-white">
          <Image src={src} alt={alt} width={390} height={780} className="h-auto w-full" />
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-[300px] text-white/75">{caption}</figcaption>
    </figure>
  );
}

function WhatsAppPreview() {
  return (
    <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-3xl bg-[#efe7dc] shadow-xl ring-1 ring-black/5" aria-label="Example WhatsApp fee reminder">
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-sm font-bold">DV</div>
        <div>
          <p className="font-semibold leading-tight">Diya&apos;s Mummy</p>
          <p className="text-xs text-white/70">online</p>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-[#d9fdd3] p-3 text-[0.95rem] leading-snug text-[#111b21] shadow-sm">
          Namaste 🙏<br />Sharma Tuition Classes: Diya ki Oct ki fees ₹1,500 due hai.<br />Ek click mein UPI se pay karein:
          <span className="block text-[#027eb5] underline">{SITE.url.replace("https://", "")}/p/7f3c…</span>
          Agar payment ho gaya hai toh ignore karein. Thank you!
          <span className="mt-1 block text-right text-[0.7rem] text-[#667781]">9:02 am ✓✓</span>
        </div>
        <div className="max-w-[70%] rounded-xl rounded-tl-sm bg-white p-3 text-[0.95rem] text-[#111b21] shadow-sm">
          Done ji, paid on PhonePe 👍
          <span className="mt-1 block text-right text-[0.7rem] text-[#667781]">9:14 am</span>
        </div>
      </div>
    </div>
  );
}
