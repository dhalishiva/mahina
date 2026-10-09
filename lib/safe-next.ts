/** Only allow same-site relative redirects into the app, never to another origin. */
export function safeNext(next: string | null | undefined, fallback = "/app") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (!/^\/(app|admin)(\/|$|\?)/.test(next)) return fallback;
  return next;
}
