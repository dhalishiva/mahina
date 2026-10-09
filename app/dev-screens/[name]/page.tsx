import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { Screens } from "./Screens";
import { PayPageView, upiUri } from "@/components/PayPageView";

// Renders real app views with sample data for marketing screenshots. Never available in production.
export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DEV_SCREENS !== "1") notFound();
  const { name } = await params;
  if (name === "paypage") {
    const d = { member_first_name: "Diya", business_name: "Sharma Tuition Classes", upi_id: "sharma.tuitions@okaxis", upi_name: "Ramesh Sharma", monthly_fee: 1500, amount_due: 1500, due_day: 5 };
    const qr = await QRCode.toString(upiUri(d, 1500), { type: "svg", margin: 1, color: { dark: "#161a2c", light: "#ffffff" } });
    return <PayPageView d={d} qrSvg={qr} />;
  }
  return <Screens name={name} />;
}
