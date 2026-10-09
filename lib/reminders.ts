export type Lang = "en" | "hi" | "hinglish";
export type Tone = "gentle" | "firm";

export type ReminderInput = {
  name: string;
  business: string;
  amount: string; // already formatted, e.g. ₹1,500
  months: string; // e.g. "Oct" or "Sep, Oct"
  link?: string;
  tone?: Tone;
};

/**
 * Messages name the member in the third person ("Diya's fee"), so they read
 * correctly whether they go to an adult member or to a child's parent.
 */
export function reminderText(lang: Lang, i: ReminderInput) {
  const first = i.name.trim().split(/\s+/)[0];
  const firm = i.tone === "firm";
  const link = i.link || "";
  if (lang === "hi") {
    return firm
      ? `नमस्ते 🙏\n${i.business}: ${first} की ${i.months} की फीस ${i.amount} अभी तक बाकी है। कृपया आज भुगतान कर दें।${link ? `\nUPI से भुगतान करें: ${link}` : ""}\nधन्यवाद`
      : `नमस्ते 🙏\n${i.business}: ${first} की ${i.months} की फीस ${i.amount} देय है।${link ? `\nएक क्लिक में UPI से भुगतान करें: ${link}` : ""}\nअगर भुगतान हो गया है तो कृपया इस संदेश को अनदेखा करें। धन्यवाद!`;
  }
  if (lang === "hinglish") {
    return firm
      ? `Namaste 🙏\n${i.business}: ${first} ki ${i.months} ki fees ${i.amount} abhi tak pending hai. Kripya aaj payment kar dijiye.${link ? `\nUPI se pay karein: ${link}` : ""}\nDhanyavaad`
      : `Namaste 🙏\n${i.business}: ${first} ki ${i.months} ki fees ${i.amount} due hai.${link ? `\nEk click mein UPI se pay karein: ${link}` : ""}\nAgar payment ho gaya hai toh is message ko ignore karein. Thank you!`;
  }
  return firm
    ? `Hello,\n${i.business}: the fee of ${i.amount} for ${first} (${i.months}) is still pending. Please clear it today.${link ? `\nPay by UPI: ${link}` : ""}\nThank you.`
    : `Hello 👋\nA gentle reminder from ${i.business}: the fee of ${i.amount} for ${first} (${i.months}) is due.${link ? `\nPay in one tap by UPI: ${link}` : ""}\nIf you have already paid, please ignore this message. Thank you!`;
}

export function receiptText(i: { business: string; name: string; amount: string; months: string; link: string }) {
  return `Payment received ✅\n${i.business}: ${i.amount} for ${i.name.split(" ")[0]} (${i.months}).\nReceipt: ${i.link}\nThank you!`;
}

export function waLink(number: string | null, text: string) {
  const t = encodeURIComponent(text);
  return number ? `https://wa.me/${number}?text=${t}` : `https://wa.me/?text=${t}`;
}
