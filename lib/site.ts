export const SITE = {
  name: "Mahina",
  byline: "by SlotRecover",
  fullName: "Mahina by SlotRecover",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://mahina.kriosity.in").replace(/\/$/, ""),
  tagline: "Monthly fee collection on WhatsApp and UPI",
  description:
    "Mahina helps tuition teachers, tiffin services, gyms, yoga and music classes collect monthly fees on time. Send WhatsApp fee reminders with a UPI payment link, track who has paid, and share receipts. Free for up to 2 members.",
  email: "support@kriosity.in",
  legalEntity: "Shiva Dhali Services",
  city: "Noida, Uttar Pradesh, India",
  freeLimit: 2,
};

export const PLANS = {
  pro_monthly: { code: "pro_monthly", label: "Pro monthly", rupees: 149, paise: 14900, months: 1 },
  pro_yearly: { code: "pro_yearly", label: "Pro yearly", rupees: 1490, paise: 149000, months: 12 },
} as const;
export type PlanCode = keyof typeof PLANS;
