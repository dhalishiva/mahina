export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="15" fill="#2433A6" />
      <rect x="17" y="5" width="6" height="11" rx="3" fill="#C9D3FF" />
      <rect x="41" y="5" width="6" height="11" rx="3" fill="#C9D3FF" />
      <path d="M16 47V24l15 17L49 19" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ byline = true, light = false }: { byline?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={30} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.35rem] font-extrabold tracking-tight ${light ? "text-white" : "text-text"}`}>Mahina</span>
        {byline && <span className={`text-[0.68rem] font-medium ${light ? "text-white/70" : "text-muted"}`}>by SlotRecover</span>}
      </span>
    </span>
  );
}
