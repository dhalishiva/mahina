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

/**
 * How late (or how soon) a member's payment is, in days, counted in India time.
 * - overdueDays: days since the due date of the oldest unpaid month (0 if nothing is overdue yet).
 * - dueInDays: days until this month's due date, only when this month is still upcoming.
 */
export function dueTiming(st: MemberStatus, now = new Date()): { overdueDays: number; dueInDays: number | null } {
  const t = istToday(now);
  const todayUtc = Date.UTC(t.y, t.m - 1, t.d);
  const oldest = st.months.find((ms) => ms.status === "due" || ms.status === "partial");
  let overdueDays = 0;
  if (oldest) {
    const [y, m] = oldest.period.split("-").map(Number);
    const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const dueUtc = Date.UTC(y, m - 1, Math.min(st.member.due_day, lastDay));
    overdueDays = Math.max(0, Math.round((todayUtc - dueUtc) / 86400_000));
  }
  const dueInDays = st.currentStatus === "upcoming" ? Math.max(0, st.member.due_day - t.d) : null;
  return { overdueDays, dueInDays };
}

/** Default order for lists: most overdue first, then part-paid, then due soonest, then paid. */
export function urgencyRank(st: MemberStatus, now = new Date()) {
  const { overdueDays, dueInDays } = dueTiming(st, now);
  if (st.outstanding > 0 && overdueDays > 0) return { group: 0, key: -overdueDays, tie: -st.outstanding };
  if (st.outstanding > 0) return { group: 1, key: -st.outstanding, tie: 0 };
  if (dueInDays !== null) return { group: 2, key: dueInDays, tie: 0 };
  return { group: 3, key: 0, tie: 0 };
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
