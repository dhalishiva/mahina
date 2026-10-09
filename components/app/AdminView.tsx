"use client";
import { useState } from "react";
import { PageTitle, Stat } from "./bits";
import { Loading } from "./views";
import { Alert } from "@/components/ui";

export type AdminData = {
  stats: {
    users: number; users_7d: number; pro_users: number; members: number; payments_recorded: number; payments_value: number;
    revenue_paise: number; revenue_30d_paise: number; open_tickets: number; signups_by_day: { day: string; n: number }[];
  };
  users: { id: string; email: string | null; business_name: string | null; business_type: string | null; plan: string; plan_expires_at: string | null; member_count: number; created_at: string }[];
  tickets: { id: string; name: string; email: string; topic: string; message: string; status: string; created_at: string }[];
};

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const d = (s: string) => new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });

export function AdminView({ data, error, search, onSearch, onSetPlan, onCloseTicket }: {
  data: AdminData | null; error?: string; search: string;
  onSearch: (q: string) => void; onSetPlan: (id: string, plan: "free" | "pro", days: number) => void; onCloseTicket: (id: string) => void;
}) {
  const [q, setQ] = useState(search);
  const [tab, setTab] = useState<"users" | "tickets">("users");
  if (!data) return error ? <Alert>{error}</Alert> : <Loading />;
  const s = data.stats;
  const max = Math.max(1, ...s.signups_by_day.map((x) => Number(x.n)));
  const isPro = (u: AdminData["users"][number]) => u.plan === "pro" && (!u.plan_expires_at || new Date(u.plan_expires_at) > new Date());
  const mrr = s.pro_users * 149;

  return (
    <>
      <PageTitle title="Admin" sub="Mahina across all accounts" />
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Accounts" value={String(s.users)} sub={`+${s.users_7d} in last 7 days`} />
        <Stat label="Pro accounts" value={String(s.pro_users)} sub={`${s.users ? Math.round((s.pro_users / s.users) * 100) : 0}% conversion · ~${inr(mrr)} MRR`} tone="paid" />
        <Stat label="Revenue" value={inr(s.revenue_paise / 100)} sub={`${inr(s.revenue_30d_paise / 100)} in last 30 days`} tone="paid" />
        <Stat label="Open support" value={String(s.open_tickets)} sub="messages" tone={s.open_tickets ? "due" : undefined} />
        <Stat label="Members tracked" value={s.members.toLocaleString("en-IN")} />
        <Stat label="Payments recorded" value={s.payments_recorded.toLocaleString("en-IN")} />
        <Stat label="Fees tracked for users" value={inr(s.payments_value)} />
        <Stat label="Avg members / account" value={s.users ? (s.members / s.users).toFixed(1) : "0"} />
      </div>

      <section className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-line" aria-labelledby="su-h">
        <h2 id="su-h" className="font-display text-lg font-bold">Sign-ups, last 30 days</h2>
        <div className="mt-4 flex h-32 items-end gap-[3px]" role="img" aria-label={`Sign-ups per day, peak ${max}`}>
          {s.signups_by_day.map((x) => (
            <div key={x.day} title={`${x.day}: ${x.n}`} className="flex-1 rounded-t bg-ink/80" style={{ height: `${Math.max(2, (Number(x.n) / max) * 100)}%`, opacity: Number(x.n) ? 1 : 0.18 }} />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted"><span>{s.signups_by_day[0]?.day}</span><span>today</span></div>
      </section>

      <div className="mt-6 flex gap-2" role="tablist">
        {(["users", "tickets"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === t ? "bg-text text-white" : "bg-white text-muted ring-1 ring-line"}`}>
            {t === "users" ? `Accounts (${data.users.length})` : `Support (${data.tickets.filter((x) => x.status === "open").length} open)`}
          </button>
        ))}
      </div>

      {tab === "users" ? (
        <section className="mt-3 overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          <form className="border-b border-line p-3" onSubmit={(e) => { e.preventDefault(); onSearch(q.trim()); }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email or business" aria-label="Search accounts" className="w-full rounded-xl border border-line px-3 py-2 sm:max-w-sm" />
          </form>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface text-muted"><tr>
                <th className="px-4 py-2.5 font-semibold">Account</th><th className="px-4 py-2.5 font-semibold">Type</th><th className="px-4 py-2.5 font-semibold">Members</th>
                <th className="px-4 py-2.5 font-semibold">Plan</th><th className="px-4 py-2.5 font-semibold">Joined</th><th className="px-4 py-2.5 font-semibold"><span className="sr-only">Actions</span></th>
              </tr></thead>
              <tbody className="divide-y divide-line">
                {data.users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-2.5"><p className="font-semibold">{u.business_name || "—"}</p><p className="text-muted">{u.email}</p></td>
                    <td className="px-4 py-2.5 text-muted">{u.business_type || "—"}</td>
                    <td className="px-4 py-2.5">{u.member_count}</td>
                    <td className="px-4 py-2.5">{isPro(u) ? <span className="font-semibold text-paid">Pro{u.plan_expires_at ? ` · to ${d(u.plan_expires_at)}` : ""}</span> : <span className="text-muted">Free</span>}</td>
                    <td className="px-4 py-2.5 text-muted">{d(u.created_at)}</td>
                    <td className="px-4 py-2.5 text-right">
                      {isPro(u)
                        ? <button className="font-semibold text-due hover:underline" onClick={() => confirm(`Move ${u.email} to Free?`) && onSetPlan(u.id, "free", 0)}>Set free</button>
                        : <button className="font-semibold text-ink hover:underline" onClick={() => { const days = Number(prompt("Grant Pro for how many days?", "30")); if (days > 0) onSetPlan(u.id, "pro", days); }}>Grant Pro</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="mt-3 space-y-3">
          {data.tickets.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-muted ring-1 ring-line">No support messages yet.</p>}
          {data.tickets.map((t) => (
            <article key={t.id} className={`rounded-2xl bg-white p-4 ring-1 ring-line ${t.status === "closed" ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{t.name} <span className="font-normal text-muted">· {t.email} · {t.topic} · {d(t.created_at)}</span></p>
                {t.status === "open" ? <div className="flex gap-3 text-sm font-semibold">
                  <a className="text-ink hover:underline" href={`mailto:${t.email}?subject=${encodeURIComponent("Re: your Mahina message")}`}>Reply by email</a>
                  <button className="text-muted hover:text-text" onClick={() => onCloseTicket(t.id)}>Mark closed</button>
                </div> : <span className="text-sm text-muted">Closed</span>}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-[0.95rem]">{t.message}</p>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
