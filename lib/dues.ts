export type Member = {
  id: string;
  name: string;
  phone: string | null;
  monthly_fee: number;
  due_day: number;
  batch: string | null;
  start_month: string; // YYYY-MM-DD (first of month)
  active: boolean;
  notes: string | null;
  pay_token: string;
  pay_code: string;
  created_at: string;
};

export type Payment = {
  id: string;
  member_id: string;
  period: string; // YYYY-MM-01
  amount: number;
  method: "upi" | "cash" | "bank" | "other";
  paid_on: string;
  note: string | null;
  receipt_no: number;
  receipt_token: string;
  receipt_code: string;
  created_at: string;
};

export type MonthState = { period: string; fee: number; paid: number; status: "paid" | "partial" | "due" | "upcoming" };
export type MemberStatus = {
  member: Member;
  months: MonthState[];
  outstanding: number;
  dueMonths: number;
  currentStatus: "paid" | "partial" | "due" | "upcoming";
  lastPaidOn: string | null;
};

/** Today's date in India, independent of the device timezone. */
export function istToday(now = new Date()): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

export const periodKey = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}-01`;

export function currentPeriod(now = new Date()) {
  const t = istToday(now);
  return periodKey(t.y, t.m);
}

export function computeStatus(member: Member, payments: Payment[], now = new Date()): MemberStatus {
  const t = istToday(now);
  const [sy, sm] = member.start_month.split("-").map(Number);
  const paidBy = new Map<string, number>();
  let lastPaidOn: string | null = null;
  for (const p of payments) {
    if (p.member_id !== member.id) continue;
    paidBy.set(p.period, (paidBy.get(p.period) || 0) + Number(p.amount));
    if (!lastPaidOn || p.paid_on > lastPaidOn) lastPaidOn = p.paid_on;
  }
  const months: MonthState[] = [];
  let y = sy, m = sm;
  const fee = Number(member.monthly_fee);
  while (y < t.y || (y === t.y && m <= t.m)) {
    const key = periodKey(y, m);
    const paid = paidBy.get(key) || 0;
    const isCurrent = y === t.y && m === t.m;
    let status: MonthState["status"];
    if (paid >= fee) status = "paid";
    else if (paid > 0) status = "partial";
    else if (isCurrent && t.d < member.due_day) status = "upcoming";
    else status = "due";
    months.push({ period: key, fee, paid, status });
    m++; if (m > 12) { m = 1; y++; }
  }
  let outstanding = 0, dueMonths = 0;
  for (const ms of months) {
    if (ms.status === "due" || ms.status === "partial") {
      outstanding += Math.max(ms.fee - ms.paid, 0);
      dueMonths++;
    }
  }
  const cur = months[months.length - 1];
  return {
    member, months, outstanding, dueMonths,
    currentStatus: cur ? cur.status : "upcoming",
    lastPaidOn,
  };
}

export const inr = (n: number) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export function monthLabel(period: string, style: "short" | "long" = "short") {
  const [y, m] = period.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-IN", {
    month: style, year: style === "long" ? "numeric" : "2-digit", timeZone: "UTC",
  });
}

/** Digits only, Indian numbers default to +91 for wa.me links. */
export function waNumber(phone: string | null) {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return "91" + d;
  if (d.length === 12 && d.startsWith("91")) return d;
  if (d.length === 11 && d.startsWith("0")) return "91" + d.slice(1);
  return d.length >= 10 ? d : null;
}
