import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the Mahina team for help, billing questions, refunds or feedback.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 pt-14 sm:px-6 md:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Contact us</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">Questions, billing, refunds or a feature you&apos;d like? Send us a message and we&apos;ll reply by email within one working day (Monday to Saturday, 10 am to 6 pm IST).</p>
        <dl className="mt-8 space-y-4">
          <div><dt className="text-sm text-muted">Email</dt><dd className="font-semibold">{SITE.email}</dd></div>
          <div><dt className="text-sm text-muted">Business</dt><dd className="font-semibold">{SITE.legalEntity}</dd></div>
          <div><dt className="text-sm text-muted">Address</dt><dd className="font-semibold">{SITE.city}</dd></div>
        </dl>
      </div>
      <ContactForm />
    </div>
  );
}
