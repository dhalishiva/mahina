# Mahina Android UI kit

Everything needed to build the native Android app for **Mahina by SlotRecover**. The app talks to the same Supabase backend as the web app at `mahina.kriosity.in`.

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
| 03 | Log in | Email and password. A text button switches to "Log in with a code": `signInWithOtp(shouldCreateUser=false)`, then `verifyOtp(type=email)`. A "Forgot password?" link. |
| 04 | Sign up | Name, email and password (min 8 characters). Then a 6–8 digit code screen: `verifyOtp(type=signup)`; resend with `resend(type=signup)` after a 60 s cooldown. Use `autofill` hints for one-time codes. |
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
| 15 | Plan | Free usage meter, **Pro monthly autopay** (₹149/month, highlighted) and Pro yearly (₹1,490 one-time). When autopay is on, show "Autopay is on" and a "Turn off autopay" action with a confirm step. See "Billing" below. The reference PNG predates autopay; follow the web app's Plan page for layout. |
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
  - the pay link: `https://mahina.kriosity.in/p/{members.pay_code}`.
- **Phone numbers for WhatsApp:** strip non-digits. If 10 digits, prefix `91`. If 12 digits starting with `91`, keep as is. If 11 digits starting with `0`, replace the `0` with `91`.

### WhatsApp intent

Open `https://wa.me/{number}?text={urlencoded}` with `Intent.ACTION_VIEW`. This works for WhatsApp and WhatsApp Business without a package name. If there's no number, use `https://wa.me/?text=...`. Never send messages automatically; the user always presses send in WhatsApp.

### Receipt

After recording a payment, send the `tpl_receipt` text with the link `https://mahina.kriosity.in/r/{payments.receipt_code}`.

## Backend contract (Supabase)

### Connection

- **Project URL:** `https://koenogmiaawffiwfmmfh.supabase.co`, region ap-south-1.
- **Key:** use the **publishable** key only. Get it from Supabase → Project Settings → API (it is the same key as `NEXT_PUBLIC_SUPABASE_ANON_KEY` on Vercel). Never ship a service-role key in the app.

### Auth

- Email and password, email code login, and password reset are all in use. Every email carries a **6–8 digit code** (no links), so no deep-link setup is needed.
- Password reset: `resetPasswordForEmail(email)`, then `verifyOtp(type=recovery)`, then `updateUser(password)`.
- Every send is limited to once per 60 s per email, so show a resend countdown.

### Tables

Row-level security limits every query to the signed-in user's own rows.

| Table | Columns | Access from the app |
| --- | --- | --- |
| `profiles` | id, email, full_name, business_name, business_type, phone, upi_id, upi_name, reminder_lang (`en` \| `hi` \| `hinglish`), plan (`free` \| `pro`), plan_expires_at, subscription_id, subscription_status, is_admin, created_at | Read. Update only full_name, business_name, business_type, phone, upi_id, upi_name, reminder_lang. |
| `members` | id, owner_id, name, phone, monthly_fee, due_day (1–28), batch, start_month (date, 1st of month), active, notes, pay_token, created_at | Full CRUD. `owner_id` defaults to `auth.uid()`. Inserting beyond 2 on free raises `FREE_LIMIT`. |
| `payments` | id, owner_id, member_id, period (date, 1st of month), amount, method (`upi` \| `cash` \| `bank` \| `other`), paid_on, note, receipt_no, receipt_token, receipt_code, created_at | Full CRUD. Insert returns `receipt_no` and `receipt_code` (8-character short code used in receipt links). |
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

Do **not** verify payments in the app. Every call below sends `Authorization: Bearer <supabase access_token>`. Free plan = 2 members.

**Pro monthly is autopay (Razorpay Subscriptions, ₹149/month).**

1. `POST https://mahina.kriosity.in/api/billing/subscribe` (no body). Returns `{ subscription_id }`. A `409` means autopay is already on.
2. Open Razorpay Checkout with `subscription_id` (not `order_id` or `amount`). The user approves a UPI autopay mandate or a card.
3. Send the success payload `{ razorpay_payment_id, razorpay_subscription_id, razorpay_signature }` to `POST /api/billing/verify`.
4. Refresh the profile.

**Autopay is on** when `subscription_status` is `active`, `authenticated` or `pending`. To turn it off: `POST /api/billing/cancel` (no body), then refresh. Pro stays active until `plan_expires_at`. Monthly renewals are handled by the server webhook; the app does nothing.

**Pro yearly is a one-time payment (₹1,490).**

1. `POST /api/billing/order` with body `{ "plan": "pro_yearly" }`. Returns `{ id, amount }`.
2. Open Razorpay Checkout with `order_id` and `amount`.
3. Send `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` to `POST /api/billing/verify`.
4. Refresh the profile.

## Accessibility checklist

- Every icon-only button has a `contentDescription`.
- Status is never shown by colour alone: chips always carry the text Paid, Due or Upcoming.
- Text scales up to 200% without clipping; stat cards wrap instead of truncating amounts.
- The PAID stamp animation honours the system "Remove animations" setting.
- TalkBack reads money as "1,500 rupees", not "rupee sign 1,500"; set `contentDescription` on amount Text.

## Bot protection (Cloudflare Turnstile)

When CAPTCHA protection is switched on in Supabase (Auth → Attack Protection), **every** sign-up, sign-in, email-code and password-reset call must include `captchaToken`. This applies to the Android app as well as the web app. To get a token on Android:

1. Load a small HTML page in a `WebView` that renders Turnstile with the same site key (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` on Vercel).
2. Pass the token back through a `JavascriptInterface`.
3. Send it in the auth call's `captchaToken` option. Tokens are single-use and expire after 5 minutes, so fetch a fresh one for each call.

`verifyOtp` doesn't need a token.
