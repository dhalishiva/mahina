"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AdminView, type AdminData } from "@/components/app/AdminView";

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function load(q = search) {
    const sb = supabaseBrowser();
    const [stats, users, tickets] = await Promise.all([
      sb.rpc("admin_stats"),
      sb.rpc("admin_users", { p_search: q, p_limit: 200 }),
      sb.from("support_messages").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    if (stats.error || users.error || tickets.error) { setError("Couldn't load admin data."); return; }
    setData({ stats: stats.data, users: users.data, tickets: tickets.data });
  }
  useEffect(() => { load(""); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AdminView
      data={data}
      error={error}
      search={search}
      onSearch={(q) => { setSearch(q); load(q); }}
      onSetPlan={async (id, plan, days) => { const { error } = await supabaseBrowser().rpc("admin_set_plan", { p_user: id, p_plan: plan, p_days: days }); if (error) setError(error.message); await load(); }}
      onCloseTicket={async (id) => { await supabaseBrowser().from("support_messages").update({ status: "closed" }).eq("id", id); await load(); }}
    />
  );
}
