# Rezlv — System Requirements Specification (SRS)

Status: living document. Governs implementation. Read `02-GUARDRAILS.md`
first — this doc specifies *what* to build, guardrails specify *what's not
allowed* while building it.

## 0. Product Summary

Rezlv is an **agentic exception-resolution system** for Shopify e-commerce
brands. Core loop:

```
Shopify order/fulfillment event or carrier tracking update
   → Exception detected (delay, damage, loss, refusal, etc.)
   → Agent classifies severity + exception type
   → Agent sends SMS to end customer with a resolution portal link
   → Customer self-resolves via portal (or agent auto-resolves within
     merchant-configured autonomy limits)
   → Resolution executed: Shopify-side actions (refund, reship) are agent-
     triggered directly via Shopify's API; carrier-side corrections
     (address correction, redelivery instructions) are assembled by the
     agent into a ready-to-submit packet for the MERCHANT to submit via
     their own carrier portal login — see the correction below, this is
     NOT a system-to-system carrier write-back for any MVP carrier
   → Everything logged for merchant + Rezlv admin visibility
```

**Correction 2026-07-15 (`16-CARRIER-POLICIES.md` §5, `02-GUARDRAILS.md`
§2):** exhaustive research confirmed none of Rezlv's 3 MVP carriers
(Canada Post, Intelcom, UPS Canada) expose any API for redirecting/
correcting a parcel already in transit — Canada Post's own Package
Redirection is portal-only with no developer API at all, UPS Delivery
Intercept is US/Puerto-Rico-only, and Intelcom's full API suite has no
correction endpoint. The "written back to carrier automatically" framing
used elsewhere in earlier versions of these docs is **not achievable as
built** — the real MVP mechanism is merchant-assisted submission (agent
prepares, merchant clicks submit). Shopify-side actions (refund, reship,
inventory) remain genuinely automatable via Shopify's own API and are
unaffected by this correction.

MVP launch target: 2026-08-01. First 10 paying merchants, $5k MRR, >60%
automated resolution rate, NPS >40 (source: Rezlv OKRs).

## 1. Actors & Roles

| Role | Surface | Auth |
|---|---|---|
| **Merchant admin/staff** | `app/dashboard/*` | Supabase Auth, scoped to their merchant tenant via RLS |
| **End customer** | Public resolution portal (`app/portal/[token]` or similar — no account) | Signed, single-use/short-lived token in the SMS link, not a full account |
| **Rezlv internal staff (Moses + future ops)** | `app/admin/*` | Supabase Auth + separate elevated role, NOT the same table/flag as merchant roles (Guardrails §9) |
| **Resolution agent** | Server-side only, no UI of its own | Runs with service-role-equivalent DB access but its *actions* are policy-gated by autonomy tiers (Guardrails §2), fully logged |

## 2. Database (Supabase/Postgres) — designed for multi-tenant scale

### 2.1 Core design principles

- **Multi-tenant from day one.** Every merchant-owned table has a
  `merchant_id` column and **Row-Level Security (RLS) enabled** — a
  merchant must never be able to query another merchant's rows even via a
  bug in application code. RLS is the backstop, not the only control.
- **UUID primary keys** (`gen_random_uuid()`), not sequential integers —
  avoids leaking row counts/growth rate externally (e.g. in portal URLs)
  and simplifies future sharding if needed.
- **Append-only where it matters:** agent action logs, audit logs, and
  build logs are insert-only tables (no UPDATE/DELETE policy) — this is a
  compliance and trust requirement (Guardrails §2, §7), not just a
  convenience.
- **Soft-delete for merchant-facing entities** (`deleted_at` timestamp),
  hard-delete only via the explicit PII-deletion function required by
  Guardrails §3 (GDPR/CCPA right-to-deletion) — and even then, audit logs
  referencing the deleted entity are retained with PII fields nulled, not
  the whole row destroyed (preserves financial/audit integrity).
- **Timestamps in UTC**, `created_at`/`updated_at` on every table via
  trigger, not app-code discipline alone.

### 2.2 Core tables (initial schema — expand via migrations, never hand-edit prod schema)

```
merchants
  id uuid pk
  name text
  shopify_domain text unique
  shopify_access_token text  -- encrypted at rest; consider Supabase Vault
  plan text                  -- billing plan tier
  stripe_customer_id text
  autonomy_config jsonb      -- per-exception-type Tier 2/3 auto-approval limits (Guardrails §2)
  kyc_status text            -- 'pending' | 'approved' | 'rejected' | 'suspended'
  status text                -- 'active' | 'paused' | 'suspended' -- kill-switch target
  created_at, updated_at, deleted_at

merchant_users
  id uuid pk
  merchant_id uuid fk -> merchants
  auth_user_id uuid fk -> auth.users (Supabase Auth)
  role text            -- 'owner' | 'staff'
  created_at, updated_at

admin_users
  id uuid pk
  auth_user_id uuid fk -> auth.users
  role text             -- 'super_admin' | 'ops' | 'support' -- SEPARATE from merchant_users, never overlapping table/flag
  created_at

orders
  id uuid pk
  merchant_id uuid fk
  shopify_order_id text
  customer_name text            -- PII, see 02-GUARDRAILS §3
  customer_email text           -- PII
  customer_phone text           -- PII
  shipping_address jsonb        -- PII
  order_value_cents integer
  currency text
  created_at, updated_at

shipments
  id uuid pk
  order_id uuid fk
  merchant_id uuid fk            -- denormalized for RLS simplicity + query perf
  carrier text
  tracking_number text
  status text                    -- normalized carrier status
  last_tracking_event jsonb
  created_at, updated_at

exceptions
  id uuid pk
  merchant_id uuid fk
  order_id uuid fk
  shipment_id uuid fk nullable
  type text                      -- see 03-EXCEPTIONS-TAXONOMY.md (8 primary categories as of 2026-07-15 §1.6-1.8 addition + cross-cutting §2), enum-like via check constraint
  severity text                  -- 1-5 per Guardrails §2 severity model (borrowed framework, e-commerce-adapted)
  status text                    -- 'detected' | 'notified' | 'awaiting_customer' | 'resolved' | 'escalated' | 'closed_unresolved'
  detected_at timestamptz
  resolved_at timestamptz nullable
  resolution_type text nullable  -- 'reship' | 'refund' | 'address_correction' | 'credit' | 'manual' | ...
  autonomy_tier_used text        -- Tier 0-4, whichever tier the actual resolution action fell under
  created_at, updated_at

agent_actions                     -- APPEND-ONLY, this is the audit trail (Guardrails §2, §7)
  id uuid pk
  exception_id uuid fk
  merchant_id uuid fk
  action_type text
  tier text                       -- Tier 0-4
  inputs jsonb                    -- what the agent based its decision on
  outcome text
  requires_approval boolean
  approved_by uuid nullable       -- admin_users.id or merchant_users.id if human-approved
  approved_at timestamptz nullable
  created_at timestamptz          -- no updated_at — this table is immutable

portal_sessions
  id uuid pk
  exception_id uuid fk
  token_hash text                 -- store a HASH of the token, not the raw token (defense in depth)
  expires_at timestamptz
  used_at timestamptz nullable
  created_at

notifications                     -- SMS/email send log
  id uuid pk
  exception_id uuid fk nullable
  merchant_id uuid fk
  channel text                    -- 'sms' | 'email'
  to_address text                 -- PII (phone/email) — see retention policy
  status text                     -- 'queued' | 'sent' | 'delivered' | 'failed' | 'opted_out'
  provider_message_id text
  created_at

billing_events                    -- Stripe webhook mirror, append-only
  id uuid pk
  merchant_id uuid fk
  stripe_event_id text unique     -- idempotency guard (Guardrails §5)
  type text
  payload jsonb
  processed_at timestamptz nullable
  created_at

audit_log                         -- general admin/system audit trail, append-only
  id uuid pk
  actor_type text                 -- 'agent' | 'admin' | 'merchant_user' | 'system'
  actor_id uuid nullable
  action text
  target_table text
  target_id uuid
  metadata jsonb
  created_at
```

### 2.3 RLS policy pattern (every merchant-scoped table)

```sql
-- pattern, adapt per table
create policy "merchant_isolation" on exceptions
  for all
  using (merchant_id = (select merchant_id from merchant_users where auth_user_id = auth.uid()));
```

Admin dashboard access uses a **separate service-role-backed API layer**
(server-side only, never client-side Supabase calls with elevated
privileges) that checks `admin_users` membership explicitly — RLS alone
should not be the only gate for admin access given the higher blast radius.

### 2.4 Indexing/scale notes

- Index `merchant_id` on every merchant-scoped table (RLS performance).
- Index `(merchant_id, status)` on `exceptions` — the dashboard's primary
  query pattern.
- Index `shopify_order_id` and `tracking_number` for webhook lookup speed.
- Partition `agent_actions` and `notifications` by month once volume
  justifies it (not needed at MVP scale, but design the table so a future
  `created_at`-range partition migration is straightforward — don't use
  patterns that make partitioning hard later, e.g. avoid cross-partition
  foreign key assumptions).

## 3. API Surface

Implemented as Next.js Route Handlers (`app/api/*/route.ts`). All routes
below are illustrative names — confirm exact paths in code, keep this
section in sync.

### 3.1 Inbound webhooks (signature-verified, Guardrails §4)

- `POST /api/webhooks/shopify` — order created, fulfillment updated, etc.
  Verify `X-Shopify-Hmac-Sha256` before processing.
- `POST /api/webhooks/stripe` — billing events. Verify Stripe signature,
  process idempotently keyed on `stripe_event_id`.
- `POST /api/webhooks/carrier` (EasyPost or per-carrier) — tracking event
  updates. Verify provider signature.
- `POST /api/webhooks/sms-inbound` — customer replies (e.g. STOP, or
  portal-adjacent replies) — Twilio inbound webhook, verify Twilio
  signature.

### 3.2 Merchant-facing (authenticated, RLS-scoped)

- `GET /api/exceptions` — list, filterable by status/type
- `GET /api/exceptions/:id` — detail incl. agent_actions history
- `POST /api/exceptions/:id/approve` — human approval for a Tier 3 action
  awaiting review
- `PATCH /api/merchant/autonomy-config` — merchant sets their own Tier 2/3
  auto-approval limits (Guardrails §2)
- `GET /api/merchant/settings`, `PATCH /api/merchant/settings`

### 3.3 Customer portal (token-authenticated, no account)

- `GET /api/portal/:token` — validate token (hash lookup, expiry, single-use
  check), return exception context
- `POST /api/portal/:token/resolve` — customer selects a resolution option;
  server validates it's within the exception's allowed options before
  acting

### 3.4 Admin dashboard (separate elevated auth)

- `GET /api/admin/merchants` — list + KYC status
- `PATCH /api/admin/merchants/:id/kyc` — approve/reject
- `POST /api/admin/merchants/:id/pause` — per-merchant kill switch
- `POST /api/admin/system/pause` — system-wide kill switch (Tier 4, admin-
  only, confirmation-gated per Guardrails §2)
- `GET /api/admin/agent-actions` — cross-merchant agent action audit view,
  filterable
- `GET /api/admin/audit-log`

### 3.5 API conventions

- Every mutating endpoint that isn't naturally idempotent (webhooks
  excluded, already covered) accepts/checks an `Idempotency-Key` header
  where retries are plausible (payment-adjacent, Guardrails §5).
- Standard error shape: `{ error: { code, message } }`, never leak stack
  traces or internal identifiers to client responses.
- Rate limiting on public/token-based endpoints (`/api/portal/*`,
  webhooks) to prevent abuse — Vercel Edge Config or a simple Supabase-
  backed counter is sufficient at MVP scale; document actual mechanism
  chosen in `05-LIVE-BUILD-LOG.md` when implemented.

## 4. Security

### 4.1 Authentication

- **Merchant users:** Supabase Auth (email/password or magic link — prefer
  magic link/OTP to avoid Rezlv handling password storage/reset flows at
  all). Optionally add Google OAuth sign-in later — not MVP-blocking.
- **Admin users:** Supabase Auth with mandatory **2FA/TOTP** (higher blast
  radius than merchant access — treat as a hard requirement before launch,
  not deferred). Separate `admin_users` table (§2.2) — never a boolean flag
  shared with merchant accounts.
- **Customer portal:** no account. Signed, single-use, time-limited tokens
  delivered via SMS. Token itself stored **hashed** in DB (§2.2
  `portal_sessions.token_hash`) so a DB leak doesn't directly expose valid
  session tokens.

### 4.2 Authorization

- RLS as the DB-layer backstop (§2.3).
- Application-layer checks on every API route as the primary gate (never
  rely on RLS alone for admin routes, per §2.3).
- Principle of least privilege for service-role key usage — only server-
  side code paths that genuinely need cross-tenant access (webhooks,
  admin APIs, the resolution agent) use it; everything else uses the
  scoped anon key + user session.

### 4.3 OAuth (Shopify)

- Standard Shopify OAuth flow for merchant app installation: redirect to
  Shopify authorize URL with requested scopes (minimum necessary —
  `read_orders`, `read_fulfillments`, `write_fulfillments`; add
  `read_customers`/others only if a feature genuinely needs it), verify
  the `state` parameter (CSRF protection), exchange code for access token
  server-side only, store the resulting access token encrypted (Supabase
  Vault or column-level encryption — never plaintext in `merchants` table
  even though listed plainly in §2.2's illustrative schema — mark this a
  build-time TODO to encrypt before real merchant tokens are stored).
- Verify Shopify's HMAC on every webhook AND on the OAuth callback query
  string itself (Shopify signs both) before trusting either.

### 4.4 Secrets

Per Guardrails §4 — no repetition here beyond: production secrets in
Vercel env vars / Supabase Vault, `.env.local` and any credential JSON
gitignored, verified before every commit touching config.

### 4.5 Transport & storage

- HTTPS everywhere (Vercel default — verify no mixed content once carrier/
  SMS provider webhooks are wired, some legacy providers default to HTTP
  callback URLs).
- PII columns (§2.2) encrypted at rest where Supabase/Postgres native
  encryption-at-rest doesn't already cover the compliance bar needed —
  column-level (`pgcrypto`) for the most sensitive fields (full shipping
  address, phone) if a deeper audit later requires it; document the actual
  decision in `05-LIVE-BUILD-LOG.md` when implemented, since this is a
  build-time judgment call informed by real legal review (Guardrails §6).

## 5. Agent Autonomy Integration (implementation of Guardrails §2)

- Every code path that lets the resolution agent take an action must call
  a single shared `checkAutonomyTier(merchantId, actionType, context)`
  function (or equivalent) that consults `merchants.autonomy_config` and
  returns whether the action can proceed autonomously or must queue for
  human approval. **Do not scatter tier-checking logic across multiple
  call sites** — one source of truth, testable in isolation
  (`09-TESTING-STRATEGY.md`).
- Every agent action, regardless of outcome, writes an `agent_actions` row
  before/immediately after execution — this is not optional logging, it's
  the audit trail the admin dashboard depends on.
- New merchants default to the most conservative `autonomy_config`
  (Guardrails §2) — enforce this at merchant-creation time in code, not
  just as a docs convention.

## 6. Admin Dashboard (required module — Moses's explicit requirement)

Separate route namespace `app/admin/*`, separate auth (§4.1), separate
layout — never share a layout/nav component with the merchant dashboard in
a way that risks a routing mistake exposing admin routes to merchant users.

Minimum MVP scope:

1. **Merchant KYC/onboarding review** — list new merchant signups, view
   Shopify store info + business details submitted, approve/reject/request-
   more-info, sets `merchants.kyc_status`.
2. **Agent action oversight** — cross-merchant feed of `agent_actions`,
   filterable by merchant/tier/type/date, searchable by order/exception ID.
   This is the primary "see where a problem came from" surface (ties to
   §7 Observability).
3. **Kill switch** — system-wide pause (stops all agent autonomous actions
   platform-wide, Tier 4) and per-merchant pause (`merchants.status =
   'paused'` — resolution agent checks this before acting on that
   merchant's exceptions). Both require a confirmation step in the UI, not
   a single click.
4. **Audit log viewer** — `audit_log` table, filterable, exportable (CSV)
   for compliance/dispute needs.
5. **Billing/payment status visibility** — per-merchant Stripe subscription
   status, MRR rollup (feeds the OKR dashboard Moses already tracks
   elsewhere).

Defer to post-MVP unless time allows: role management UI for admin_users
(manage via direct DB access/Supabase dashboard for the first few admins),
detailed analytics/reporting beyond the OKR basics.

## 7. Observability

- **Structured logging**, not bare `console.log` — every log line for a
  request/job should carry `merchant_id`, `exception_id` (if applicable),
  and a request/trace ID, so a support question ("what happened to order
  #1234") is answerable by filtering logs, not grepping blind.
- **Sentry** for error tracking (see `08-ENVIRONMENT-SETUP.md`) — attach
  `merchant_id`/`exception_id` as Sentry tags/context on every capture
  where available, so an error is immediately attributable.
- **`agent_actions` + `audit_log` tables** (§2.2) are the durable, queryable
  record — logs/Sentry are for debugging *why* something happened in the
  moment, the DB tables are the permanent "what happened" record surfaced
  in the admin dashboard.
- Alerting: at minimum, alert (email/Slack webhook — pick whichever's free
  and already available; Moses doesn't currently have Slack connected, so
  email via Resend is the default until that changes) on: webhook
  signature verification failures repeated >N times (possible attack),
  SMS delivery failure rate spike, any Tier 3+ agent action awaiting
  approval for >X hours unactioned, Stripe webhook processing failures.

## 8. Notifications (SMS + Email)

- **SMS** (Twilio) — exception detected → initial notify, resolution
  confirmation, STOP/opt-out handling mandatory (Guardrails §6). Every
  send logged in `notifications` (§2.2).
- **Email** (Resend) — merchant-facing: onboarding/welcome, weekly
  summary digest (nice-to-have, not MVP-blocking), billing receipts
  (Stripe can send these natively — evaluate whether Rezlv needs to
  duplicate or just rely on Stripe's). Admin-facing: alert emails per §7.
- Both channels respect opt-out/unsubscribe state before sending —
  `notifications` table (or a small `opt_outs` table) tracks this per
  phone/email, checked before every send.

## 9. Testing Requirements

Full detail in `09-TESTING-STRATEGY.md` — this section states the SRS-level
requirement: no feature described in this SRS ships without the test
coverage specified in Guardrails §8. Payment logic, webhook signature
verification, and autonomy-tier gating are the three areas with zero
tolerance for untested edge/failure paths.

## 10. Data Retention

- **Exception + order data:** retained for the life of the merchant
  relationship + a defined post-offboarding window (recommend 90 days,
  confirm with Moses/legal) to support disputes.
- **SMS/portal communication content:** retained only as long as needed
  for dispute resolution — recommend 12 months, then purge content while
  retaining the metadata record (that a message was sent, when, status)
  for audit purposes. Confirm exact windows during legal review
  (Guardrails §6).
- **`agent_actions`/`audit_log`:** retained indefinitely (or per whatever
  legal review recommends) — these are the compliance backbone and storage
  cost is low relative to their value in a dispute.
- Right-to-deletion (Guardrails §3) is implemented as a documented,
  tested DB function (e.g. `delete_customer_pii(order_id)`) that nulls PII
  columns while preserving non-PII audit rows — never an ad-hoc manual
  query.

## 11. Non-Functional Requirements

- **Availability target:** best-effort at MVP scale (no formal SLA to
  merchants yet) but the Supabase free-tier auto-pause risk (§
  `08-ENVIRONMENT-SETUP.md`) must be resolved (upgrade to Pro) before the
  first paying customer — this is a hard launch blocker.
- **Performance:** webhook processing should acknowledge receipt (2xx)
  within the provider's timeout window (Shopify: 5s) — do heavy
  processing (agent classification, SMS send) asynchronously after
  acknowledging receipt, not inline in the webhook handler, to avoid
  webhook redelivery storms.
- **Scalability posture:** schema (§2) is designed multi-tenant and
  index-conscious from day one; no architectural changes anticipated
  needed between 10 and ~500 merchants. Re-evaluate (queue infrastructure,
  read replicas) beyond that.

## 12. Open Questions (track here until resolved, then remove)

- Exact SMS provider fallback if Twilio 10DLC review is delayed past
  launch-critical timing — flag to Moses if this becomes a real risk.
- Whether Rezlv needs its own Google Cloud project at all for MVP (no
  confirmed feature requires it yet — see `08-ENVIRONMENT-SETUP.md` §9).
- Final data retention windows — pending legal review (Guardrails §6).
