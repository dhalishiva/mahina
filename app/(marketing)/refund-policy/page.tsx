import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/marketing/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Cancellation and refund policy", description: "How cancellations and refunds work for Mahina Pro.", alternates: { canonical: "/refund-policy" } };

export default function Refund() {
  return (
    <LegalPage title="Cancellation and refund policy" updated="9 October 2026">
      <p>This policy applies to purchases of Mahina Pro from {SITE.legalEntity}.</p>

      <h2>How Pro is billed</h2>
      <ul>
        <li><b>Monthly (autopay):</b> ₹149 is charged automatically every month through a UPI autopay mandate or a saved card, until you turn autopay off. Your bank or UPI app may send a pre-debit notification before each charge.</li>
        <li><b>Yearly (one-time):</b> ₹1,490 is paid once for 12 months. It does not renew automatically.</li>
      </ul>

      <h2>Cancelling autopay</h2>
      <p>You can turn autopay off at any time from <b>Plan</b> in the app, with one tap. No further charges are made after that. Pro stays active until the end of the month you have already paid for, then your account returns to the Free plan. Your members and payment history are kept.</p>
      <p>You can also cancel the mandate from your UPI app or bank. If you have trouble cancelling, write to us and we will cancel it for you within 1 working day.</p>

      <h2>7-day money-back guarantee</h2>
      <p>If you are not satisfied, you can ask for a full refund of your <b>first</b> Pro purchase within 7 days of the payment date. No questions asked.</p>

      <h2>Other refunds</h2>
      <ul>
        <li><b>Yearly plan:</b> after the first 7 days, you can request a pro-rated refund for complete unused months, if requested within 60 days of payment.</li>
        <li><b>Monthly autopay:</b> after the first 7 days, monthly charges are not refundable, but you can turn autopay off at any time to stop the next one. If you were charged after turning autopay off, we refund that charge in full.</li>
        <li><b>Duplicate or failed payments:</b> if you were charged twice, or charged without Pro being activated, we will refund the extra amount in full.</li>
      </ul>

      <h2>How to request a refund</h2>
      <p>Use the <Link href="/contact">contact form</Link> and choose &ldquo;Refund request&rdquo;, or email {SITE.email} from the email address on your account, with your payment ID or date. We confirm eligible refunds within 2 working days.</p>

      <h2>Refund timelines</h2>
      <p>Approved refunds are issued through Razorpay to the original payment method. They usually reach you within 5 to 7 working days, depending on your bank. If you upgraded with a refund pending, Pro ends when the refund is issued.</p>

      <h2>Payments to you from your members</h2>
      <p>Mahina does not process payments between you and your members. Those payments go directly through UPI between your accounts, so refunds of fees you collected are between you and your member.</p>
    </LegalPage>
  );
}
