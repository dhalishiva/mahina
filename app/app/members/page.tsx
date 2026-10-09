import { MembersView } from "@/components/app/views";
export default async function Page({ searchParams }: { searchParams: Promise<{ add?: string; filter?: string }> }) {
  const sp = await searchParams;
  return <MembersView initialAdd={sp.add === "1"} initialFilter={(["due", "soon", "paid", "inactive"] as const).find((f) => f === sp.filter) ?? "all"} />;
}
