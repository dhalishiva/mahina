"use client";
import { FixtureProvider, type Profile } from "@/lib/store";
import { AppShell } from "@/components/app/AppShell";
import { DashboardView, MemberDetailView, MembersView } from "@/components/app/views";
import { ReminderComposer } from "@/components/app/sheets";
import { BillingView } from "@/components/app/views2";
import { computeStatus, istToday, periodKey, type Member, type Payment } from "@/lib/dues";

const t = istToday();
const back = (n: number) => { let y = t.y, m = t.m - n; while (m < 1) { m += 12; y--; } return periodKey(y, m); };
const day = (p: string, d: number) => p.slice(0, 8) + String(d).padStart(2, "0");

const profile: Profile = {
  id: "u1", email: "ramesh@example.com", full_name: "Ramesh Sharma", business_name: "Sharma Tuition Classes", business_type: "Home tuition",
  phone: "98100 12345", upi_id: "sharma.tuitions@okaxis", upi_name: "Ramesh Sharma", reminder_lang: "hinglish", plan: "pro",
  plan_expires_at: "2027-10-01T00:00:00Z", subscription_id: null, subscription_status: null, is_admin: false, created_at: "2026-04-01T00:00:00Z",
};

const raw: [string, string, number, string, number, number][] = [
  // name, batch, fee, phone, months back started, months unpaid at end (0 = all paid)
  ["Aarav Sharma", "Class 10 Maths", 1500, "9876543210", 6, 0],
  ["Diya Verma", "Class 10 Maths", 1500, "9812345678", 6, 1],
  ["Kabir Singh", "Class 8 Science", 1200, "9898989898", 5, 0],
  ["Meera Joshi", "Class 12 Physics", 2000, "9765432109", 6, 2],
  ["Rohit Kumar", "Class 10 Maths", 1500, "9811122233", 4, 0],
  ["Sana Qureshi", "Class 8 Science", 1200, "9822233344", 6, 0],
  ["Ishaan Rao", "Class 12 Physics", 2000, "9833344455", 3, 1],
  ["Ananya Gupta", "Class 10 Maths", 1500, "9844455566", 6, 0],
  ["Vihaan Mehta", "Class 8 Science", 1200, "9855566677", 2, 0],
  ["Tara Kapoor", "Class 12 Physics", 2000, "9866677788", 5, 0],
  ["Arjun Nair", "Class 10 Maths", 1500, "9877788899", 6, 0],
  ["Zoya Khan", "Class 8 Science", 1200, "9888899900", 4, 1],
  ["Kavya Iyer", "Class 12 Physics", 2000, "9899900011", 6, 0],
  ["Reyansh Das", "Class 10 Maths", 1500, "9800011122", 3, 0],
  ["Myra Bose", "Class 8 Science", 1200, "9811100033", 5, 0],
];
const members: Member[] = [];
const payments: Payment[] = [];
let rn = 1001;
raw.forEach(([name, batch, fee, phone, since, unpaid], i) => {
  const id = "m" + i;
  members.push({ id, name, phone, monthly_fee: fee, due_day: 5, batch, start_month: back(since), active: true, notes: null, pay_token: `7f3c9a12-4b8e-4d21-9c5a-2e8f6b1d0a${i.toString(16).padStart(2, "0")}`, pay_code: `Kp7qXm${String.fromCharCode(65 + i)}2`, created_at: "" });
  for (let k = since; k >= 0; k--) {
    if (k < unpaid) continue; // the most recent `unpaid` months stay unpaid
    if (k === 0 && i % 4 === 3) continue; // a few haven't paid this month yet
    const p = back(k);
    payments.push({ id: `p${i}-${k}`, member_id: id, period: p, amount: fee, method: (i + k) % 4 === 0 ? "cash" : "upi", paid_on: day(p, Math.min(28, 2 + ((i + k) % 7))), note: null, receipt_no: rn++, receipt_token: "x", receipt_code: "Rc8vNw3T", created_at: "" });
  }
});
payments.sort((a, b) => (a.paid_on < b.paid_on ? 1 : -1));

export function Screens({ name }: { name: string }) {
  return (
    <FixtureProvider profile={profile} members={members} payments={payments}>
      {name === "dashboard" && <AppShell active="/app"><DashboardView /></AppShell>}
      {name === "members" && <AppShell active="/app/members"><MembersView /></AppShell>}
      {name === "billing" && <AppShell active="/app/billing"><BillingView /></AppShell>}
      {name === "member" && <AppShell active="/app/members"><MemberDetailView id="m3" /></AppShell>}
      {name === "reminder" && (
        <AppShell active="/app/members">
          <h1 className="mb-4 font-display text-2xl font-bold">Remind Meera</h1>
          <ReminderComposer st={computeStatus(members[3], payments)} />
        </AppShell>
      )}
    </FixtureProvider>
  );
}
