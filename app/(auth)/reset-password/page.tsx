"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Alert, Button, Field } from "@/components/ui";
import { OtpField, authErrorText, useCooldown } from "@/components/OtpField";
import { useTurnstile } from "@/components/Turnstile";

export default function ResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const cooldown = useCooldown();
  const sb = supabaseBrowser();
  const captcha = useTurnstile("reset");

  async function send(em: string) {
    const { error } = await sb.auth.resetPasswordForEmail(em, captcha.opts);
    captcha.reset();
    // Same message whether or not the account exists, so emails can't be probed.
    if (error && /rate|security purposes|too many/i.test(error.message)) { setMsg({ kind: "error", text: authErrorText(error.message) }); return false; }
    cooldown.start();
    return true;
  }

  async function requestCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const em = String(new FormData(e.currentTarget).get("email")).trim().toLowerCase();
    const ok = await send(em);
    setBusy(false);
    if (ok) { setEmail(em); setStep("code"); }
  }

  async function reset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pw = String(new FormData(e.currentTarget).get("password"));
    if (code.length < 6) { setMsg({ kind: "error", text: "Enter the code from your email." }); return; }
    if (pw.length < 8) { setMsg({ kind: "error", text: "Use at least 8 characters for your new password." }); return; }
    setBusy(true);
    setMsg(null);
    const v = await sb.auth.verifyOtp({ email, token: code, type: "recovery" });
    if (v.error) { setBusy(false); setMsg({ kind: "error", text: authErrorText(v.error.message) }); return; }
    const u = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (u.error) { setMsg({ kind: "error", text: u.error.message.includes("different") ? "Choose a password you haven't used before." : u.error.message }); return; }
    router.replace("/app");
    router.refresh();
  }

  return (
    <div>
      <title>Reset password | Mahina</title>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Reset your password</h1>
      {step === "email" ? (
        <>
          <p className="mt-2 text-muted">We&apos;ll email you a code to set a new password.</p>
          <form onSubmit={requestCode} className="mt-8 space-y-4">
            <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={email} />
            {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
            <Button disabled={busy || !captcha.ready} className="w-full py-3">{busy ? "Sending…" : !captcha.ready ? "Checking you're not a bot…" : "Email me a code"}</Button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-2 text-muted">If an account exists for <b className="text-text">{email}</b>, we&apos;ve sent it a code.</p>
          <form onSubmit={reset} className="mt-8 space-y-4">
            <OtpField value={code} onChange={setCode} />
            <Field label="New password" name="password" type="password" required minLength={8} autoComplete="new-password" hint="At least 8 characters" />
            {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
            <Button disabled={busy} className="w-full py-3">{busy ? "Saving…" : "Set new password"}</Button>
          </form>
          <div className="mt-4 flex justify-between text-sm">
            <button className="font-semibold text-ink disabled:text-muted" disabled={cooldown.left > 0 || !captcha.ready} onClick={async () => { setMsg(null); await send(email); }}>
              {cooldown.left > 0 ? `Send a new code in ${cooldown.left}s` : "Send a new code"}
            </button>
            <button className="font-semibold text-muted hover:text-text" onClick={() => { setStep("email"); setCode(""); setMsg(null); }}>Change email</button>
          </div>
        </>
      )}
      <captcha.Widget />
      <p className="mt-8 text-center text-sm"><Link href="/login" className="font-semibold text-ink hover:underline">Back to log in</Link></p>
    </div>
  );
}
