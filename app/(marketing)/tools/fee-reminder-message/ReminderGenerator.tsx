"use client";
import { useMemo, useState } from "react";
import { reminderText, waLink, type Lang, type Tone } from "@/lib/reminders";

export function ReminderGenerator() {
  const [name, setName] = useState("Aarav");
  const [business, setBusiness] = useState("Sharma Tuition Classes");
  const [amount, setAmount] = useState("1500");
  const [months, setMonths] = useState("October");
  const [upi, setUpi] = useState("");
  const [lang, setLang] = useState<Lang>("hinglish");
  const [tone, setTone] = useState<Tone>("gentle");
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    const amt = amount ? `₹${Number(amount.replace(/\D/g, "") || 0).toLocaleString("en-IN")}` : "₹—";
    let t = reminderText(lang, { name: name || "—", business: business || "—", amount: amt, months: months || "—", tone });
    if (upi) t += lang === "hi" ? `\nUPI ID: ${upi}` : `\nUPI ID: ${upi}`;
    return t;
  }, [name, business, amount, months, upi, lang, tone]);

  const field = "mt-1 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base outline-none focus:border-ink focus:ring-2 focus:ring-ink/20";

  return (
    <div className="mt-10 grid gap-8 rounded-3xl border border-line bg-surface p-5 sm:p-8 md:grid-cols-2">
      <form className="grid gap-4" onSubmit={(e) => e.preventDefault()} aria-label="Reminder details">
        <label className="text-sm font-medium">Student or customer name<input className={field} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} /></label>
        <label className="text-sm font-medium">Your business name<input className={field} value={business} onChange={(e) => setBusiness(e.target.value)} maxLength={60} /></label>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm font-medium">Amount (₹)<input className={field} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} maxLength={9} /></label>
          <label className="text-sm font-medium">For month<input className={field} value={months} onChange={(e) => setMonths(e.target.value)} maxLength={30} /></label>
        </div>
        <label className="text-sm font-medium">Your UPI ID (optional)<input className={field} value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@okhdfcbank" maxLength={64} /></label>
        <fieldset>
          <legend className="text-sm font-medium">Language</legend>
          <div className="mt-1 flex gap-2">
            {(["hinglish", "hi", "en"] as Lang[]).map((l) => (
              <button type="button" key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold ring-1 ${lang === l ? "bg-ink text-white ring-ink" : "bg-white ring-line"}`}>
                {l === "hi" ? "हिंदी" : l === "en" ? "English" : "Hinglish"}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">Tone</legend>
          <div className="mt-1 flex gap-2">
            {(["gentle", "firm"] as Tone[]).map((t) => (
              <button type="button" key={t} onClick={() => setTone(t)} aria-pressed={tone === t}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold capitalize ring-1 ${tone === t ? "bg-ink text-white ring-ink" : "bg-white ring-line"}`}>{t}</button>
            ))}
          </div>
        </fieldset>
      </form>
      <div>
        <p className="text-sm font-medium">Your message</p>
        <pre aria-live="polite" className="mt-1 min-h-[220px] whitespace-pre-wrap rounded-2xl bg-[#d9fdd3] p-5 font-sans text-[1.02rem] leading-relaxed text-[#111b21]">{text}</pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="rounded-xl bg-ink px-5 py-3 font-semibold text-white hover:bg-ink-dark"
            onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {} }}>
            {copied ? "Copied" : "Copy message"}
          </button>
          <a href={waLink(null, text)} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-[#0b3d20] hover:brightness-95">Open in WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
