import { JsonLd } from "./JsonLd";

export function Faq({ items, heading = "Questions people ask", schema = true }: { items: { q: string; a: string }[]; heading?: string; schema?: boolean }) {
  const hid = "faq-" + heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6" aria-labelledby={hid}>
      <h2 id={hid} className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-semibold">
              {f.q}
              <span aria-hidden className="mt-1 text-ink transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-[65ch] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      {schema && <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />}
    </section>
  );
}
