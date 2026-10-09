import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export type PayData = {
  member_first_name: string;
  business_name: string;
  upi_id: string | null;
  upi_name: string | null;
  monthly_fee: number;
  amount_due: number;
  due_day: number;
};

export function upiUri(d: PayData, amount: number) {
  const params = new URLSearchParams({ pa: d.upi_id || "", pn: d.upi_name || d.business_name, cu: "INR", tn: `Fees ${d.member_first_name}`.slice(0, 40) });
  if (amount > 0) params.set("am", amount.toFixed(2));
  return `upi://pay?${params.toString().replace(/\+/g, "%20")}`;
}

const inr = (n: number) => "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/** Public payment page a member opens from a WhatsApp reminder. Shows nothing beyond what's needed to pay. */
export function PayPageView({ d, qrSvg }: { d: PayData; qrSvg: string | null }) {
  const amount = d.amount_due > 0 ? d.amount_due : d.monthly_fee;
  const uri = upiUri(d, amount);
  return (
    <div className="min-h-dvh bg-surface px-4 py-6">
      <main className="mx-auto max-w-sm">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-line">
          <div className="bg-ink px-6 pb-6 pt-5 text-white">
            <p className="text-sm text-white/75">Fee payment for</p>
            <h1 className="font-display text-2xl font-extrabold leading-tight">{d.business_name}</h1>
          </div>
          <div className="px-6 py-5">
            <p className="text-muted">{d.amount_due > 0 ? `Amount due for ${d.member_first_name}` : `Monthly fee for ${d.member_first_name}`}</p>
            <p className="font-display text-5xl font-extrabold tracking-tight">{inr(amount)}</p>
            {d.amount_due <= 0 && <p className="mt-1 text-sm font-semibold text-paid">Nothing pending right now. Thank you!</p>}

            {d.upi_id ? (
              <>
                <a href={uri} className="mt-6 flex w-full items-center justify-center rounded-2xl bg-ink px-4 py-4 text-lg font-bold text-white">
                  Pay {inr(amount)} with UPI app
                </a>
                <p className="mt-2 text-center text-xs text-muted">Opens GPay, PhonePe, Paytm, BHIM or your bank app</p>
                {qrSvg && (
                  <div className="mt-6 rounded-2xl border border-line p-4 text-center">
                    <p className="text-sm font-semibold">Or scan from another phone</p>
                    <div className="mx-auto mt-3 w-48" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                  </div>
                )}
                <dl className="mt-5 space-y-1 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-muted">UPI ID</dt><dd className="select-all font-semibold">{d.upi_id}</dd></div>
                  {d.upi_name && <div className="flex justify-between gap-3"><dt className="text-muted">Name</dt><dd className="font-semibold">{d.upi_name}</dd></div>}
                </dl>
                <p className="mt-5 rounded-xl bg-ink-soft p-3 text-sm text-ink">After paying, reply on WhatsApp with a screenshot so it can be marked as paid.</p>
              </>
            ) : (
              <p className="mt-6 rounded-xl bg-due-soft p-3 text-sm text-due">{d.business_name} hasn&apos;t added a UPI ID yet. Please pay them directly.</p>
            )}
          </div>
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
          <LogoMark size={16} /> Fee reminders by <Link href="/" className="font-semibold text-ink">Mahina</Link>. Payments go directly to {d.business_name}.
        </p>
      </main>
    </div>
  );
}
