export type Segment = {
  slug: string;
  who: string; // plural noun used in copy
  memberWord: string; // student, customer, member
  title: string; // <title>
  h1: string;
  description: string;
  intro: string;
  pains: string[];
  example: { name: string; fee: number; batch: string }[];
  faqs: { q: string; a: string }[];
};

export const SEGMENTS: Segment[] = [
  {
    slug: "tuition-teachers",
    who: "tuition teachers",
    memberWord: "student",
    title: "Tuition Fee Management App for Home Tutors — Fee Reminders on WhatsApp",
    h1: "Tuition fee tracking for home tutors and coaching classes",
    description:
      "Track monthly tuition fees, send WhatsApp fee reminders to parents in Hindi or English with a UPI payment link, and share fee receipts. Free for up to 15 students.",
    intro:
      "Most home tutors keep fees in a notebook and remember dues in their head. By the 10th of the month it is hard to tell which parent paid by UPI, who paid cash to the child, and who has not paid at all. Mahina keeps one fee register for every batch and lets you remind parents without the awkward phone call.",
    pains: [
      "Parents forget, and asking for fees in front of the student feels awkward",
      "UPI screenshots get lost in WhatsApp chats",
      "Students join mid-month and leave without clearing two months of dues",
    ],
    example: [
      { name: "Aarav Sharma", fee: 1500, batch: "Class 10 Maths" },
      { name: "Diya Verma", fee: 1500, batch: "Class 10 Maths" },
      { name: "Kabir Singh", fee: 1200, batch: "Class 8 Science" },
    ],
    faqs: [
      { q: "Can I send fee reminders to parents in Hindi?", a: "Yes. Every reminder can be sent in Hindi, Hinglish or English. You choose the language once in settings and can change it per message." },
      { q: "Do parents need to install an app?", a: "No. Parents get a normal WhatsApp message with a link. The link opens a page with your UPI QR code and a button that opens GPay, PhonePe or Paytm with the amount filled in." },
      { q: "Can I manage different batches with different fees?", a: "Yes. Each student has their own monthly fee and due date, and you can group students by batch." },
    ],
  },
  {
    slug: "tiffin-service",
    who: "tiffin services",
    memberWord: "customer",
    title: "Tiffin Service Billing App — Monthly Dabba Payment Tracker with UPI",
    h1: "Monthly billing for tiffin and dabba services",
    description:
      "Collect monthly tiffin payments on time. Track every customer, send WhatsApp payment reminders with a UPI link and share receipts. Built for home tiffin services in India.",
    intro:
      "A tiffin service runs on small monthly payments from many customers, often students and working professionals who move cities without notice. Mahina shows you who owes what for which month, and sends a polite reminder with your UPI QR in one tap.",
    pains: [
      "Customers pay late because they forget, not because they will not pay",
      "Some pay half now and half later, and the notebook stops making sense",
      "PG students leave the city with a month unpaid",
    ],
    example: [
      { name: "Rohit Kumar", fee: 3200, batch: "Lunch + dinner" },
      { name: "Sneha Iyer", fee: 1800, batch: "Lunch only" },
      { name: "Imran Khan", fee: 3200, batch: "Lunch + dinner" },
    ],
    faqs: [
      { q: "Can I record a part payment?", a: "Yes. Record any amount against a month. Mahina shows that month as partly paid and keeps the balance in the outstanding total." },
      { q: "What happens when a customer stops the tiffin?", a: "Mark them inactive. Their history and any pending dues stay visible, and they stop counting towards new months." },
    ],
  },
  {
    slug: "gym-fitness",
    who: "gyms and fitness studios",
    memberWord: "member",
    title: "Gym Fee Reminder App India — Membership Payment Tracker for Small Gyms",
    h1: "Membership fee tracking for small gyms",
    description:
      "Simple membership fee tracking for neighbourhood gyms and fitness studios. See unpaid members at a glance and send WhatsApp reminders with a UPI payment link.",
    intro:
      "Neighbourhood gyms lose more money to forgotten renewals than to anything else. Mahina lists every member whose month has run out and lets you send a renewal reminder with a UPI link from your phone, between sessions.",
    pains: [
      "Members keep training after their month ends and nobody notices",
      "The front desk register does not match the UPI app",
      "Chasing payments takes time away from training clients",
    ],
    example: [
      { name: "Vikram Rathore", fee: 1200, batch: "Morning" },
      { name: "Pooja Nair", fee: 1500, batch: "Evening + cardio" },
      { name: "Arjun Mehta", fee: 1200, batch: "Morning" },
    ],
    faqs: [
      { q: "Can each member have a different due date?", a: "Yes. Set the due day for each member, for example the date they joined, and Mahina marks them due from that day each month." },
      { q: "Is there a limit on members?", a: "The free plan covers 15 members. Pro is ₹149 a month for unlimited members." },
    ],
  },
  {
    slug: "yoga-classes",
    who: "yoga teachers",
    memberWord: "student",
    title: "Yoga Class Fee Tracker — Monthly Payment Reminders for Yoga Teachers",
    h1: "Fee tracking for yoga teachers and studios",
    description:
      "Track monthly fees for yoga batches, online or in person. Send gentle WhatsApp reminders with your UPI link and keep receipts for every student.",
    intro:
      "Yoga teachers often run several small batches, some online and some in a society hall. Mahina keeps every student's monthly fee in one place and sends reminders that sound like you, not like a collection agent.",
    pains: [
      "Reminding students about fees feels at odds with the calm of the class",
      "Online students across cities pay at different times",
      "Hard to see which batch is actually profitable",
    ],
    example: [
      { name: "Meera Joshi", fee: 2000, batch: "6 am online" },
      { name: "Anita Desai", fee: 2500, batch: "Society hall" },
      { name: "Rahul Gupta", fee: 2000, batch: "6 am online" },
    ],
    faqs: [
      { q: "Can I keep the reminder gentle?", a: "Yes. Choose between a gentle and a firm tone. The gentle message reminds and tells students to ignore it if they have already paid." },
    ],
  },
  {
    slug: "music-dance-classes",
    who: "music and dance teachers",
    memberWord: "student",
    title: "Music & Dance Class Fee Management App — Track Monthly Fees Easily",
    h1: "Monthly fees for music and dance classes, sorted",
    description:
      "Guitar, keyboard, vocal, Kathak or Bollywood dance — track monthly class fees, remind parents on WhatsApp with a UPI link, and share receipts.",
    intro:
      "Whether you teach keyboard from home or run a dance academy with weekend batches, the fee register is the part nobody enjoys. Mahina turns it into a two-minute job at the start of each month.",
    pains: [
      "Parents pay for siblings together and the notebook gets confusing",
      "Weekend batches mean you see students only twice a week",
      "You need receipts for parents who ask for them",
    ],
    example: [
      { name: "Ishaan Rao", fee: 1800, batch: "Keyboard Sat" },
      { name: "Tara Kapoor", fee: 2200, batch: "Kathak Sun" },
      { name: "Nikhil Das", fee: 1800, batch: "Guitar Sat" },
    ],
    faqs: [
      { q: "Can I share a receipt after payment?", a: "Yes. Every payment you record gets a receipt link you can send on WhatsApp. Parents can open or print it." },
    ],
  },
  {
    slug: "pg-hostel-rent",
    who: "PG and hostel owners",
    memberWord: "tenant",
    title: "PG Rent Collection App — Monthly Rent Reminder on WhatsApp with UPI",
    h1: "Rent reminders for small PGs and hostels",
    description:
      "Collect PG and hostel rent on time. Track each tenant's monthly rent, send WhatsApp rent reminders with your UPI QR, and share rent receipts. Free for up to 15 tenants.",
    intro:
      "If you run a small PG or rent out a few rooms, you do not need property-management software with a 30-minute demo. You need to know who has not paid this month and a quick way to remind them. That is what Mahina does.",
    pains: [
      "Tenants pay rent on different dates through different UPI apps",
      "Rent receipts for HRA are requested at the last minute",
      "Following up in person with tenants is uncomfortable",
    ],
    example: [
      { name: "Ankit Yadav", fee: 7500, batch: "Room 2 · double" },
      { name: "Priya Menon", fee: 9000, batch: "Room 4 · single" },
      { name: "Saurabh Jain", fee: 7500, batch: "Room 2 · double" },
    ],
    faqs: [
      { q: "Can tenants use the receipt for HRA?", a: "Mahina receipts show the tenant name, amount, month, payment date and your business name. For an HRA claim, tenants may also need your PAN if annual rent is above ₹1 lakh, which you can add to the receipt note." },
    ],
  },
  {
    slug: "milk-newspaper-delivery",
    who: "milk and newspaper vendors",
    memberWord: "customer",
    title: "Doodhwala & Newspaper Bill Tracker — Monthly Payment App for Vendors",
    h1: "Monthly bills for milk and newspaper delivery",
    description:
      "For doodhwalas, newspaper vendors and daily delivery services: track monthly bills for every household and send WhatsApp payment reminders with a UPI link.",
    intro:
      "Daily delivery businesses bill once a month, often to a hundred households or more. Mahina gives every household a fixed monthly amount, flags the ones who have not paid, and sends each a reminder with your UPI details.",
    pains: [
      "Collecting cash door to door takes whole evenings",
      "Households move without settling the last month",
      "The diary gets wet, torn or lost",
    ],
    example: [
      { name: "Flat B-204", fee: 1860, batch: "2 L daily" },
      { name: "Flat C-101", fee: 930, batch: "1 L daily" },
      { name: "House 17", fee: 450, batch: "2 newspapers" },
    ],
    faqs: [
      { q: "What if the amount changes every month?", a: "Set the usual monthly amount, then record the actual payment. Mahina shows any shortfall as a part payment for that month." },
    ],
  },
  {
    slug: "society-maintenance",
    who: "housing societies",
    memberWord: "flat",
    title: "Society Maintenance Collection App — Reminders for RWAs on WhatsApp",
    h1: "Maintenance collection for small societies and RWAs",
    description:
      "Track monthly maintenance for every flat, send WhatsApp reminders with the society UPI ID, and share receipts. A simple tool for small RWAs and apartment treasurers.",
    intro:
      "Society treasurers are volunteers. Mahina helps you keep a clean record of which flats have paid maintenance, remind the rest without a group-chat argument, and hand over clean records at the AGM.",
    pains: [
      "Defaulters are reminded in the society group, which causes friction",
      "Treasurer changes every year and records get lost",
      "Flats pay quarterly, monthly or in advance",
    ],
    example: [
      { name: "A-101 Malhotra", fee: 2500, batch: "Tower A" },
      { name: "A-102 Reddy", fee: 2500, batch: "Tower A" },
      { name: "B-304 Chopra", fee: 3000, batch: "Tower B" },
    ],
    faqs: [
      { q: "Can a flat pay for several months together?", a: "Yes. Record a payment against each month it covers, and those months show as paid." },
    ],
  },
  {
    slug: "sports-coaching",
    who: "sports coaches",
    memberWord: "player",
    title: "Sports Academy Fee App — Cricket, Football, Swimming Coaching Fees",
    h1: "Fee tracking for cricket, football and swimming coaches",
    description:
      "Monthly fee tracking for sports academies and coaches. Send parents WhatsApp reminders with a UPI payment link and keep a clean record of every player.",
    intro:
      "Coaches spend evenings on the ground, not on spreadsheets. Mahina lists the players whose fee is pending this month so you can remind parents in a minute before practice.",
    pains: [
      "Parents drop children off and leave before you can ask",
      "Seasonal batches mean players come and go",
      "Kit and tournament fees get mixed with monthly fees",
    ],
    example: [
      { name: "Yash Patil", fee: 2000, batch: "U-14 cricket" },
      { name: "Riya Shah", fee: 2500, batch: "Swimming" },
      { name: "Aditya Bose", fee: 2000, batch: "U-14 cricket" },
    ],
    faqs: [
      { q: "Can I record one-off fees like kit or tournaments?", a: "Record them as a payment with a note. Monthly dues stay separate so your totals remain accurate." },
    ],
  },
  {
    slug: "daycare-playschool",
    who: "daycares and playschools",
    memberWord: "child",
    title: "Daycare & Playschool Fee Management — Monthly Fee Reminders for Parents",
    h1: "Monthly fee collection for daycares and playschools",
    description:
      "Track monthly daycare and playschool fees, remind parents politely on WhatsApp with a UPI link, and share receipts parents can keep.",
    intro:
      "Small daycares and playschools run on trust with parents. Mahina keeps fees organised and reminders polite, so the conversation at pickup can stay about the child.",
    pains: [
      "Pickup time is not the moment to discuss pending fees",
      "Siblings, discounts and part payments make the register messy",
      "Parents ask for receipts for office reimbursement",
    ],
    example: [
      { name: "Anaya Kulkarni", fee: 6000, batch: "Full day" },
      { name: "Vihaan Arora", fee: 3500, batch: "Half day" },
      { name: "Sara Thomas", fee: 6000, batch: "Full day" },
    ],
    faqs: [
      { q: "Can I give a sibling discount?", a: "Yes. Set a lower monthly fee for that child. Every member has their own fee." },
    ],
  },
];

export const segmentBySlug = (slug: string) => SEGMENTS.find((s) => s.slug === slug);
