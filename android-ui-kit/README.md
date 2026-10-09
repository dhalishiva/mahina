# Mahina Android UI kit

Everything needed to build the native Android app for **Mahina by SlotRecover**. The app talks to the same Supabase backend as the web app at `mahina-murex.vercel.app`.

**Target stack:** Kotlin, Jetpack Compose, Material 3, min SDK 26, `supabase-kt`, Ktor.

**Build priority:** phone first, portrait only, light theme only for v1.

## What's in this folder

| Path | What it is |
| --- | --- |
| `screens/png/` | 17 reference screens rendered at 1080×2340 (3× of 360×780 dp). Build to match these. |
| `screens/kit.html` | Source of the screens. Open it in a browser and inspect it for exact dp sizes, spacing and colours. |
| `tokens/design-tokens.json` | Colours, type scale, spacing, radii, sizes and motion. This is the source of truth. |
| `compose-theme/Theme.kt` | Ready Material 3 theme: colour scheme, typography, shapes and extra brand colours. |
| `res/values/colors.xml` | The same colours as Android resources. |
| `res/values/strings.xml` | All UI copy in English, plus the reminder and receipt message templates. |
| `res/values-hi/strings.xml` | Hindi UI copy. |
| `res/drawable/` | Logo vector, adaptive-icon foreground and monochrome (themed icon) layers. |
| `assets/fonts/` | Bricolage Grotesque (display), Hanken Grotesk (body) and Kalam (decorative). These are TTFs with Android-safe names; put them in `res/font/`. |
| `assets/icons/` | Legacy launcher PNGs for every density and the 512 px Play Store icon. |

## Brand rules

- **Primary colour** is ink `#2433A6`.
- **Status colours carry meaning:** green `paid` means money received, orange `due` means money owed. Never use them decoratively.
- **WhatsApp green `#25D366`** is used only on buttons that open WhatsApp.
- **The paper register look** (ruled lines, red margin, handwritten Kalam font, rotated PAID stamp) appears only on splash, onboarding and empty states. It is not used inside working screens.
- **Fonts:** display font for titles and big rupee amounts; body font for everything else.
- **Hindi:** Hanken has no Devanagari glyphs, so Android falls back to Noto Sans Devanagari automatically.
- **Writing style:** sentence case everywhere and no all-caps labels. The only exceptions are the `PRO`/`FREE` plan badge and the `PAID` stamp.
- **Rupee amounts:** use `₹` with Indian digit grouping (`₹1,50,000`). Use `NumberFormat.getInstance(Locale("en","IN"))`.
- **Minimum touch target** is 48 dp.

## Screens

| # | Screen | Notes |
| --- | --- | --- |
| 01 | Splash | Ink background, logo and wordmark. Use the Android 12+ SplashScreen API with `ic_launcher_foreground` on `@color/ink`. |
| 02 | Onboarding | 3 pages in a HorizontalPager (copy is `onb1`–`onb3` in strings). Shown once; store a flag in DataStore. "Skip" goes to Sign up. |
| 03 | Log in | Email and password. A text button switches to "Email me a sign-in link" (magic link). A "Forgot password?" link. |
| 04 | Sign up | Name, email and password (min 8 characters). If the response has no session, show "Check your email". |
| 05 | First-run setup | Shown when `profiles.business_name` is empty. Fields: business name, business type, UPI ID, name on UPI. Validate the UPI ID with `^[a-z0-9._-]{2,64}@[a-z]{2,32}$`. |
| 06 | Home | See "Home screen details" below. |
| 07 | Members | Search field, filter chips (All, Owes money, Paid this month, Inactive), a batch dropdown when batches exist, and an extended FAB "Add member". Overflow menu: Add several, Pick from contacts, Export CSV. |
| 08 | Members, empty | Register illustration plus three actions. |
| 09 | Add member | Modal bottom sheet. On the free plan, adding a 16th member fails: show `err_free_limit` with an Upgrade action. |
| 10 | Add several | Bottom sheet. Each line is "name, phone, fee"; separators can be comma, tab or semicolon. Validate every line and report the first bad line by number. |
| 11 | Member detail | See "Member detail details" below. |
| 12 | Record payment | Bottom sheet. "For month" lists every month from the start month to next month, newest first, each tagged paid, due, ₹X left or advance. The amount defaults to what's left for that month. "Paid by" is a segmented choice. "Paid on" defaults to today and can't be in the future. |
| 13 | Payment recorded | The sheet turns into a success state. The month chip behind it gets the stamp animation. Primary action: "Send receipt on WhatsApp". |
| 14 | Reminder composer | Bottom sheet. Language toggle and tone toggle, a live preview in a chat bubble, then "Open WhatsApp" and "Copy message". Default tone is firm if 2 or more months are due, otherwise gentle. Default language comes from `profiles.reminder_lang`. |
| 15 | Plan | Free usage meter, Pro yearly (highlighted) and Pro monthly. Pay through the Razorpay Android SDK; see "Billing" below. |
| 16 | Settings | Grouped list that edits the same profile fields as setup. Also: app language (follows the system by default; per-app language on Android 13+), help, privacy, terms, delete account (opens the contact form), sign out. |
| 17 | Components | Buttons, chips, fields (rest, focused and error), stat cards, list row, month chips, PAID stamp, banners and colour swatches. |

### Home screen details (06)

- **Top bar:** logo, the word "Mahina", and a PRO or FREE badge.
- **Header:** a greeting by time of day in IST, then "Month Year at Business name".
- **Stat cards:** two of them, followed by a progress bar showing collected ÷ expected.
- **"To remind" list:** members who owe money, sorted by number of months due (descending), then by amount owed. Each row has a WhatsApp "Remind" button.
- **Recent payments:** the latest 6, shown below the list.
- **Banner:** if no UPI ID is set, show the "Add your UPI ID" banner.

### Member detail details (11)

- **Header:** name, fee, due day, batch and phone.
- **Two primary actions:** Remind (WhatsApp green) and Record payment.
- **Three stats:** outstanding, paid so far, and "since".
- **Month grid:** 3 columns, newest first, up to 18 months. Tapping a month that isn't paid opens Record payment preset to that month.
- **Payments list:** each payment has a Receipt action that opens the receipt link.
- **Overflow menu:** Edit details, Mark inactive or active, Delete member (with a confirm dialog that explains the data loss).

**Navigation:** a bottom bar with 4 destinations (Home, Members, Plan, Settings). Member detail is pushed on top. Every create and edit action uses a modal bottom sheet, not a full screen.

## Business logic (must match the web app)

Port `lib/dues.ts` exactly.

- **Today means today in India.** Always compute "today" in `Asia/Kolkata`, whatever the device timezone.
- **Months owed:** a member owes one fee for every month from `start_month` through the current month. For each of these months (`period` = `YYYY-MM-01`), add up the payments recorded against that period, then classify it:

  | Condition | Status |
  | --- | --- |
  | paid ≥ fee | `paid` |
  | 0 < paid < fee | `partial` |
  | current month, today's day < `due_day`, nothing paid | `upcoming` |
  | otherwise | `due` |

- **Outstanding** is the sum of `fee − paid` over months that are `due` or `partial`.
- **Inactive members** keep their history but drop out of dashboard totals and the "To remind" list.

### Reminder text

- **Templates:** use the `tpl_*` strings, filled with:
  - business name (fallback: the owner's name),
  - the member's first name,
  - the months: due months as short names, comma-joined; if more than 3, write "Sep to Dec"; if nothing is due, use the current month,
  - the amount: outstanding, or the monthly fee if nothing is due,
  - the pay link: `https://mahina-murex.vercel.app/p/{members.pay_token}`.
- **Phone numbers for WhatsApp:** strip non-digits. If 10 digits, prefix `91`. If 12 digits starting with `91`, keep as is. If 11 digits starting with `0`, replace the `0` with `91`.

### WhatsApp intent

Open `https://wa.me/{number}?text={urlencoded}` with `Intent.ACTION_VIEW`. This works for WhatsApp and WhatsApp Business without a package name. If there's no number, use `https://wa.me/?text=...`. Never send messages automatically; the user always presses send in WhatsApp.

### Receipt

After recording a payment, send the `tpl_receipt` text with the link `https://mahina-murex.vercel.app/r/{payments.receipt_token}`.

## Backend contract (Supabase)

### Connection

- **Project URL:** `https://koenogmiaawffiwfmmfh.supabase.co`, region ap-south-1.
- **Key:** use the **publishable** key only. Get it from Supabase → Project Settings → API (it is the same key as `NEXT_PUBLIC_SUPABASE_ANON_KEY` on Vercel). Never ship a service-role key in the app.

### Auth

- Email and password, magic link, and password reset are all in use.
- For deep links back into the app, register the scheme `app.mahina://auth-callback` and add it to Supabase → Auth → Redirect URLs.

### Tables

Row-level security limits every query to the signed-in user's own rows.

| Table | Columns | Access from the app |
| --- | --- | --- |
| `profiles` | id, email, full_name, business_name, business_type, phone, upi_id, upi_name, reminder_lang (`en` \| `hi` \| `hinglish`), plan (`free` \| `pro`), plan_expires_at, is_admin, created_at | Read. Update only full_name, business_name, business_type, phone, upi_id, upi_name, reminder_lang. |
| `members` | id, owner_id, name, phone, monthly_fee, due_day (1–28), batch, start_month (date, 1st of month), active, notes, pay_token, created_at | Full CRUD. `owner_id` defaults to `auth.uid()`. Inserting beyond 15 on free raises `FREE_LIMIT`. |
| `payments` | id, owner_id, member_id, period (date, 1st of month), amount, method (`upi` \| `cash` \| `bank` \| `other`), paid_on, note, receipt_no, receipt_token, created_at | Full CRUD. Insert returns `receipt_no` and `receipt_token`. |
| `billing_orders` | id, user_id, razorpay_order_id, razorpay_payment_id, plan_code, amount_paise, status, created_at | Read only. |
| `support_messages` | name, email, topic, message | Insert only (the contact form). |

**Pro is active** when `plan == "pro"` and either `plan_expires_at` is null or it is in the future.

### Error mapping

| Error from Supabase | Show |
| --- | --- |
| Message contains `FREE_LIMIT` | `err_free_limit` |
| Check violation on `upi_id` | `err_upi` |
| Check violation on `phone` | `err_phone` |

### Billing

Do **not** verify payments in the app. The flow:

1. Call `POST https://mahina-murex.vercel.app/api/billing/order` with body `{ "plan": "pro_monthly" | "pro_yearly" }`. Send the header `Authorization: Bearer <supabase access_token>`.
2. Open Razorpay Checkout using the returned `order_id`.
3. Send the success payload to `POST /api/billing/verify`.
4. Refresh the profile.

## Accessibility checklist

- Every icon-only button has a `contentDescription`.
- Status is never shown by colour alone: chips always carry the text Paid, Due or Upcoming.
- Text scales up to 200% without clipping; stat cards wrap instead of truncating amounts.
- The PAID stamp animation honours the system "Remove animations" setting.
- TalkBack reads money as "1,500 rupees", not "rupee sign 1,500"; set `contentDescription` on amount Text.
