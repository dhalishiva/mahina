"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { currentPeriod, inr, istToday, monthLabel, periodKey, waNumber, type Member, type MemberStatus, type Payment } from "@/lib/dues";
import { receiptText, reminderText, waLink, type Lang, type Tone } from "@/lib/reminders";
import { Alert, Button, Field, Select, fieldCls } from "@/components/ui";
import { Sheet } from "./bits";

export function reminderPieces(st: MemberStatus) {
  const due = st.months.filter((m) => m.status === "due" || m.status === "partial");
  if (due.length === 0) {
    const cur = st.months[st.months.length - 1];
    return { amount: st.member.monthly_fee, months: cur ? monthLabel(cur.period).split(" ")[0] : "" };
  }
  const labels = due.map((m) => monthLabel(m.period).split(" ")[0]);
  const months = labels.length > 3 ? `${labels[0]} to ${labels[labels.length - 1]}` : labels.join(", ");
  return { amount: st.outstanding, months };
}

export function ReminderComposer({ st, onSent }: { st: MemberStatus; onSent?: () => void }) {
  const { profile, origin } = useStore();
  const [lang, setLang] = useState<Lang>(profile?.reminder_lang || "hinglish");
  const [tone, setTone] = useState<Tone>(st.dueMonths > 1 ? "firm" : "gentle");
  const { amount, months } = reminderPieces(st);
  const link = `${origin}/p/${st.member.pay_token}`;
  const text = reminderText(lang, { name: st.member.name, business: profile?.business_name || profile?.full_name || "Your tutor", amount: inr(amount), months, link, tone });
  const num = waNumber(st.member.phone);

  return (
    <div className="space-y-4">
      {!profile?.upi_id && (
        <Alert kind="info">Add your UPI ID in <Link href="/app/settings" className="font-semibold underline">Settings</Link> so the payment link can show your QR code.</Alert>
      )}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Language">
        {(["hinglish", "hi", "en"] as Lang[]).map((l) => (
          <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 ${lang === l ? "bg-ink text-white ring-ink" : "bg-white ring-line"}`}>
            {l === "hi" ? "हिंदी" : l === "en" ? "English" : "Hinglish"}
          </button>
        ))}
        <span className="mx-1 w-px bg-line" aria-hidden />
        {(["gentle", "firm"] as Tone[]).map((t) => (
          <button key={t} type="button" onClick={() => setTone(t)} aria-pressed={tone === t}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ring-1 ${tone === t ? "bg-ink text-white ring-ink" : "bg-white ring-line"}`}>{t}</button>
        ))}
      </div>
      <pre className="whitespace-pre-wrap rounded-2xl bg-[#d9fdd3] p-4 font-sans text-[0.97rem] leading-relaxed text-[#111b21]">{text}</pre>
      {!num && <p className="text-sm text-muted">No phone number saved, so WhatsApp will ask you to pick a chat.</p>}
      <div className="grid grid-cols-2 gap-2">
        <a href={waLink(num, text)} target="_blank" rel="noopener noreferrer" onClick={onSent}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#25D366] px-3 py-3 font-semibold text-[#0b3d20] hover:brightness-95">
          <WaIcon /> Open WhatsApp
        </a>
        <Button variant="outline" type="button" onClick={async () => { try { await navigator.clipboard.writeText(text); } catch {} }}>Copy message</Button>
      </div>
    </div>
  );
}

export function WaIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1.2Z"/></svg>;
}

export function ReminderSheet({ st, onClose }: { st: MemberStatus | null; onClose: () => void }) {
  return (
    <Sheet open={!!st} onClose={onClose} title={st ? `Remind ${st.member.name.split(" ")[0]}` : "Remind"}>
      {st && <ReminderComposer st={st} />}
    </Sheet>
  );
}

export function PaymentSheet({ st, period, onClose }: { st: MemberStatus | null; period?: string; onClose: () => void }) {
  return (
    <Sheet open={!!st} onClose={onClose} title={st ? `Record payment from ${st.member.name.split(" ")[0]}` : "Record payment"}>
      {st && <PaymentForm key={st.member.id + (period || "")} st={st} period={period} onClose={onClose} />}
    </Sheet>
  );
}

function PaymentForm({ st, period, onClose }: { st: MemberStatus; period?: string; onClose: () => void }) {
  const { recordPayment, profile, origin } = useStore();
  const firstOpen = st.months.find((m) => m.status === "due" || m.status === "partial");
  const defaultPeriod = period || firstOpen?.period || currentPeriod();
  const options = useMemo(() => {
    const t = istToday();
    const list = st.months.map((m) => m.period);
    const next = t.m === 12 ? periodKey(t.y + 1, 1) : periodKey(t.y, t.m + 1);
    if (!list.includes(next)) list.push(next);
    return list.reverse();
  }, [st.months]);
  const monthState = (p: string) => st.months.find((m) => m.period === p);
  const [sel, setSel] = useState(defaultPeriod);
  const remaining = Math.max(st.member.monthly_fee - (monthState(sel)?.paid || 0), 0) || st.member.monthly_fee;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<Payment | null>(null);
  const t = istToday();
  const today = `${t.y}-${String(t.m).padStart(2, "0")}-${String(t.d).padStart(2, "0")}`;

  if (saved) {
    const link = `${origin}/r/${saved.receipt_token}`;
    const txt = receiptText({ business: profile?.business_name || "Payment", name: st.member.name, amount: inr(saved.amount), months: monthLabel(saved.period, "long"), link });
    return (
      <div className="space-y-4">
        <Alert kind="ok">Payment of {inr(saved.amount)} recorded for {monthLabel(saved.period, "long")}.</Alert>
        <a href={waLink(waNumber(st.member.phone), txt)} target="_blank" rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-semibold text-[#0b3d20]"><WaIcon /> Send receipt on WhatsApp</a>
        <Button variant="outline" className="w-full" onClick={onClose}>Done</Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const amount = Number(fd.get("amount"));
        if (!(amount > 0)) { setError("Enter an amount greater than zero."); return; }
        setBusy(true);
        const res = await recordPayment({
          member_id: st.member.id, period: String(fd.get("period")), amount,
          method: String(fd.get("method")) as Payment["method"], paid_on: String(fd.get("paid_on")),
          note: String(fd.get("note") || "").trim() || null,
        });
        setBusy(false);
        if (res.error) setError(res.error); else if (res.payment) setSaved(res.payment);
      }}
    >
      <Select label="For month" name="period" value={sel} onChange={(e) => setSel(e.target.value)}>
        {options.map((p) => {
          const ms = monthState(p);
          const tag = !ms ? "advance" : ms.status === "paid" ? "paid" : ms.status === "partial" ? `₹${ms.fee - ms.paid} left` : ms.status;
          return <option key={p} value={p}>{monthLabel(p, "long")} ({tag})</option>;
        })}
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount (₹)" name="amount" type="number" inputMode="decimal" min={1} step="1" defaultValue={remaining} key={sel} required />
        <Field label="Paid on" name="paid_on" type="date" defaultValue={today} max={today} required />
      </div>
      <fieldset>
        <legend className="text-sm font-medium">Paid by</legend>
        <div className="mt-1 grid grid-cols-4 gap-2">
          {[["upi", "UPI"], ["cash", "Cash"], ["bank", "Bank"], ["other", "Other"]].map(([v, l], i) => (
            <label key={v} className="cursor-pointer">
              <input type="radio" name="method" value={v} defaultChecked={i === 0} className="peer sr-only" />
              <span className="block rounded-xl py-2 text-center text-sm font-semibold ring-1 ring-line peer-checked:bg-ink peer-checked:text-white peer-checked:ring-ink peer-focus-visible:outline-2">{l}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-medium">Note (optional)<input name="note" maxLength={200} className={fieldCls} placeholder="e.g. UPI ref 4512…" /></label>
      {error && <Alert>{error}</Alert>}
      <Button disabled={busy} className="w-full py-3">{busy ? "Saving…" : "Record payment"}</Button>
    </form>
  );
}

export function MemberForm({ member, onDone }: { member?: Member; onDone: () => void }) {
  const { addMembers, updateMember } = useStore();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const t = istToday();
  const thisMonth = `${t.y}-${String(t.m).padStart(2, "0")}`;
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const phone = String(fd.get("phone") || "").replace(/[^\d+ ]/g, "").trim();
        const row = {
          name: String(fd.get("name")).trim(),
          phone: phone || null,
          monthly_fee: Number(fd.get("monthly_fee")),
          due_day: Number(fd.get("due_day")),
          batch: String(fd.get("batch") || "").trim() || null,
          start_month: `${fd.get("start_month")}-01`,
          notes: String(fd.get("notes") || "").trim() || null,
        };
        if (!row.name) { setError("Enter a name."); return; }
        if (!(row.monthly_fee > 0)) { setError("Enter the monthly fee."); return; }
        setBusy(true);
        const err = member ? await updateMember(member.id, row) : await addMembers([row]);
        setBusy(false);
        if (err) setError(err); else onDone();
      }}
    >
      <Field label="Name" name="name" required maxLength={80} defaultValue={member?.name} autoComplete="off" />
      <Field label="WhatsApp number of whoever pays" name="phone" type="tel" inputMode="tel" maxLength={16} defaultValue={member?.phone || ""} placeholder="98765 43210" hint="For students, use a parent's number." />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Monthly fee (₹)" name="monthly_fee" type="number" inputMode="numeric" min={1} required defaultValue={member?.monthly_fee} />
        <Field label="Due on day" name="due_day" type="number" min={1} max={28} required defaultValue={member?.due_day ?? 5} hint="1 to 28" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Batch or group" name="batch" maxLength={40} defaultValue={member?.batch || ""} placeholder="Class 10 Maths" />
        <Field label="Start month" name="start_month" type="month" required defaultValue={member?.start_month.slice(0, 7) || thisMonth} />
      </div>
      <label className="block text-sm font-medium">Notes<textarea name="notes" maxLength={300} rows={2} defaultValue={member?.notes || ""} className={fieldCls} /></label>
      {error && <Alert>{error}</Alert>}
      <Button disabled={busy} className="w-full py-3">{busy ? "Saving…" : member ? "Save changes" : "Add member"}</Button>
    </form>
  );
}

export function BulkAddForm({ onDone }: { onDone: () => void }) {
  const { addMembers } = useStore();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const t = istToday();
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const batch = String(fd.get("batch") || "").trim() || null;
        const due = Number(fd.get("due_day")) || 5;
        const lines = String(fd.get("list")).split("\n").map((l) => l.trim()).filter(Boolean);
        const rows = [];
        for (const [i, line] of lines.entries()) {
          const parts = line.split(/[,\t;]/).map((p) => p.trim());
          const fee = Number((parts[2] || "").replace(/[^\d.]/g, ""));
          const phone = (parts[1] || "").replace(/[^\d+ ]/g, "").trim();
          if (!parts[0] || !(fee > 0)) { setError(`Line ${i + 1} needs a name and a fee: "${line}"`); return; }
          rows.push({ name: parts[0].slice(0, 80), phone: phone || null, monthly_fee: fee, due_day: due, batch, start_month: periodKey(t.y, t.m) });
        }
        if (!rows.length) { setError("Paste at least one line."); return; }
        setBusy(true);
        const err = await addMembers(rows);
        setBusy(false);
        if (err) setError(err); else onDone();
      }}
    >
      <label className="block text-sm font-medium">
        One member per line: name, phone, monthly fee
        <textarea name="list" rows={7} required className={`${fieldCls} font-mono text-sm`} placeholder={"Aarav Sharma, 9876543210, 1500\nDiya Verma, 9812345678, 1500\nKabir Singh, , 1200"} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Batch (optional)" name="batch" maxLength={40} />
        <Field label="Due on day" name="due_day" type="number" min={1} max={28} defaultValue={5} />
      </div>
      {error && <Alert>{error}</Alert>}
      <Button disabled={busy} className="w-full py-3">{busy ? "Adding…" : "Add all"}</Button>
    </form>
  );
}
