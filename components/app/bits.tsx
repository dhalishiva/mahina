"use client";
import { useEffect, useRef } from "react";

export function StatusPill({ status, amount }: { status: "paid" | "partial" | "due" | "upcoming"; amount?: string }) {
  const map = {
    paid: "bg-paid-soft text-paid",
    partial: "bg-due-soft text-due",
    due: "bg-due-soft text-due",
    upcoming: "bg-surface text-muted ring-1 ring-line",
  } as const;
  const label = { paid: "Paid", partial: "Part paid", due: "Due", upcoming: "Upcoming" }[status];
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${map[status]}`}>{label}{amount ? ` · ${amount}` : ""}</span>;
}

export function Initials({ name, tone = "ink" }: { name: string; tone?: "ink" | "due" | "paid" }) {
  const t = name.trim().split(/\s+/).slice(0, 2).map((x) => x[0]?.toUpperCase()).join("");
  const c = { ink: "bg-ink-soft text-ink", due: "bg-due-soft text-due", paid: "bg-paid-soft text-paid" }[tone];
  return <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${c}`}>{t}</span>;
}

/** Bottom sheet on phones, centred dialog on larger screens, using the native <dialog> element. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label={title}
      className="m-0 mt-auto w-full max-w-none rounded-t-3xl bg-white p-0 text-text backdrop:bg-[#0d1240]/45 sm:m-auto sm:max-w-lg sm:rounded-3xl"
    >
      <div className="max-h-[88dvh] overflow-y-auto p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-surface" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "paid" | "due" }) {
  const c = tone === "paid" ? "text-paid" : tone === "due" ? "text-due" : "text-text";
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-line sm:p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl ${c}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
