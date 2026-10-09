import { ImageResponse } from "next/og";

export const alt = "Mahina by SlotRecover — monthly fee collection with WhatsApp reminders and UPI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  const rows = [["Aarav", "PAID"], ["Diya", "DUE"], ["Kabir", "PAID"], ["Meera", "PAID"]];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#2433A6", color: "white", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1.25 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="72" height="72" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#ffffff" /><rect x="17" y="5" width="6" height="11" rx="3" fill="#9aa8ff" /><rect x="41" y="5" width="6" height="11" rx="3" fill="#9aa8ff" /><path d="M16 47V24l15 17L49 19" fill="none" stroke="#2433A6" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 46, fontWeight: 800 }}>Mahina</span>
              <span style={{ fontSize: 22, opacity: 0.75 }}>by SlotRecover</span>
            </div>
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Get every month&apos;s fees on time, without asking twice.</div>
          <div style={{ fontSize: 26, opacity: 0.8 }}>WhatsApp reminders · UPI payment links · Receipts · Free for 15 members</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 0.75, marginLeft: 48, background: "white", borderRadius: 28, padding: "32px 32px 32px 56px", color: "#161a2c", borderLeft: "6px solid #e3474f" }}>
          <span style={{ fontSize: 28, color: "#2433A6", marginBottom: 16 }}>October fees</span>
          {rows.map(([n, s]) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 74, borderBottom: "2px solid #d9e3f2", fontSize: 32 }}>
              <span>{n}</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: s === "PAID" ? "#0e7a4e" : "#c2410c", border: s === "PAID" ? "3px solid #0e7a4e" : "none", borderRadius: 6, padding: "2px 10px", transform: "rotate(-8deg)" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
