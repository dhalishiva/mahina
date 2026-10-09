import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SEGMENTS } from "@/lib/segments";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-09");
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") =>
    ({ url: `${SITE.url}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("", 1, "weekly"),
    page("/pricing", 0.9),
    page("/tools/fee-reminder-message", 0.9),
    page("/guides/how-to-ask-for-fees-politely", 0.8),
    ...SEGMENTS.map((s) => page(`/for/${s.slug}`, 0.8)),
    page("/help", 0.6),
    page("/contact", 0.5),
    page("/signup", 0.6),
    page("/login", 0.3),
    page("/privacy", 0.3, "yearly"),
    page("/terms", 0.3, "yearly"),
    page("/refund-policy", 0.3, "yearly"),
    page("/shipping-policy", 0.2, "yearly"),
  ];
}
