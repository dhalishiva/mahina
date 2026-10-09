"use client";
import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const field = "mt-1 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none focus:border-ink focus:ring-2 focus:ring-ink/20";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) });
    if (res.ok) setState("sent");
    else { setState("error"); setError((await res.json().catch(() => ({}))).error || "Message not sent. Check the fields and try again."); }
  }

  if (state === "sent") {
    return <div className="rounded-3xl bg-paid-soft p-8"><h2 className="font-display text-2xl font-bold text-paid">Message sent</h2><p className="mt-2 text-muted">We&apos;ll reply to your email within one working day.</p></div>;
  }
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <label className="text-sm font-medium">Your name<input name="name" required maxLength={80} className={field} autoComplete="name" /></label>
      <label className="text-sm font-medium">Email<input name="email" type="email" required maxLength={120} className={field} autoComplete="email" /></label>
      <label className="text-sm font-medium">Topic
        <select name="topic" className={field} defaultValue="general">
          <option value="general">General question</option>
          <option value="billing">Billing</option>
          <option value="refund">Refund request</option>
          <option value="bug">Something isn&apos;t working</option>
          <option value="feature">Feature request</option>
        </select>
      </label>
      <label className="text-sm font-medium">Message<textarea name="message" required minLength={5} maxLength={2000} rows={5} className={field} /></label>
      {/* honeypot: hidden from people, filled by bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state === "error" && <p role="alert" className="text-sm text-due">{error}</p>}
      <button disabled={state === "sending"} className="rounded-xl bg-ink px-5 py-3 font-semibold text-white hover:bg-ink-dark disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
