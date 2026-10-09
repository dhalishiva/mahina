"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Alert, Button, Field } from "@/components/ui";
import { safeNext } from "@/lib/safe-next";
import { OtpField, authErrorText, useCooldown } from "@/components/OtpField";
import { useTurnstile } from "@/components/Turnstile";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [mode, setMode] = useState<"password" | "code">("password");
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const cooldown = useCooldown();
  const sb = supabaseBrowser();
  const captcha = useTurnstile("login");

  function done() { router.replace(next); router.refresh(); }

  async function sendCode(em: string) {
    const { error } = await sb.auth.signInWithOtp({ email: em, options: { shouldCreateUser: false, ...captcha.opts } });
    captcha.reset();
    if (error) {
      setMsg({ kind: "error", text: error.message.toLowerCase().includes("signups not allowed") || error.message.toLowerCase().includes("not found") ? "No account uses that email. Sign up first." : authErrorText(error.message) });
      return false;
    }
    cooldown.start();
    return true;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    if (mode === "password") {
      const em = String(fd.get("email")).trim().toLowerCase();
      const { error } = await sb.auth.signInWithPassword({ email: em, password: String(fd.get("password")), options: captcha.opts });
      setBusy(false);
      captcha.reset();
      if (!error) return done();
      if (error.message.toLowerCase().includes("confirm")) {
        // Account exists but email isn't verified yet. Logging in with a code also confirms the email.
        setMsg({ kind: "error", text: "Your email isn't confirmed yet. Use “Log in with a code” below; it confirms your email too." });
      } else setMsg({ kind: "error", text: error.message.toLowerCase().includes("rate") ? authErrorText(error.message) : "Email or password is incorrect." });
      return;
    }
    if (!codeSent) {
      const em = String(fd.get("email")).trim().toLowerCase();
      const ok = await sendCode(em);
      setBusy(false);
      if (ok) { setEmail(em); setCodeSent(true); }
      return;
    }
    if (code.length < 6) { setBusy(false); setMsg({ kind: "error", text: "Enter the code from your email." }); return; }
    const { error } = await sb.auth.verifyOtp({ email, token: code, type: "email" });
    setBusy(false);
    if (error) setMsg({ kind: "error", text: authErrorText(error.message) }); else done();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{codeSent ? "Check your email" : "Welcome back"}</h1>
      <p className="mt-2 text-muted">{codeSent ? <>We sent a code to <b className="text-text">{email}</b>.</> : "Log in to your fee register."}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {!codeSent && <Field label="Email" name="email" type="email" required autoComplete="email" maxLength={120} defaultValue={email} />}
        {mode === "password" && (
          <div>
            <Field label="Password" name="password" type="password" required autoComplete="current-password" minLength={8} />
            <Link href="/reset-password" className="mt-2 inline-block text-sm text-ink hover:underline">Forgot password?</Link>
          </div>
        )}
        {mode === "code" && codeSent && <OtpField value={code} onChange={setCode} />}
        {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
        <captcha.Widget />
        <Button type="submit" disabled={busy || (!captcha.ready && !(mode === "code" && codeSent))} className="w-full py-3">
          {busy ? "Please wait…" : mode === "code" && codeSent ? "Log in" : !captcha.ready ? "Checking you're not a bot…" : mode === "password" ? "Log in" : "Email me a code"}
        </Button>
      </form>
      {mode === "code" && codeSent && (
        <div className="mt-4 flex justify-between text-sm">
          <button className="font-semibold text-ink disabled:text-muted" disabled={cooldown.left > 0 || !captcha.ready} onClick={async () => { setMsg(null); await sendCode(email); }}>
            {cooldown.left > 0 ? `Send a new code in ${cooldown.left}s` : "Send a new code"}
          </button>
          <button className="font-semibold text-muted hover:text-text" onClick={() => { setCodeSent(false); setCode(""); setMsg(null); }}>Change email</button>
        </div>
      )}
      <button type="button" onClick={() => { setMode(mode === "password" ? "code" : "password"); setCodeSent(false); setCode(""); setMsg(null); }} className="mt-4 w-full text-center text-sm font-medium text-ink hover:underline">
        {mode === "password" ? "Log in with a code instead" : "Log in with a password instead"}
      </button>
      <p className="mt-8 text-center text-sm text-muted">New to Mahina? <Link href="/signup" className="font-semibold text-ink hover:underline">Create a free account</Link></p>
    </div>
  );
}
