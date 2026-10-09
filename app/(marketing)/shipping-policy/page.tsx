import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Delivery policy", description: "How Mahina Pro is delivered after purchase.", alternates: { canonical: "/shipping-policy" } };

export default function Shipping() {
  return (
    <LegalPage title="Delivery policy" updated="9 October 2026">
      <p>Mahina is an online software service. Nothing is shipped physically.</p>
      <h2>Delivery of Pro</h2>
      <p>Pro is activated on your account immediately after Razorpay confirms your payment, usually within a few seconds. You will see the Pro badge and your plan end date on the Billing page in the app.</p>
      <h2>If activation is delayed</h2>
      <p>If Pro is not active within 30 minutes of a successful payment, contact us at {SITE.email} with your payment ID. We will activate it or refund the payment in full within 2 working days.</p>
      <h2>Service area</h2>
      <p>Mahina is available online throughout India.</p>
    </LegalPage>
  );
}
