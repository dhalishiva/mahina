import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Mahina home"><Logo /></Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-[0.95rem]">
          <Link href="/#how" className="hidden rounded-lg px-3 py-2 text-muted hover:text-text md:inline">How it works</Link>
          <Link href="/pricing" className="hidden rounded-lg px-3 py-2 text-muted hover:text-text sm:inline">Pricing</Link>
          <Link href="/tools/fee-reminder-message" className="hidden rounded-lg px-3 py-2 text-muted hover:text-text lg:inline">Free reminder tool</Link>
          <Link href="/login" className="rounded-lg px-3 py-2 font-medium text-text hover:bg-surface">Log in</Link>
          <Link href="/signup" className="rounded-lg bg-ink px-4 py-2 font-semibold text-white hover:bg-ink-dark">Start free</Link>
        </nav>
      </div>
    </header>
  );
}
