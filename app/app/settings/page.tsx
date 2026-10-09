import { SettingsView } from "@/components/app/views2";
export default async function Page({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  return <SettingsView welcome={(await searchParams).welcome === "1"} />;
}
