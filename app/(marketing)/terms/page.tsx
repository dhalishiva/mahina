import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/marketing/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms and conditions", description: "The terms for using Mahina by SlotRecover.", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <LegalPage title="Terms and conditions" updated="9 October 2026">
      <p>These terms are an agreement between you and {SITE.legalEntity} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), which operates Mahina by SlotRecover (the &ldquo;Service&rdquo;). By creating an account or using the Service you agree to them.</p>

      <h2>1. The Service</h2>
      <p>Mahina is a record-keeping and messaging tool that helps you track monthly payments owed to you, prepare reminder messages, share UPI payment links and issue receipts. Mahina is not a bank, payment aggregator, payment gateway or collection agency. We never receive, hold or transfer money paid to you by your members.</p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must be at least 18 and able to enter a binding contract.</li>
        <li>Keep your login details safe. You are responsible for activity on your account.</li>
        <li>Give accurate information, especially your UPI ID. Payments sent to an incorrect UPI ID you entered are not our responsibility.</li>
      </ul>

      <h2>3. Your responsibilities towards members</h2>
      <ul>
        <li>Add only people who genuinely owe you payments under an arrangement with you, and only the details needed to track those payments.</li>
        <li>Inform your members that you use Mahina, and obtain any consent required by law, including parental consent for children&apos;s data.</li>
        <li>Send reminders responsibly. Do not use Mahina to harass, threaten, shame or spam anyone, or to send messages to people who have asked you to stop.</li>
        <li>Comply with WhatsApp&apos;s terms of service when sending messages from your account.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You must not use the Service for anything unlawful, to collect payments for illegal goods or services, to impersonate anyone, to attempt to access other accounts or our systems without permission, to probe or overload the Service, or to resell it without our written agreement.</p>

      <h2>5. Plans and payment</h2>
      <ul>
        <li>The Free plan is available at no cost for up to 2 members. We may change free plan limits with 30 days&apos; notice.</li>
        <li>Pro monthly costs ₹149 and renews automatically every month through a UPI autopay mandate or card until you turn it off. You can turn it off at any time from the Plan page; Pro then stays active until the end of the paid month.</li>
        <li>Pro yearly costs ₹1,490, is paid once and does not renew automatically.</li>
        <li>Payments for Pro are processed by Razorpay. Prices are in Indian rupees.</li>
        <li>Refunds are governed by our <Link href="/refund-policy">cancellation and refund policy</Link>.</li>
      </ul>

      <h2>6. Your data</h2>
      <p>You own the data you put into Mahina. You give us permission to store and process it only to provide the Service, as described in our <Link href="/privacy">privacy policy</Link>. You can export or delete your data at any time.</p>

      <h2>7. Availability</h2>
      <p>We work to keep Mahina available and your data safe, but we provide the Service &ldquo;as is&rdquo; without guarantees of uninterrupted availability. Keep your own records of important payments.</p>

      <h2>8. Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for indirect or consequential losses, lost profits, unpaid fees owed to you by your members, or disputes between you and your members. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim.</p>

      <h2>9. Suspension and termination</h2>
      <p>You can stop using Mahina and delete your account at any time. We may suspend or close accounts that break these terms, after notice where reasonable.</p>

      <h2>10. Changes</h2>
      <p>We may update these terms. We will notify you of material changes at least 15 days before they take effect. Continuing to use the Service after that means you accept the updated terms.</p>

      <h2>11. Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in Gautam Buddh Nagar (Noida), Uttar Pradesh have exclusive jurisdiction.</p>

      <h2>12. Contact</h2>
      <p>{SITE.legalEntity}, {SITE.city}. Email: {SITE.email}. Or use our <Link href="/contact">contact form</Link>.</p>
    </LegalPage>
  );
}
