import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";

function safeTarget(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/app";
  if (!/^\/(app|admin|reset-password)(\/|$|\?)/.test(next)) return "/app";
  return next;
}

/** Handles email confirmation, magic links and password-reset links (PKCE code or token hash). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = safeTarget(url.searchParams.get("next"));
  const supabase = await supabaseServer();

  let ok = false;
  if (code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type) ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;

  return NextResponse.redirect(new URL(ok ? next : "/login?error=link", url.origin));
}
