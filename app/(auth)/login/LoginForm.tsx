"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Alert, Button, Field } from "@/components/ui";
import { safeNext } from "@/lib/safe-next";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [mode, setMode] = useState<"password" | "link">("password");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(
    params.get("error") ? { kind: "error", text: "That sign-in link has expired or was already used. Request a new one." } : null
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email")).trim();
    const sb = supabaseBrowser();
    if (mode === "password") {
      const { error } = await sb.auth.signInWithPassword({ email, password: String(fd.get("password")) });
      if (error) {
        setMsg({ kind: "error", text: error.message.includes("confirm") ? "Confirm your email first. We sent you a link when you signed up." : "Email or password is incorrect." });
        setBusy(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } else {
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false, emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      setBusy(false);
      setMsg(error ? { kind: "error", text: "We couldn't send a link to that email. Check it or sign up first." } : { kind: "ok", text: `Check ${email} for a sign-in link.` });
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted">Log in to your fee register.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Email" name="email" type="email" required autoComplete="email" maxLength={120} />
        {mode === "password" && (
          <div>
            <Field label="Password" name="password" type="password" required autoComplete="current-password" minLength={8} />
            <Link href="/reset-password" className="mt-2 inline-block text-sm text-ink hover:underline">Forgot password?</Link>
          </div>
        )}
        {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
        <Button type="submit" disabled={busy} className="w-full py-3">
          {busy ? "Please wait…" : mode === "password" ? "Log in" : "Email me a sign-in link"}
        </Button>
      </form>
      <button type="button" onClick={() => { setMode(mode === "password" ? "link" : "password"); setMsg(null); }} className="mt-4 w-full text-center text-sm font-medium text-ink hover:underline">
        {mode === "password" ? "Log in with an email link instead" : "Log in with a password instead"}
      </button>
      <p className="mt-8 text-center text-sm text-muted">New to Mahina? <Link href="/signup" className="font-semibold text-ink hover:underline">Create a free account</Link></p>
    </div>
  );
}
