import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEGMENTS, segmentBySlug } from "@/lib/segments";
import { Faq } from "@/components/marketing/Faq";
import { JsonLd } from "@/components/marketing/JsonLd";
import { reminderText } from "@/lib/reminders";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return SEGMENTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = segmentBySlug((await params).slug);
  if (!s) return {};
  return {
    title: { absolute: `${s.title} | Mahina` },
    description: s.description,
    alternates: { canonical: `/for/${s.slug}` },
    openGraph: { title: s.h1, description: s.description, url: `${SITE.url}/for/${s.slug}` },
  };
}

export default async function SegmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = segmentBySlug((await params).slug);
  if (!s) notFound();
  const sample = reminderText("hinglish", {
    name: s.example[1].name, business: "Your business", amount: `₹${s.example[1].fee.toLocaleString("en-IN")}`, months: "Oct",
    link: `${SITE.url.replace("https://", "")}/p/…`,
  });
  const others = SEGMENTS.filter((o) => o.slug !== s.slug).slice(0, 5);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Mahina", item: SITE.url },
            { "@type": "ListItem", position: 2, name: s.h1, item: `${SITE.url}/for/${s.slug}` },
          ],
        }}
      />
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted"><Link href="/" className="hover:underline">Mahina</Link> <span aria-hidden>/</span> <span className="capitalize">{s.who}</span></nav>
        <div className="mt-6 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">{s.h1}</h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">{s.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-xl bg-ink px-6 py-3.5 font-semibold text-white hover:bg-ink-dark">Start free for {SITE.freeLimit} {s.memberWord}s</Link>
              <Link href="/pricing" className="rounded-xl px-5 py-3.5 font-semibold text-ink hover:bg-ink-soft">See pricing</Link>
            </div>
          </div>
          <div className="register rounded-2xl border border-rule bg-white pb-4 pl-[60px] pr-5 pt-5" aria-label={`Example ${s.memberWord} list`}>
            <p className="font-hand text-xl text-ink">This month</p>
            <ul className="mt-2">
              {s.example.map((e, i) => (
                <li key={e.name} className="flex h-11 items-center justify-between gap-3">
                  <span className="font-hand text-lg">{e.name} <span className="text-sm text-muted">· {e.batch}</span></span>
                  {i === 1 ? <span className="font-hand text-due">due ₹{e.fee.toLocaleString("en-IN")}</span>
                    : <span className="-rotate-6 rounded border-2 border-paid px-1.5 font-display text-xs font-extrabold text-paid">PAID</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Sound familiar?</h2>
          <ul className="mt-6 space-y-4">
            {s.pains.map((p) => (
              <li key={p} className="flex gap-3 text-lg"><span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-margin" />{p}</li>
            ))}
          </ul>
          <h2 className="mt-12 font-display text-3xl font-bold tracking-tight">What Mahina does for {s.who}</h2>
          <ul className="mt-6 space-y-3 text-lg text-muted">
            <li>Every {s.memberWord} with their own monthly amount and due date</li>
            <li>A live list of who is paid, partly paid and due this month</li>
            <li>WhatsApp reminders in Hindi, Hinglish or English with your UPI QR</li>
            <li>Receipts you can share after every payment</li>
            <li>Money goes straight to your UPI ID with zero commission</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">A reminder Mahina writes for you</h2>
          <pre className="mt-6 whitespace-pre-wrap rounded-2xl bg-[#d9fdd3] p-5 font-sans text-[1.02rem] leading-relaxed text-[#111b21]">{sample}</pre>
          <p className="mt-4 text-muted">
            Need just the message? Use the free <Link href="/tools/fee-reminder-message" className="font-semibold text-ink underline">fee reminder message generator</Link>.
          </p>
        </div>
      </section>

      <div className="h-20" />
      <Faq items={[...s.faqs, { q: "Is Mahina free?", a: `Yes, for up to ${SITE.freeLimit} ${s.memberWord}s. Pro is ₹149 a month for unlimited ${s.memberWord}s.` }]} />

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-xl font-bold">Mahina is also used by</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}><Link href={`/for/${o.slug}`} className="inline-block rounded-full border border-line px-4 py-2 capitalize hover:border-ink hover:text-ink">{o.who}</Link></li>
          ))}
        </ul>
      </section>
    </>
  );
}
