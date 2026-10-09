export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-muted">Last updated {updated}</p>
      <div className="prose-legal mt-8">{children}</div>
    </article>
  );
}
