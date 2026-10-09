import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { supabaseAnon } from "@/lib/supabase/server";
import { PayPageView, upiUri, type PayData } from "@/components/PayPageView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pay fees", robots: { index: false, follow: false }, referrer: "no-referrer" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CODE = /^[A-Za-z0-9]{6,12}$/;

export default async function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  // Short codes (current links) and UUID tokens (links sent before short codes existed) both work.
  const { data } = UUID.test(token)
    ? await supabaseAnon().rpc("get_pay_page", { p_token: token })
    : CODE.test(token)
      ? await supabaseAnon().rpc("get_pay_page_by_code", { p_code: token })
      : { data: null };
  if (!data) notFound();
  const d = data as PayData;
  const amount = Number(d.amount_due) > 0 ? Number(d.amount_due) : Number(d.monthly_fee);
  const qrSvg = d.upi_id ? await QRCode.toString(upiUri(d, amount), { type: "svg", margin: 1, color: { dark: "#161a2c", light: "#ffffff" } }) : null;
  return <PayPageView d={{ ...d, amount_due: Number(d.amount_due), monthly_fee: Number(d.monthly_fee) }} qrSvg={qrSvg} />;
}
