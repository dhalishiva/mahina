import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <Link href="/" aria-label="Mahina home" className="self-start"><Logo /></Link>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">{children}</main>
        <p className="text-xs text-muted">
          <Link href="/terms" className="hover:underline">Terms</Link>{"  ·  "}
          <Link href="/privacy" className="hover:underline">Privacy</Link>{"  ·  "}
          <Link href="/help" className="hover:underline">Help</Link>
        </p>
      </div>
      <aside className="register relative hidden overflow-hidden border-l border-rule bg-white lg:block" aria-hidden>
        <div className="absolute inset-0 flex flex-col justify-center pl-[80px] pr-16">
          <p className="font-hand text-3xl text-ink">Oct — fees</p>
          <ul className="mt-6 space-y-[0px] font-hand text-2xl">
            {["Aarav ₹1,500", "Diya ₹1,500", "Kabir ₹1,200", "Meera ₹2,000", "Rohit ₹1,500", "Sana ₹1,800"].map((t, i) => (
              <li key={t} className="flex h-11 items-center justify-between">
                <span>{t}</span>
                {i % 3 !== 1 ? <span className="-rotate-6 rounded border-2 border-paid px-2 font-display text-sm font-extrabold not-italic text-paid">PAID</span> : <span className="text-due">due</span>}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
