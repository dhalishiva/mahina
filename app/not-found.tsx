import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-surface px-4 text-center">
      <div>
        <LogoMark size={48} className="mx-auto" />
        <h1 className="mt-6 font-display text-3xl font-extrabold">This page isn&apos;t in the register</h1>
        <p className="mt-2 text-muted">The link may be old, or the payment link may have been turned off.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-ink px-5 py-3 font-semibold text-white">Go to Mahina</Link>
      </div>
    </main>
  );
}
