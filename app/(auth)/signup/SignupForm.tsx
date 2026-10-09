"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Alert, Button, Field } from "@/components/ui";
import { OtpField, authErrorText, useCooldown } from "@/components/OtpField";
import { useTurnstile } from "@/components/Turnstile";

export function SignupForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "code">("form");
  const [code, setCode] = useState("");
  const cooldown = useCooldown();
  const captcha = useTurnstile("signup");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const em = String(fd.get("email")).trim().toLowerCase();
    const password = String(fd.get("password"));
    if (password.length < 8) { setError("Use at least 8 characters for your password."); return; }
    setBusy(true);
    const { data, error } = await supabaseBrowser().auth.signUp({
      email: em,
      password,
      options: { data: { full_name: String(fd.get("name")).trim().slice(0, 80) }, ...captcha.opts },
    });
    setBusy(false);
    captcha.reset();
    if (error) { setError(authErrorText(error.message)); return; }
    if (data.session) { router.replace("/app/settings?welcome=1"); router.refresh(); return; }
    // Supabase returns a user with no identities when the email is already registered.
    if (data.user && data.user.identities?.length === 0) { setError("An account with this email already exists. Log in instead."); return; }
    setEmail(em);
    setStep("code");
    cooldown.start();
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) { setError("Enter the code from your email."); return; }
    setBusy(true);
    setError("");
    const { error } = await supabaseBrowser().auth.verifyOtp({ email, token: code, type: "signup" });
    setBusy(false);
    if (error) { setError(authErrorText(error.message)); return; }
    router.replace("/app/settings?welcome=1");
    router.refresh();
  }

  async function resend() {
    setError("");
    const { error } = await supabaseBrowser().auth.resend({ type: "signup", email, options: captcha.opts });
    captcha.reset();
    if (error) setError(authErrorText(error.message)); else cooldown.start();
  }

  if (step === "code") {
    return (
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Check your email</h1>
        <p className="mt-2 text-muted">We sent a code to <b className="text-text">{email}</b>. Enter it to finish creating your account.</p>
        <form onSubmit={verify} className="mt-8 space-y-4">
          <OtpField value={code} onChange={setCode} />
          {error && <Alert>{error}</Alert>}
          <Button disabled={busy} className="w-full py-3">{busy ? "Checking…" : "Verify and continue"}</Button>
        </form>
        <div className="mt-5 flex justify-between text-sm">
          <button className="font-semibold text-ink disabled:text-muted" disabled={cooldown.left > 0 || !captcha.ready} onClick={resend}>
            {cooldown.left > 0 ? `Send a new code in ${cooldown.left}s` : "Send a new code"}
          </button>
          <button className="font-semibold text-muted hover:text-text" onClick={() => { setStep("form"); setCode(""); setError(""); }}>Change email</button>
        </div>
        <captcha.Widget />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Start your free register</h1>
      <p className="mt-2 text-muted">Free for up to 15 members. No card needed.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Your name" name="name" required autoComplete="name" maxLength={80} />
        <Field label="Email" name="email" type="email" required autoComplete="email" maxLength={120} defaultValue={email} />
        <Field label="Password" name="password" type="password" required autoComplete="new-password" minLength={8} hint="At least 8 characters" />
        {error && <Alert>{error}</Alert>}
        <captcha.Widget />
        <Button type="submit" disabled={busy || !captcha.ready} className="w-full py-3">{busy ? "Creating account…" : !captcha.ready ? "Checking you're not a bot…" : "Create free account"}</Button>
        <p className="text-xs text-muted">By creating an account you agree to the <Link className="underline" href="/terms">terms</Link> and <Link className="underline" href="/privacy">privacy policy</Link>.</p>
      </form>
      <p className="mt-8 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold text-ink hover:underline">Log in</Link></p>
    </div>
  );
}
