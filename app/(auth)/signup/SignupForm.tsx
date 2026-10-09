"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Alert, Button, Field } from "@/components/ui";

export function SignupForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email")).trim();
    const password = String(fd.get("password"));
    if (password.length < 8) { setError("Use at least 8 characters for your password."); setBusy(false); return; }
    const { data, error } = await supabaseBrowser().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: String(fd.get("name")).trim().slice(0, 80) },
        emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent("/app/settings?welcome=1")}`,
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message.toLowerCase().includes("registered") ? "An account with this email already exists. Log in instead." : error.message);
      return;
    }
    if (data.session) {
      router.replace("/app/settings?welcome=1");
      router.refresh();
    } else {
      setSentTo(email);
    }
  }

  if (sentTo) {
    return (
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Check your email</h1>
        <p className="mt-3 text-muted">We sent a confirmation link to <b className="text-text">{sentTo}</b>. Open it on this device to finish creating your account.</p>
        <p className="mt-6 text-sm text-muted">Didn&apos;t get it? Check spam, or <button className="font-semibold text-ink hover:underline" onClick={() => setSentTo("")}>try again</button>.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Start your free register</h1>
      <p className="mt-2 text-muted">Free for up to 15 members. No card needed.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Your name" name="name" required autoComplete="name" maxLength={80} />
        <Field label="Email" name="email" type="email" required autoComplete="email" maxLength={120} />
        <Field label="Password" name="password" type="password" required autoComplete="new-password" minLength={8} hint="At least 8 characters" />
        {error && <Alert>{error}</Alert>}
        <Button type="submit" disabled={busy} className="w-full py-3">{busy ? "Creating account…" : "Create free account"}</Button>
        <p className="text-xs text-muted">By creating an account you agree to the <Link className="underline" href="/terms">terms</Link> and <Link className="underline" href="/privacy">privacy policy</Link>.</p>
      </form>
      <p className="mt-8 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold text-ink hover:underline">Log in</Link></p>
    </div>
  );
}
