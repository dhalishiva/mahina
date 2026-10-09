"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { currentPeriod, inr, monthLabel, type MemberStatus } from "@/lib/dues";
import { Alert, Button } from "@/components/ui";
import { Initials, PageTitle, Sheet, Stat, StatusPill } from "./bits";
import { BulkAddForm, MemberForm, PaymentSheet, ReminderSheet, WaIcon } from "./sheets";
import { SITE } from "@/lib/site";

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function Loading() {
  return <div className="grid min-h-[40vh] place-items-center text-muted" role="status">Loading your register…</div>;
}

/* ---------------- DASHBOARD ---------------- */
export function DashboardView() {
  const { profile, statuses, payments, loading, error } = useStore();
  const [remind, setRemind] = useState<MemberStatus | null>(null);
  const [pay, setPay] = useState<MemberStatus | null>(null);
  const cur = currentPeriod();

  const s = useMemo(() => {
    const active = statuses.filter((x) => x.member.active);
    const collected = payments.filter((p) => p.period === cur).reduce((a, p) => a + Number(p.amount), 0);
    const expected = active.reduce((a, x) => a + Number(x.member.monthly_fee), 0);
    const outstanding = active.reduce((a, x) => a + x.outstanding, 0);
    const toRemind = active.filter((x) => x.outstanding > 0).sort((a, b) => b.dueMonths - a.dueMonths || b.outstanding - a.outstanding);
    const paidCount = active.filter((x) => x.currentStatus === "paid").length;
    return { active, collected, expected, outstanding, toRemind, paidCount };
  }, [statuses, payments, cur]);

  if (loading) return <Loading />;
  const first = (profile?.full_name || "").split(" ")[0];
  const recent = payments.slice(0, 6);
  const byId = new Map(statuses.map((x) => [x.member.id, x]));
  const pct = s.expected ? Math.min(100, Math.round((s.collected / s.expected) * 100)) : 0;

  return (
    <>
      <PageTitle
        title={`${greeting()}${first ? `, ${first}` : ""}`}
        sub={`${monthLabel(cur, "long")} at ${profile?.business_name || "your business"}`}
        action={<Link href="/app/members?add=1" className="rounded-xl bg-ink px-4 py-2.5 font-semibold text-white hover:bg-ink-dark">Add member</Link>}
      />
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}
      {!profile?.upi_id && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink-soft p-4">
          <p className="text-ink"><b>Add your UPI ID</b> so reminders include a payment link with your QR code.</p>
          <Link href="/app/settings" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">Add UPI ID</Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Collected this month" value={inr(s.collected)} sub={`${pct}% of ${inr(s.expected)}`} tone="paid" />
        <Stat label="Pending" value={inr(s.outstanding)} sub={`${s.toRemind.length} ${s.toRemind.length === 1 ? "person" : "people"} owe`} tone="due" />
        <Stat label="Paid this month" value={`${s.paidCount} of ${s.active.length}`} sub="active members" />
        <Stat label="Members" value={String(s.active.length)} sub={statuses.length > s.active.length ? `${statuses.length - s.active.length} inactive` : "all active"} />
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white ring-1 ring-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Share of this month's fees collected">
        <div className="h-full rounded-full bg-paid" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl bg-white ring-1 ring-line" aria-labelledby="remind-h">
          <div className="flex items-center justify-between border-b border-line px-4 py-3.5 sm:px-5">
            <h2 id="remind-h" className="font-display text-lg font-bold">To remind</h2>
            <span className="text-sm text-muted">{s.toRemind.length} pending</span>
          </div>
          {s.toRemind.length === 0 ? (
            <p className="px-5 py-10 text-center text-muted">{s.active.length ? "Everyone has paid. Nothing to chase this month." : "Add your first members to see who owes what."}</p>
          ) : (
            <ul className="divide-y divide-line">
              {s.toRemind.slice(0, 8).map((x) => (
                <li key={x.member.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <Initials name={x.member.name} tone="due" />
                  <Link href={`/app/members/${x.member.id}`} className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{x.member.name}</p>
                    <p className="truncate text-sm text-muted">
                      <span className="font-semibold text-due">{inr(x.outstanding)}</span> · {x.dueMonths} {x.dueMonths === 1 ? "month" : "months"}{x.member.batch ? ` · ${x.member.batch}` : ""}
                    </p>
                  </Link>
                  <button onClick={() => setPay(x)} className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-ink-soft sm:block">Mark paid</button>
                  <button onClick={() => setRemind(x)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-[#0b3d20]"><WaIcon /> Remind</button>
                </li>
              ))}
            </ul>
          )}
          {s.toRemind.length > 8 && <Link href="/app/members?filter=due" className="block border-t border-line px-5 py-3 text-center text-sm font-semibold text-ink">See all {s.toRemind.length}</Link>}
        </section>

        <section className="rounded-2xl bg-white ring-1 ring-line" aria-labelledby="recent-h">
          <div className="border-b border-line px-4 py-3.5 sm:px-5"><h2 id="recent-h" className="font-display text-lg font-bold">Recent payments</h2></div>
          {recent.length === 0 ? <p className="px-5 py-10 text-center text-muted">Payments you record will appear here.</p> : (
            <ul className="divide-y divide-line">
              {recent.map((p) => {
                const m = byId.get(p.member_id)?.member;
                return (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{m?.name || "Member"}</p>
                      <p className="text-sm text-muted">{monthLabel(p.period)} · {p.method.toUpperCase()} · {new Date(p.paid_on + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </div>
                    <span className="font-display font-bold text-paid">+{inr(p.amount)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <ReminderSheet st={remind} onClose={() => setRemind(null)} />
      <PaymentSheet st={pay} onClose={() => setPay(null)} />
    </>
  );
}

/* ---------------- MEMBERS ---------------- */
type Filter = "all" | "due" | "paid" | "inactive";

export function MembersView({ initialAdd = false, initialFilter = "all" as Filter }) {
  const { statuses, loading, isPro, members } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [batch, setBatch] = useState("");
  const [adding, setAdding] = useState<"one" | "many" | null>(initialAdd ? "one" : null);
  const [remind, setRemind] = useState<MemberStatus | null>(null);
  const batches = useMemo(() => [...new Set(members.map((m) => m.batch).filter(Boolean))] as string[], [members]);

  const list = useMemo(() => statuses.filter((x) => {
    if (filter === "inactive" ? x.member.active : !x.member.active) return false;
    if (filter === "due" && x.outstanding <= 0) return false;
    if (filter === "paid" && x.currentStatus !== "paid") return false;
    if (batch && x.member.batch !== batch) return false;
    if (q && !(`${x.member.name} ${x.member.phone || ""} ${x.member.batch || ""}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [statuses, filter, batch, q]);

  if (loading) return <Loading />;
  const atLimit = !isPro && members.length >= SITE.freeLimit;

  function exportCsv() {
    const rows = [["Name", "Phone", "Batch", "Monthly fee", "Due day", "Status this month", "Outstanding", "Months due", "Active"]];
    for (const x of statuses) rows.push([x.member.name, x.member.phone || "", x.member.batch || "", String(x.member.monthly_fee), String(x.member.due_day), x.currentStatus, String(x.outstanding), String(x.dueMonths), x.member.active ? "yes" : "no"]);
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""').replace(/^[=+\-@]/, "'$&")}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = `mahina-members-${currentPeriod().slice(0, 7)}.csv`;
    a.click();
  }

  return (
    <>
      <PageTitle
        title="Members"
        sub={`${members.filter((m) => m.active).length} active${!isPro ? ` · ${members.length} of ${SITE.freeLimit} on the free plan` : ""}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv} className="hidden sm:inline-flex">Export CSV</Button>
            <Button variant="outline" onClick={() => setAdding("many")} disabled={atLimit}>Add several</Button>
            <Button onClick={() => setAdding("one")} disabled={atLimit}>Add member</Button>
          </div>
        }
      />
      {atLimit && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink-soft p-4">
          <p className="text-ink">You&apos;ve reached {SITE.freeLimit} members on the free plan.</p>
          <Link href="/app/billing" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">Upgrade to Pro, ₹149/month</Link>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone or batch" aria-label="Search members"
          className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none focus:border-ink focus:ring-2 focus:ring-ink/20 sm:max-w-xs" />
        <div className="flex gap-1.5 overflow-x-auto" role="group" aria-label="Filter">
          {(["all", "due", "paid", "inactive"] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize ${filter === f ? "bg-text text-white" : "bg-white text-muted ring-1 ring-line"}`}>
              {f === "due" ? "Owes money" : f === "paid" ? "Paid this month" : f}
            </button>
          ))}
        </div>
        {batches.length > 0 && (
          <select value={batch} onChange={(e) => setBatch(e.target.value)} aria-label="Batch" className="rounded-xl border border-line bg-white px-3 py-2 text-sm sm:ml-auto">
            <option value="">All batches</option>
            {batches.map((b) => <option key={b}>{b}</option>)}
          </select>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-line">
        {list.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-semibold">{members.length ? "No members match this filter." : "Your register is empty."}</p>
            {!members.length && <p className="mt-1 text-muted">Add the people who pay you every month. You can paste a whole batch at once.</p>}
            {!members.length && <div className="mt-5 flex justify-center gap-2"><Button onClick={() => setAdding("one")}>Add member</Button><Button variant="outline" onClick={() => setAdding("many")}>Add several</Button></div>}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((x) => (
              <li key={x.member.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <Initials name={x.member.name} tone={x.outstanding > 0 ? "due" : "paid"} />
                <Link href={`/app/members/${x.member.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{x.member.name}</p>
                  <p className="truncate text-sm text-muted">{inr(x.member.monthly_fee)}/mo · due {ordinal(x.member.due_day)}{x.member.batch ? ` · ${x.member.batch}` : ""}</p>
                </Link>
                <div className="flex flex-col items-end gap-1">
                  <StatusPill status={x.outstanding > 0 ? "due" : x.currentStatus} amount={x.outstanding > 0 ? inr(x.outstanding) : undefined} />
                  {x.outstanding > 0 && x.member.active && (
                    <button onClick={() => setRemind(x)} className="text-xs font-semibold text-[#128C7E] hover:underline">Remind on WhatsApp</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Sheet open={adding === "one"} onClose={() => setAdding(null)} title="Add member">
        {adding === "one" && <MemberForm onDone={() => setAdding(null)} />}
      </Sheet>
      <Sheet open={adding === "many"} onClose={() => setAdding(null)} title="Add several members">
        {adding === "many" && <BulkAddForm onDone={() => setAdding(null)} />}
      </Sheet>
      <ReminderSheet st={remind} onClose={() => setRemind(null)} />
    </>
  );
}

export const ordinal = (n: number) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");

/* ---------------- MEMBER DETAIL ---------------- */
export function MemberDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { statuses, payments, loading, updateMember, deleteMember, deletePayment, origin } = useStore();
  const [remind, setRemind] = useState(false);
  const [pay, setPay] = useState<{ period?: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (loading) return <Loading />;
  const st = statuses.find((x) => x.member.id === id);
  if (!st) return <div className="py-20 text-center"><p className="font-semibold">Member not found.</p><Link href="/app/members" className="mt-3 inline-block text-ink underline">Back to members</Link></div>;
  const m = st.member;
  const mine = payments.filter((p) => p.member_id === id);
  const paidTotal = mine.reduce((a, p) => a + Number(p.amount), 0);

  return (
    <>
      <Link href="/app/members" className="text-sm font-semibold text-ink">‹ Members</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Initials name={m.name} tone={st.outstanding > 0 ? "due" : "paid"} />
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{m.name}</h1>
            <p className="text-muted">{inr(m.monthly_fee)} a month · due on the {ordinal(m.due_day)}{m.batch ? ` · ${m.batch}` : ""}{!m.active ? " · inactive" : ""}</p>
            {m.phone && <p className="text-sm text-muted">{m.phone}</p>}
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button onClick={() => setRemind(true)} disabled={!m.active} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 font-semibold text-[#0b3d20] disabled:opacity-50 sm:flex-none"><WaIcon /> Remind</button>
          <Button className="flex-1 sm:flex-none" onClick={() => setPay({})}>Record payment</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Outstanding" value={inr(st.outstanding)} tone={st.outstanding > 0 ? "due" : "paid"} sub={st.dueMonths ? `${st.dueMonths} ${st.dueMonths === 1 ? "month" : "months"}` : "all clear"} />
        <Stat label="Paid so far" value={inr(paidTotal)} sub={`${mine.length} payments`} />
        <Stat label="Since" value={monthLabel(m.start_month)} sub={`${st.months.length} months`} />
      </div>

      <section className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-line sm:p-5" aria-labelledby="months-h">
        <h2 id="months-h" className="font-display text-lg font-bold">Month by month</h2>
        <p className="text-sm text-muted">Tap a month that isn&apos;t paid to record a payment for it.</p>
        <ol className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {[...st.months].reverse().slice(0, 18).map((ms) => {
            const c = ms.status === "paid" ? "bg-paid-soft text-paid ring-paid/30" : ms.status === "upcoming" ? "bg-surface text-muted ring-line" : "bg-due-soft text-due ring-due/30";
            return (
              <li key={ms.period}>
                <button disabled={ms.status === "paid"} onClick={() => setPay({ period: ms.period })}
                  className={`w-full rounded-xl px-2 py-2.5 text-center ring-1 ${c} disabled:cursor-default`}>
                  <span className="block text-sm font-bold">{monthLabel(ms.period)}</span>
                  <span className="block text-xs font-semibold">{ms.status === "paid" ? "Paid" : ms.status === "partial" ? `${inr(ms.fee - ms.paid)} left` : ms.status === "upcoming" ? "Upcoming" : "Due"}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-6 rounded-2xl bg-white ring-1 ring-line" aria-labelledby="hist-h">
        <h2 id="hist-h" className="border-b border-line px-4 py-3.5 font-display text-lg font-bold sm:px-5">Payments</h2>
        {mine.length === 0 ? <p className="px-5 py-8 text-center text-muted">No payments recorded yet.</p> : (
          <ul className="divide-y divide-line">
            {mine.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="font-semibold">{inr(p.amount)} <span className="font-normal text-muted">for {monthLabel(p.period, "long")}</span></p>
                  <p className="truncate text-sm text-muted">#{p.receipt_no} · {p.method.toUpperCase()} · {new Date(p.paid_on + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}{p.note ? ` · ${p.note}` : ""}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <a href={`${origin}/r/${p.receipt_token}`} target="_blank" rel="noopener noreferrer" className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink hover:bg-ink-soft">Receipt</a>
                  <button onClick={async () => { if (confirm("Delete this payment? The month will show as unpaid again.")) await deletePayment(p.id); }} className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-muted hover:text-due" aria-label={`Delete payment of ${inr(p.amount)}`}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setEditing(true)}>Edit details</Button>
        <Button variant="outline" onClick={() => updateMember(m.id, { active: !m.active })}>{m.active ? "Mark inactive" : "Mark active"}</Button>
        <Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete member</Button>
      </div>

      <ReminderSheet st={remind ? st : null} onClose={() => setRemind(false)} />
      <PaymentSheet st={pay ? st : null} period={pay?.period} onClose={() => setPay(null)} />
      <Sheet open={editing} onClose={() => setEditing(false)} title="Edit member">
        {editing && <MemberForm member={m} onDone={() => setEditing(false)} />}
      </Sheet>
      <Sheet open={confirmDelete} onClose={() => setConfirmDelete(false)} title={`Delete ${m.name}?`}>
        <p className="text-muted">This permanently deletes {m.name} and all {mine.length} recorded payments. To keep their history, mark them inactive instead.</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={async () => { const e = await deleteMember(m.id); if (!e) router.replace("/app/members"); }}>Delete permanently</Button>
        </div>
      </Sheet>
    </>
  );
}
