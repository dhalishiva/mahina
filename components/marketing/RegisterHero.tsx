const ROWS = [
  { name: "Aarav Sharma", fee: "1,500", marks: ["paid", "paid", "paid"] },
  { name: "Diya Verma", fee: "1,500", marks: ["paid", "paid", "due"] },
  { name: "Kabir Singh", fee: "1,200", marks: ["paid", "paid", "paid"] },
  { name: "Meera Joshi", fee: "2,000", marks: ["paid", "due", "due"] },
  { name: "Rohit Kumar", fee: "1,500", marks: ["paid", "paid", "paid"] },
];
const MONTHS = ["Aug", "Sep", "Oct"];

/** The paper fee register every tutor in India keeps, now with stamps that land on their own. */
export function RegisterHero() {
  let stampIndex = 0;
  return (
    <figure className="relative mx-auto w-full max-w-[520px]" aria-label="A fee register with paid stamps for each month">
      <div className="register relative overflow-hidden rounded-2xl border border-rule bg-white shadow-[0_30px_60px_-30px_rgba(36,51,166,0.35)]">
        <div className="flex h-[66px] items-end justify-between pl-[60px] pr-5 pb-2">
          <p className="font-hand text-xl text-ink sm:text-2xl">Fees register — Class 10</p>
          <p className="font-hand text-lg text-muted">2026</p>
        </div>
        <div className="grid grid-cols-[1fr_repeat(3,54px)] pl-[60px] pr-3 text-sm sm:grid-cols-[1fr_70px_repeat(3,66px)]">
          <div className="flex h-11 items-center font-hand text-muted">Name</div>
          <div className="hidden h-11 items-center justify-end pr-3 font-hand text-muted sm:flex">₹ / mo</div>
          {MONTHS.map((m) => (
            <div key={m} className="flex h-11 items-center justify-center font-hand text-muted">{m}</div>
          ))}
          {ROWS.map((r) => (
            <Row key={r.name} r={r} next={() => stampIndex++} />
          ))}
        </div>
        <div className="h-6" />
      </div>
      <div className="stamp absolute -right-2 bottom-8 hidden rounded-xl bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-line sm:block" style={{ animationDelay: "2.3s" }}>
        <span className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366] text-white" aria-hidden>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"/></svg>
          </span>
          <span><b className="font-semibold">Reminder sent</b> to Diya&apos;s mother</span>
        </span>
      </div>
    </figure>
  );
}

function Row({ r, next }: { r: (typeof ROWS)[number]; next: () => number }) {
  return (
    <>
      <div className="flex h-11 items-center truncate whitespace-nowrap font-hand text-[1.1rem] text-text">{r.name}</div>
      <div className="hidden h-11 items-center justify-end pr-3 font-hand text-[1.05rem] text-muted sm:flex">{r.fee}</div>
      {r.marks.map((m, i) => {
        const delay = 0.35 + next() * 0.11;
        return (
          <div key={i} className="flex h-11 items-center justify-center">
            {m === "paid" ? (
              <span
                className="stamp inline-block rounded-[5px] border-2 border-paid px-1.5 py-[1px] font-display text-[0.7rem] font-extrabold tracking-wide text-paid"
                style={{ animationDelay: `${delay}s` }}
              >PAID</span>
            ) : (
              <span className="font-hand text-[1.05rem] text-due">due</span>
            )}
          </div>
        );
      })}
    </>
  );
}
