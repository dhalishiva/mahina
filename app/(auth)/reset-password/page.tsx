"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Alert, Button, Field } from "@/components/ui";

export default function ResetPassword() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => setHasSession(!!data.user));
  }, []);

  async function requestLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    await supabaseBrowser().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/reset-password` });
    setBusy(false);
    setMsg({ kind: "ok", text: `If an account exists for ${email}, a reset link is on its way.` });
  }

  async function setPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pw = String(new FormData(e.currentTarget).get("password"));
    if (pw.length < 8) { setMsg({ kind: "error", text: "Use at least 8 characters." }); return; }
    setBusy(true);
    const { error } = await supabaseBrowser().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) setMsg({ kind: "error", text: error.message });
    else { router.replace("/app"); router.refresh(); }
  }

  return (
    <div>
      <title>Reset password | Mahina</title>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{hasSession ? "Set a new password" : "Reset your password"}</h1>
      {hasSession ? (
        <form onSubmit={setPassword} className="mt-8 space-y-4">
          <Field label="New password" name="password" type="password" required minLength={8} autoComplete="new-password" />
          {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
          <Button disabled={busy} className="w-full py-3">Save password</Button>
        </form>
      ) : (
        <form onSubmit={requestLink} className="mt-8 space-y-4">
          <Field label="Email" name="email" type="email" required autoComplete="email" />
          {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
          <Button disabled={busy} className="w-full py-3">Email me a reset link</Button>
        </form>
      )}
      <p className="mt-8 text-center text-sm"><Link href="/login" className="font-semibold text-ink hover:underline">Back to log in</Link></p>
    </div>
  );
}
