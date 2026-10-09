"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { computeStatus, type Member, type MemberStatus, type Payment } from "@/lib/dues";
import type { Lang } from "@/lib/reminders";
import { SITE } from "@/lib/site";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  business_type: string | null;
  phone: string | null;
  upi_id: string | null;
  upi_name: string | null;
  reminder_lang: Lang;
  plan: "free" | "pro";
  plan_expires_at: string | null;
  subscription_id: string | null;
  subscription_status: string | null;
  is_admin: boolean;
  created_at: string;
};

export type NewMember = Pick<Member, "name" | "phone" | "monthly_fee" | "due_day" | "batch" | "start_month"> & { notes?: string | null };
export type NewPayment = Pick<Payment, "member_id" | "period" | "amount" | "method" | "paid_on"> & { note?: string | null };

type Store = {
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  members: Member[];
  payments: Payment[];
  statuses: MemberStatus[];
  isPro: boolean;
  origin: string;
  reload: () => Promise<void>;
  addMembers: (rows: NewMember[]) => Promise<string | null>;
  updateMember: (id: string, patch: Partial<NewMember & { active: boolean }>) => Promise<string | null>;
  deleteMember: (id: string) => Promise<string | null>;
  recordPayment: (p: NewPayment) => Promise<{ error: string | null; payment?: Payment }>;
  deletePayment: (id: string) => Promise<string | null>;
  saveProfile: (patch: Partial<Pick<Profile, "full_name" | "business_name" | "business_type" | "phone" | "upi_id" | "upi_name" | "reminder_lang">>) => Promise<string | null>;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
};

export const planActive = (p: Profile | null) =>
  !!p && p.plan === "pro" && (!p.plan_expires_at || new Date(p.plan_expires_at) > new Date());

function friendly(msg: string) {
  if (msg.includes("FREE_LIMIT")) return "The free plan allows up to 2 members. Upgrade to Pro to add more.";
  if (msg.includes("upi_id")) return "That UPI ID doesn't look right. It should look like name@bank.";
  if (msg.includes("phone")) return "Enter a valid phone number (10 digits).";
  if (msg.includes("violates check")) return "Some details are invalid. Check the fields and try again.";
  return msg;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const sb = supabaseBrowser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [origin, setOrigin] = useState("");

  const reload = useCallback(async () => {
    const { data: u } = await sb.auth.getUser();
    if (!u.user) { location.href = "/login"; return; }
    const [p, m, py] = await Promise.all([
      sb.from("profiles").select("*").eq("id", u.user.id).single(),
      sb.from("members").select("*").order("name"),
      sb.from("payments").select("*").order("paid_on", { ascending: false }).limit(5000),
    ]);
    if (p.error || m.error || py.error) setError("Couldn't load your register. Check your connection and refresh.");
    else setError(null);
    setProfile(p.data as Profile);
    setMembers((m.data || []) as Member[]);
    setPayments(((py.data || []) as Payment[]).map((x) => ({ ...x, amount: Number(x.amount) })));
    setLoading(false);
  }, [sb]);

  useEffect(() => { setOrigin(location.origin); reload(); }, [reload]);

  const value = useMemo<Store>(() => {
    const statuses = members.map((m) => computeStatus({ ...m, monthly_fee: Number(m.monthly_fee) }, payments));
    return {
      loading, error, profile, members, payments, statuses, isPro: planActive(profile), origin, reload,
      addMembers: async (rows) => {
        const { error } = await sb.from("members").insert(rows);
        if (error) return friendly(error.message);
        await reload(); return null;
      },
      updateMember: async (id, patch) => {
        const { error } = await sb.from("members").update(patch).eq("id", id);
        if (error) return friendly(error.message);
        await reload(); return null;
      },
      deleteMember: async (id) => {
        const { error } = await sb.from("members").delete().eq("id", id);
        if (error) return friendly(error.message);
        await reload(); return null;
      },
      recordPayment: async (p) => {
        const { data, error } = await sb.from("payments").insert(p).select("*").single();
        if (error) return { error: friendly(error.message) };
        await reload(); return { error: null, payment: data as Payment };
      },
      deletePayment: async (id) => {
        const { error } = await sb.from("payments").delete().eq("id", id);
        if (error) return friendly(error.message);
        await reload(); return null;
      },
      saveProfile: async (patch) => {
        if (!profile) return "Not signed in";
        const { error } = await sb.from("profiles").update(patch).eq("id", profile.id);
        if (error) return friendly(error.message);
        await reload(); return null;
      },
    };
  }, [loading, error, profile, members, payments, origin, reload, sb]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Read-only store with sample data, used to render marketing screenshots. */
export function FixtureProvider({ profile, members, payments, children }: { profile: Profile; members: Member[]; payments: Payment[]; children: React.ReactNode }) {
  const value = useMemo<Store>(() => ({
    loading: false, error: null, profile, members, payments,
    statuses: members.map((m) => computeStatus(m, payments)),
    isPro: planActive(profile), origin: SITE.url,
    reload: async () => {},
    addMembers: async () => null, updateMember: async () => null, deleteMember: async () => null,
    recordPayment: async () => ({ error: null }), deletePayment: async () => null, saveProfile: async () => null,
  }), [profile, members, payments]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
