"use client";
import { useEffect, useState } from "react";
import { fieldCls } from "@/components/ui";

/** 6–8 digit email code. Works with SMS/email autofill on Android and iOS. */
export function OtpField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm font-medium text-text">
      Code from your email
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6,8}"
        maxLength={8}
        required
        autoFocus
        aria-describedby="otp-hint"
        className={`${fieldCls} text-center font-display text-2xl font-bold tracking-[0.4em]`}
        placeholder="••••••"
      />
      <span id="otp-hint" className="mt-1 block text-xs font-normal text-muted">The code expires in 1 hour. Check spam if you don&apos;t see it.</span>
    </label>
  );
}

/** Supabase allows one email per address every 60 seconds; mirror that in the UI. */
export function useCooldown(seconds = 60) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return { left, start: () => setLeft(seconds) };
}

export function authErrorText(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("expired") || m.includes("invalid") || m.includes("token")) return "That code is wrong or has expired. Check it or send a new one.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("security purposes")) return "Too many attempts. Wait a minute and try again.";
  if (m.includes("registered")) return "An account with this email already exists. Log in instead.";
  return msg;
}
