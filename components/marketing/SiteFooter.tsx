import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SEGMENTS } from "@/lib/segments";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-[#141a4d] text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Monthly fee collection for India&apos;s small teachers, trainers and service providers. Made in Noida.
          </p>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-white">Mahina for</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {SEGMENTS.slice(0, 6).map((s) => (
              <li key={s.slug}><Link className="hover:text-white" href={`/for/${s.slug}`}>{s.who.charAt(0).toUpperCase() + s.who.slice(1)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-white">Product</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-white" href="/tools/fee-reminder-message">Fee reminder message generator</Link></li>
            <li><Link className="hover:text-white" href="/guides/how-to-ask-for-fees-politely">How to ask for fees politely</Link></li>
            <li><Link className="hover:text-white" href="/help">Help centre</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-white">Legal</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/privacy">Privacy policy</Link></li>
            <li><Link className="hover:text-white" href="/terms">Terms and conditions</Link></li>
            <li><Link className="hover:text-white" href="/refund-policy">Cancellation and refunds</Link></li>
            <li><Link className="hover:text-white" href="/shipping-policy">Delivery policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {SITE.legalEntity}. Mahina is a SlotRecover product.</p>
          <p>Payments are made directly to your UPI ID. Mahina never holds your money.</p>
        </div>
      </div>
    </footer>
  );
}
