"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { useStore } from "@/lib/store";
import { supabaseBrowser } from "@/lib/supabase/client";

const NAV = [
  { href: "/app", label: "Home", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" },
  { href: "/app/members", label: "Members", icon: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM22 19v-1a4 4 0 0 0-3-3.8M16 3.2a3.5 3.5 0 0 1 0 6.6" },
  { href: "/app/billing", label: "Plan", icon: "M3 7h18v12H3zM3 11h18M7 15h3" },
  { href: "/app/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" },
];

export function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;
}

export function AppShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const pathname = usePathname();
  const current = active ?? pathname;
  const { profile, isPro } = useStore();
  const isActive = (href: string) => (href === "/app" ? current === "/app" : current.startsWith(href));

  return (
    <div className="min-h-dvh bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-white px-4 py-5 md:flex">
        <Link href="/app" className="flex items-center gap-2.5 px-2">
          <LogoMark size={30} />
          <span className="font-display text-xl font-extrabold tracking-tight">Mahina</span>
        </Link>
        <nav className="mt-8 space-y-1" aria-label="App">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium ${isActive(n.href) ? "bg-ink-soft text-ink" : "text-muted hover:bg-surface hover:text-text"}`}>
              <Icon d={n.icon} /> {n.label}
            </Link>
          ))}
          {profile?.is_admin && (
            <Link href="/admin" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium ${current.startsWith("/admin") ? "bg-ink-soft text-ink" : "text-muted hover:bg-surface hover:text-text"}`}>
              <Icon d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /> Admin
            </Link>
          )}
        </nav>
        <div className="mt-auto rounded-xl bg-surface p-3">
          <p className="truncate text-sm font-semibold">{profile?.business_name || profile?.full_name || "Your business"}</p>
          <p className="truncate text-xs text-muted">{profile?.email}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${isPro ? "bg-ink text-white" : "bg-white text-muted ring-1 ring-line"}`}>{isPro ? "PRO" : "FREE"}</span>
            <SignOut />
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 md:hidden">
        <Link href="/app" className="flex items-center gap-2"><LogoMark size={26} /><span className="font-display text-lg font-extrabold">Mahina</span></Link>
        <div className="flex items-center gap-2">
          {profile?.is_admin && <Link href="/admin" className="rounded-lg px-2 py-1 text-sm font-semibold text-ink">Admin</Link>}
          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${isPro ? "bg-ink text-white" : "bg-surface text-muted ring-1 ring-line"}`}>{isPro ? "PRO" : "FREE"}</span>
          <details key={current} className="relative">
            <summary aria-label="Account" className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full bg-ink-soft font-bold text-ink [&::-webkit-details-marker]:hidden">
              {(profile?.full_name || profile?.email || "?").trim().charAt(0).toUpperCase()}
            </summary>
            <div className="absolute right-0 top-11 z-40 w-60 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-line">
              <p className="truncate px-3 pt-2 text-sm font-semibold">{profile?.business_name || profile?.full_name || "Your business"}</p>
              <p className="truncate px-3 pb-2 text-xs text-muted">{profile?.email}</p>
              <Link href="/app/settings" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-surface">Settings</Link>
              <Link href="/help" className="block rounded-lg px-3 py-2.5 text-sm hover:bg-surface">Help</Link>
              <SignOut className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-due hover:bg-due-soft" />
            </div>
          </details>
        </div>
      </header>

      <main className="pb-24 md:ml-60 md:pb-10">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 md:py-8">{children}</div>
      </main>

      <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 py-2 text-[0.7rem] font-semibold ${isActive(n.href) ? "text-ink" : "text-muted"}`}>
            <Icon d={n.icon} size={22} /> {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function SignOut({ className = "text-xs font-semibold text-muted hover:text-due" }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => { await supabaseBrowser().auth.signOut(); location.href = "/login"; }}
    >Sign out</button>
  );
}
