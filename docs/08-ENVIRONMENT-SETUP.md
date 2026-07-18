# Rezlv — Environment & Account Setup

Every external account/service the MVP needs, why, free-tier status, and
where its secrets live. **Values never go in this doc** — only which env var
name holds them and where (local `.env.local`, Vercel env, Supabase Vault).

Moses is budget-constrained — every service below is chosen because it has
a workable free or pay-as-you-go tier for MVP scale (first 10 customers).
Flag to Moses before signing up for anything not marked free-tier-viable.

Status legend: 🟢 exists · 🟡 needs creating · 🔴 needs creating + Moses's
identity/payment method (agents cannot self-serve).

---

## 1. Hosting & Core Infra

| Service | Purpose | Free tier? | Status | Env var(s) |
|---|---|---|---|---|
| **Vercel** | Hosting Next.js app, preview deploys, env var storage | Yes — Hobby tier free, fine for MVP | 🟢 already in use (`@vercel/analytics` present) | N/A (platform-managed) |
| **Supabase** | Postgres DB, Auth, Storage, Realtime | Yes — free tier: 500MB DB, 50k MAU, pauses after 1 week inactivity | 🟢 fully wired 2026-07-15 — project switched to Rezlv's own project (`vrkwlabyhnqpjpbahvrn`; the prior `hjfjabpxrhjsdcegoaqb` was found to actually be the unrelated "Outreach_Engine" project). `SUPABASE_SERVICE_ROLE_KEY` (new-format `sb_secret_...`) added. Migrations `0001_init_schema.sql`/`0002_rls.sql` applied directly via `pg` against the project's Postgres connection string (not via the Supabase MCP tool — this project isn't under that tool's linked account) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_PASSWORD` |
| **GitHub** | Source control, CI (Actions) | Yes — free for private repos + Actions minutes | 🟢 (repo has `.git`) | N/A |

**Note on Supabase free tier:** the auto-pause after 1 week of inactivity
will break production if traffic is intermittent pre-launch — verify this
is upgraded to a paid tier ($25/mo Pro) before onboarding the first real
paying customer, since a paused DB = a broken exception-resolution flow.
Free tier is fine for dev/build phase only.

## 2. Payments (Rezlv's own SaaS billing)

| Service | Purpose | Free tier? | Status | Env var(s) |
|---|---|---|---|---|
| **Stripe** | Merchant subscription billing to Rezlv | Yes — no monthly fee, pay-per-transaction only (2.9% + 30¢ US) | 🟢 test-mode keys added 2026-07-15 | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` (`NEXT_PUBLIC_`), `STRIPE_WEBHOOK_SECRET` (still needed — generated when webhook endpoint is registered) |

Use **Stripe Test Mode** during the entire build phase — test-mode keys
cost nothing and let both agents build/test the full billing flow before
Moses needs to complete live-mode business verification. Switch to live
keys only at actual launch.

## 3. SMS (core to the product — exception → SMS flow)

| Service | Purpose | Free tier? | Status | Env var(s) |
|---|---|---|---|---|
| **Twilio** | Outbound/inbound SMS to end customers | Trial account free with credit (~$15), but trial numbers can only text verified numbers — need a paid number ($1-2/mo) + usage (~$0.0079/SMS in US) before real customers can be texted | 🟡 account SID + auth token added 2026-07-15; still needs a provisioned number or Messaging Service SID before any SMS can send, and 10DLC registration hasn't started | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID` or `TWILIO_PHONE_NUMBER` (still needed) |

**Alternative to evaluate if Twilio cost is a concern at scale:** Vonage,
Plivo, or AWS SNS SMS — similar pricing, note in
`05-LIVE-BUILD-LOG.md` if switched. Twilio is the default recommendation
for MVP because of documentation quality and STOP/opt-out handling being
built-in (compliance requirement, Guardrails §6).

**10DLC registration (US):** Twilio (and most US SMS providers) require
A2P 10DLC brand + campaign registration for anything beyond trial volume —
this has a small one-time+monthly fee and a review process that can take
days. Start this early, it's a launch-timeline risk, not just a cost line.

## 4. Shopify Integration

| Service | Purpose | Free tier? | Status | Env var(s) |
|---|---|---|---|---|
| **Shopify Partner account + Custom/Public App** | Receive order/fulfillment webhooks, read order data, trigger refunds via Shopify's API | Free to create a Partner account and a development store for testing | 🟡 API key/secret added 2026-07-15; still needs the actual Partner dev store created and a webhook subscription configured (which produces `SHOPIFY_WEBHOOK_SECRET`) | `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_WEBHOOK_SECRET` (still needed), per-merchant `SHOPIFY_ACCESS_TOKEN` (stored per-merchant in DB, not a single env var — see 01-SRS.md) |

Use a **Shopify development store** (free, unlimited via Partner account)
for all build/test work — never test against a real merchant's live store
until the integration is verified end-to-end.

## 5. Carrier APIs (for exception detection + write-back)

**MVP carrier scope, confirmed 2026-07-15, EXPANDED same day: Canadian
carriers only, via BYOD/BYOCA — 7 carriers total.** Originally scoped to
3 (Canada Post, Intelcom, UPS Canada); Moses then directed "any carrier
feasible for us, restricted to Canada" — expanded to **Canada Post, UPS
Canada, Intelcom, Purolator, Canpar Express, Loomis Express, FedEx
Canada**, each confirmed to have a genuine EasyPost carrier guide and
real Canadian-domestic service. DHL Express Canada (international-only,
no CA domestic service) and Amazon Logistics (closed network) were
evaluated and excluded. No USPS, no US-domestic-only carrier work. Full
per-carrier detail in `16-CARRIER-POLICIES.md`; onboarding priority order
and logo-asset gaps in `15-FRONTEND-SPEC.md` §3.

| Service | Purpose | Free tier? | Status | Env var(s) |
|---|---|---|---|---|
| **EasyPost** (aggregator, Parent/Child multi-tenant model — see below) | Single API surface for all 7 MVP carriers' tracking + BYOD/BYOCA carrier-account connection, isolated per merchant via Child Users | Developer Plan is $0 to start; BYOCA is a mandatory **$20/mo platform fee** (updated pricing structure effective 2026-02-23) + **$0.02 per standalone non-USPS tracker** (see cost note below) | 🔴 still needs signup — not yet created | `EASYPOST_API_KEY` (Parent account key only; Child keys are generated per-merchant at runtime and stored in Supabase, never as env vars) |
| Canada Post Developer Program (direct, only if EasyPost gap found) | Direct write-back if EasyPost's Canada Post coverage doesn't support a needed action | Free developer tier | 🟡 defer unless a specific gap appears | per-carrier |
| Intelcom / UPS Canada direct APIs (same caveat) | Same as above | Varies | 🟡 defer | per-carrier |

### 5a. EasyPost Parent/Child multi-tenant architecture (digested 2026-07-15)

Rezlv orchestrates for many Shopify merchants simultaneously. Routing every
merchant's carrier traffic through one flat EasyPost account causes data
collision (whose tracker is this? whose carrier credentials?) — EasyPost's
**Parent/Child account structure** is the correct model, not a nice-to-have:

- **Parent User** = Rezlv's own platform-level EasyPost account (the
  `EASYPOST_API_KEY` above).
- **Child User** = one auto-provisioned sub-account per merchant, created
  via an authenticated `POST /users` call when the merchant installs the
  Shopify app. Each Child User gets its own isolated API key.
- **Billing rolls up to the Parent.** Child Users cannot log into EasyPost
  directly and have no independent billing relationship — Rezlv (the
  Parent) is billed for every Child's usage, including the per-tracker fee
  below. This must be priced into Rezlv's own service-charge model, not
  treated as a pass-through merchants see directly.
- **BYOD/BYOCA credential flow:** the merchant enters their Canada
  Post/Intelcom/UPS Canada account details in a Rezlv-built configuration
  UI (never logs into EasyPost itself); Rezlv's backend pushes those
  credentials via API to that merchant's specific Child User. This is how
  the merchant keeps their own negotiated carrier rates without leaving
  the Rezlv dashboard.
- **Carrier auto-detection:** when creating a tracker, pass `tracking_code`
  and omit `carrier` — EasyPost detects the carrier from the code format
  itself and uses that Child's credentials to pull data. No need to know
  the carrier ahead of time from the Shopify payload.
- **Exception detection flow:** Shopify `fulfillments/create` webhook →
  Rezlv backend extracts tracking number → `POST /trackers` using the
  merchant's Child API key (**standalone tracker**, since Rezlv/the
  merchant isn't buying the label through EasyPost) → EasyPost polls the
  carrier and fires a `tracker.updated` webhook to Rezlv when status
  changes, with `status: "exception"` or `"failure"` as first-class
  values, and `previous_attributes` showing what changed (useful for
  "no scan in X days" / "missed delivery promise" trigger logic). Because
  the webhook payload carries the Child-scoped Tracker ID, Rezlv's backend
  always knows which merchant/order it belongs to without extra lookups.
- **What EasyPost does NOT do** (this is the actual Rezlv product, not
  something to expect from the aggregator): no decisioning on what
  resolution to take, no carrier claim filing/assembly, no customer-facing
  messaging, no Shopify order/refund write-back. EasyPost is the ingestion
  layer that feeds Rezlv's exception engine — plumbing, not a competitor.

**Cost note (supersedes the old $0.08/label estimate above — that was
wrong):** BYOCA is a flat **$20/mo** platform fee (not per-merchant), plus
**$0.02 per unique standalone tracker** for every non-USPS package tracked.
Because billing rolls up to the Parent, Rezlv pays this $0.02/tracker cost
directly for every shipment across every merchant — the $8/$5/$3
per-resolved-case pricing model (`04-PAYMENT-LOGIC.md` §1) must comfortably
absorb this at MVP volume; revisit if merchant volume scales into the
thousands of shipments/month range.

**Supabase mapping requirement:** a dedicated table (e.g.
`merchant_logistics`) must map each merchant's Shopify store ID to their
EasyPost Child API key. This is PII-adjacent/credential data — RLS policies
must ensure Next.js API routes only ever expose normalized tracking data to
the frontend, never the raw Child API key (Guardrails §3, §4). This table
is `rezlv-schema`'s (Stage 1) responsibility to design.

**Recommendation:** start MVP with EasyPost as the single carrier-data
aggregation + BYOD/BYOCA connection layer for all three Canadian carriers
rather than integrating each directly — this is the single biggest scope
reducer for a solo/two-agent MVP build. Direct carrier integration only if
EasyPost can't support a specific write-back action Rezlv needs for
Canada Post, Intelcom, or UPS Canada specifically.

**Setup, when ready:** signup is still pending (🔴) — ask Moses when the
schema/exceptions-engine stages reach the point of needing to actually
create the Parent account and test Child-User provisioning against a real
EasyPost sandbox.

## 6. Email

| Service | Purpose | Free tier? | Status | Env var(s) |
|---|---|---|---|---|
| **Resend** (recommended) | Transactional email — merchant onboarding, admin alerts, receipts | Yes — 3,000 emails/mo free, then cheap | 🟢 API key added 2026-07-15 | `RESEND_API_KEY` |
| **Business email** (`support@rezlv.com` or similar) | Customer-facing support address, referenced in ToS/Privacy Policy | Depends on domain registrar/Google Workspace — Google Workspace is NOT free ($6+/user/mo); consider a free forwarding alias via the domain registrar instead for MVP | 🔴 needs Moses to set up domain + email | N/A |

## 7. Domain & DNS

| Service | Purpose | Free tier? | Status |
|---|---|---|---|
| Domain registrar (Namecheap, Cloudflare Registrar, etc.) | `rezlv.com` (or whatever's registered) | Not free (~$10-15/yr) but one-time/annual, not a recurring app cost | 🔴 needs Moses — check if already owned |
| Cloudflare (optional) | DNS, basic DDoS protection, free SSL | Yes, free tier | 🟡 optional, recommended |

## 8. Observability

| Service | Purpose | Free tier? | Status | Env var(s) |
|---|---|---|---|---|
| **Sentry** | Error tracking, tied to merchant/order context | Yes — free tier: 5k errors/mo, enough for MVP | 🟢 DSN added 2026-07-15 (Next.js SDK not yet instrumented in code) | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` |
| **Vercel Analytics** | Basic web analytics | Yes — already included | 🟢 already in `package.json` | N/A |
| **Better Stack / Logtail** or **Axiom** (pick one) | Structured log aggregation (agent action logs, webhook logs) | Both have usable free tiers (Axiom: 0.5GB/mo free) | 🟡 needs signup, pick one | `LOGGING_API_KEY` (name depends on choice — record actual choice in `05-LIVE-BUILD-LOG.md`) |

## 9. Google Services (if/when needed)

Per `06-AGENT-COLLABORATION-PROTOCOL.md` §1: **Rezlv has zero existing
Google credentials** — do not reuse Moses's personal `life-project-500503`
or `outreach-engine-495718` service accounts. If a feature needs Google
integration (e.g. a merchant wants Sheets export), create a **new** GCP
project scoped only to Rezlv (e.g. `rezlv-prod`), free tier covers
low-volume Sheets/Drive API usage.

| Service | Purpose | Status | Env var(s) |
|---|---|---|---|
| New GCP project + service account (only if/when a feature needs it) | e.g. Sheets export | 🟡 not needed yet — defer until a real feature requires it | TBD |

## 10. `.env.example` — keep this file in sync

Every env var name above (never values) must be mirrored in a committed
`.env.example` at the repo root so any agent/human setting up a fresh
environment knows exactly what to fill in. Update `.env.example` in the
same commit that introduces a new env var — this is a guardrail-adjacent
hygiene rule (Guardrails §4, §9).

## 11. Setup order (recommended, cheapest/least-blocking first)

**Updated 2026-07-15 — most items below are now 🟢/🟡 (see §1-8 tables).
Remaining blockers in priority order:**

1. ~~Supabase service role key~~ — project confirmed
   (`vrkwlabyhnqpjpbahvrn`), key itself still needs pulling from dashboard
2. ~~Sentry~~ — DSN added, SDK instrumentation still pending in code
3. ~~Stripe test mode~~ — keys added
4. Shopify Partner **dev store** still needs creating (API key/secret are
   in, but no actual store/webhook exists yet)
5. **EasyPost — still not signed up, now the critical-path blocker** for
   Stage 4 (`rezlv-exceptions-engine`). See §5a for the Parent/Child
   architecture to set up once account exists.
6. ~~Resend~~ — key added
7. Twilio — account SID/token added, but still needs a provisioned
   number/Messaging Service SID; **do this once SMS-sending code is ready
   to test**; start 10DLC registration early regardless, review lag is
   real
8. Domain + business email + Cloudflare — needed before public launch, not
   before

Each item marked 🔴 above requires Moses directly (per
`06-AGENT-COLLABORATION-PROTOCOL.md` §4) — an agent's job is to prepare
exactly what's needed (e.g. "create a Shopify Partner account at
partners.shopify.com, then create a dev store and a custom app with these
scopes: `read_orders, read_fulfillments, write_fulfillments`") rather than
attempting the signup itself.
