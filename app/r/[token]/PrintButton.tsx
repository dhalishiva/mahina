"use client";
export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="mt-6 rounded-xl px-4 py-2 font-semibold text-ink ring-1 ring-line hover:bg-ink-soft print:hidden">
      Print or save as PDF
    </button>
  );
}
