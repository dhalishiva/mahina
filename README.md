# Mahina by SlotRecover

Monthly fee collection for India's small teachers, trainers and service providers: a fee register that shows who owes what, sends WhatsApp reminders with a UPI payment link, and issues receipts.

## Stack

- Next.js 16 (App Router) on Vercel, Tailwind CSS 4
- Supabase (Postgres + Auth), project `koenogmiaawffiwfmmfh`, region ap-south-1 (Mumbai)
- Razorpay for Pro: ₹149/month autopay (Razorpay Subscriptions) or ₹1,490/year one-time
- Vercel Web Analytics and Speed Insights

## Routes

| Path | What |
| --- | --- |
| `/` | Marketing homepage |
| `/pricing`, `/help`, `/contact` | Product pages |
| `/for/[slug]` | 10 SEO landing pages by business type |
| `/tools/fee-reminder-message` | Free reminder generator (SEO) |
| `/guides/how-to-ask-for-fees-politely` | Guide article (SEO) |
| `/privacy`, `/terms`, `/refund-policy`, `/shipping-policy` | Legal (Razorpay-ready) |
| `/login`, `/signup`, `/reset-password` | Auth |
| `/app` | Dashboard, members, member detail, settings, billing |
| `/admin` | Admin dashboard (server-checked `is_admin`) |
| `/p/[token]` | Public UPI payment page for a member |
| `/r/[token]` | Public receipt |

## Environment variables

See `.env.example`. On Vercel set:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production domain, no trailing slash)
- `MAHINA_SERVER_SECRET` — must match `private.settings.server_secret` in Supabase
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (optional until you enable payments)

## Security model

- Row-level security on every table; each account can only read and write its own rows.
- Users can update only safe profile columns (column-level grants); plan and admin flags are not writable by users.
- Plan activation only through `activate_subscription`, which requires the server secret and a Razorpay order verified server-side (signature + order fetch).
- Admin RPCs check `is_admin()` inside the database; `/admin` is also gated server-side.
- Public pay and receipt pages use unguessable UUID tokens and return minimal fields through security-definer RPCs.
- Strict security headers (CSP, HSTS, frame-ancestors none, etc.) in `next.config.ts`.

## Screenshots

Marketing screenshots in `public/screens` are captured from the real app views with sample data at `/dev-screens/[name]` (disabled in production).
