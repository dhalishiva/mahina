import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAnon } from "@/lib/supabase/server";
import { LogoMark } from "@/components/Logo";
import { PrintButton } from "./PrintButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payment receipt", robots: { index: false, follow: false }, referrer: "no-referrer" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type R = { receipt_no: number; amount: number; period: string; paid_on: string; method: string; member_name: string; business_name: string | null; business_phone: string | null };

export default async function Receipt({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!UUID.test(token)) notFound();
  const { data } = await supabaseAnon().rpc("get_receipt", { p_token: token });
  if (!data) notFound();
  const r = data as R;
  const [y, m] = r.period.split("-").map(Number);
  const month = new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
  const paid = new Date(r.paid_on + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const method = { upi: "UPI", cash: "Cash", bank: "Bank transfer", other: "Other" }[r.method] || r.method;

  return (
    <div className="min-h-dvh bg-surface px-4 py-8 print:bg-white">
      <main className="register mx-auto max-w-md rounded-3xl bg-white pb-8 pl-[64px] pr-6 pt-6 shadow-sm ring-1 ring-line print:shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-hand text-lg text-muted">Receipt #{r.receipt_no}</p>
            <h1 className="font-display text-2xl font-extrabold leading-tight">{r.business_name || "Payment receipt"}</h1>
            {r.business_phone && <p className="text-sm text-muted">{r.business_phone}</p>}
          </div>
          <span className="mt-2 -rotate-12 rounded-md border-[3px] border-paid px-2.5 py-1 font-display text-lg font-extrabold text-paid">PAID</span>
        </div>
        <dl className="mt-8 space-y-0 text-[1.02rem]">
          {[["Received from", r.member_name], ["For", month], ["Amount", "₹" + Number(r.amount).toLocaleString("en-IN")], ["Paid on", paid], ["Mode", method]].map(([k, v]) => (
            <div key={k} className="flex h-11 items-center justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
          ))}
        </dl>
        <PrintButton />
      </main>
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted print:hidden"><LogoMark size={16} /> Receipt issued with <Link href="/" className="font-semibold text-ink">Mahina</Link></p>
    </div>
  );
}
