import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/marketing/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy", description: "How Mahina collects, uses and protects your data and the data of your members.", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" updated="9 October 2026">
      <p>This policy explains how {SITE.legalEntity} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), which operates Mahina by SlotRecover (the &ldquo;Service&rdquo;), handles personal data. It is written to comply with India&apos;s Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 and its rules.</p>

      <h2>Who this policy covers</h2>
      <ul>
        <li><b>Account holders</b>: the tutors, businesses and individuals who sign up to use Mahina.</li>
        <li><b>Members</b>: the students, customers, tenants or other people whose details account holders add to Mahina to track monthly payments.</li>
      </ul>
      <p>For members&apos; data, the account holder decides what to record and why. We process that data on the account holder&apos;s behalf. Account holders are responsible for having a lawful reason to record their members&apos; details and for telling members that they use Mahina.</p>

      <h2>What we collect</h2>
      <h3>From account holders</h3>
      <ul>
        <li>Email address and password (passwords are stored only as a secure hash by our authentication provider).</li>
        <li>Profile details you choose to add: your name, business name, business type, phone number, UPI ID and the name on your UPI account.</li>
        <li>Billing records for Pro purchases: order and payment IDs, plan and amount. Card, UPI PIN and bank details are handled by Razorpay and never reach us.</li>
        <li>Support messages you send us.</li>
      </ul>
      <h3>About members, entered by account holders</h3>
      <ul>
        <li>Name, phone number, monthly fee, due date, batch or group, notes, and records of payments.</li>
      </ul>
      <h3>Automatically</h3>
      <ul>
        <li>Privacy-friendly, cookieless page-view and performance analytics (Vercel Web Analytics and Speed Insights), which do not identify you personally.</li>
        <li>Essential cookies that keep you signed in.</li>
        <li>Server logs (IP address, browser type, time of request) kept for security for a limited period.</li>
      </ul>

      <h2>How we use data</h2>
      <ul>
        <li>To provide the Service: showing dues, generating reminder messages, payment links and receipts.</li>
        <li>To process Pro purchases and keep billing records required by law.</li>
        <li>To respond to support requests and send essential account emails (for example, sign-in links and plan expiry notices).</li>
        <li>To keep the Service secure and prevent abuse.</li>
      </ul>
      <p>We do not sell personal data, show advertising, or use members&apos; data to contact members ourselves.</p>

      <h2>Payment links and receipts</h2>
      <p>Each member has a payment link containing a long random code. Anyone with the link can see only the member&apos;s first name, the business name, the amount due, and the account holder&apos;s UPI ID and UPI name. Receipt links show the member&apos;s name, amount, month, payment date and business name. Links do not show phone numbers, notes or other members&apos; data. Account holders can make a payment link stop working by marking the member inactive.</p>

      <h2>WhatsApp and UPI</h2>
      <p>Mahina does not send WhatsApp messages itself. When you tap Remind, your device opens WhatsApp with a pre-filled message that you send from your own account, subject to WhatsApp&apos;s terms. Payments made through the UPI link go directly from the member to the account holder through their UPI apps and banks. We do not receive, hold or see these payments.</p>

      <h2>Where data is stored and who processes it</h2>
      <ul>
        <li><b>Supabase</b> (database and authentication), hosted in Mumbai, India.</li>
        <li><b>Vercel</b> (website hosting, analytics and performance monitoring).</li>
        <li><b>Razorpay</b> (Pro plan payments).</li>
      </ul>
      <p>These providers process data only to provide their services to us and are bound by their own security and privacy commitments.</p>

      <h2>Security</h2>
      <p>Data is encrypted in transit (HTTPS) and at rest. Database access is restricted per account by row-level security, so one account holder can never read another&apos;s data. Administrative access is limited to the operators of the Service.</p>

      <h2>Retention</h2>
      <p>We keep account data for as long as your account is active. If you delete your account, we delete your profile, members and payment records within 30 days, except billing records we must keep for tax and accounting law (generally 8 years).</p>

      <h2>Your rights</h2>
      <p>You may access, correct, export or delete your data, withdraw consent, and nominate another person to exercise your rights. Most corrections can be made in Settings. For anything else, including account deletion, <Link href="/contact">contact us</Link>. Members who want their data corrected or removed should contact the account holder who added them, or write to us and we will pass the request on.</p>

      <h2>Children</h2>
      <p>Account holders must be 18 or older. Student records added by tutors may relate to children; account holders should add only what is needed to track fees and should obtain parental consent where required.</p>

      <h2>Grievance officer</h2>
      <p>For privacy questions or complaints, write to the grievance officer at {SITE.email}, {SITE.legalEntity}, {SITE.city}. We aim to respond within 7 days and resolve complaints within 30 days.</p>

      <h2>Changes</h2>
      <p>If we make significant changes, we will notify account holders by email or in the app before they take effect.</p>
    </LegalPage>
  );
}
