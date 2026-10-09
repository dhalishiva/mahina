import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export const fieldCls =
  "mt-1 block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[0.98rem] text-text outline-none placeholder:text-muted/60 focus:border-ink focus:ring-2 focus:ring-ink/20 disabled:bg-surface";

export function Field({ label, hint, ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block text-sm font-medium text-text">
      {label}
      <input {...p} className={fieldCls} />
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Select({ label, children, ...p }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block text-sm font-medium text-text">
      {label}
      <select {...p} className={fieldCls}>{children}</select>
    </label>
  );
}

export function Button({ variant = "primary", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "danger" | "wa" }) {
  const v = {
    primary: "bg-ink text-white hover:bg-ink-dark",
    ghost: "text-ink hover:bg-ink-soft",
    outline: "border border-line bg-white text-text hover:border-ink hover:text-ink",
    danger: "bg-white text-due ring-1 ring-due/30 hover:bg-due-soft",
    wa: "bg-[#25D366] text-[#0b3d20] hover:brightness-95",
  }[variant];
  return <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${v} ${className}`} />;
}

export function Alert({ kind = "error", children }: { kind?: "error" | "ok" | "info"; children: React.ReactNode }) {
  const c = { error: "bg-due-soft text-due", ok: "bg-paid-soft text-paid", info: "bg-ink-soft text-ink" }[kind];
  return <p role={kind === "error" ? "alert" : "status"} className={`rounded-xl px-3.5 py-2.5 text-sm ${c}`}>{children}</p>;
}
