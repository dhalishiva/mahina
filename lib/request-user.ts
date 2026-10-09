import "server-only";
import { supabaseAnon, supabaseServer } from "@/lib/supabase/server";

/** Signed-in user from the web session cookie, or from an `Authorization: Bearer <access_token>` header (Android app). */
export async function requestUser(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    const { data } = await supabaseAnon().auth.getUser(auth.slice(7).trim());
    return data.user ?? null;
  }
  const { data } = await (await supabaseServer()).auth.getUser();
  return data.user ?? null;
}
