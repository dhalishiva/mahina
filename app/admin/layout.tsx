import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/app/AppShell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?next=/admin");
  const { data: p } = await supabase.from("profiles").select("is_admin").eq("id", data.user.id).single();
  if (!p?.is_admin) notFound();
  return (
    <StoreProvider>
      <AppShell>{children}</AppShell>
    </StoreProvider>
  );
}
