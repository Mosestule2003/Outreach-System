# Rezlv Build Guardrails — CONSULT BEFORE ANY CODE CHANGE

**This document must be read before writing, editing, or generating any code,
schema, or infrastructure config for Rezlv.** If a proposed change conflicts
with anything here, STOP and raise it to Moses before proceeding — do not
silently work around a guardrail.

Applies equally to Claude and Gemini (see
[06-AGENT-COLLABORATION-PROTOCOL.md](06-AGENT-COLLABORATION-PROTOCOL.md)).

---

## 1. Go/No-Go Gate — checklist before ANY new feature is built

A feature may not be started until all of these are true:

- [ ] It's traceable to the SRS (`01-SRS.md`) or an explicit Moses instruction
- [ ] Data it touches is classified (see §3 PII/data classification below)
- [ ] If it involves money movement (charge, refund, credit) → §5 Payment
      guardrails are satisfied and it's in `04-PAYMENT-LOGIC.md`
- [ ] If it involves the agent taking an autonomous action → §2 Agent
      Autonomy boundaries are satisfied
- [ ] Test coverage plan exists (see `09-TESTING-STRATEGY.md`) — no feature
      ships without at least one automated test exercising it
- [ ] Logged in `05-LIVE-BUILD-LOG.md` when complete

If any box can't be checked, the feature is **not ready to build** — surface
the gap to Moses instead of guessing.

---

## 2. Agent Autonomy Boundaries (core to this being an agentic system)

Rezlv's exception-resolution agent takes real-world actions on behalf of
merchants and their customers. Every agent capability must be classified
into exactly one tier:

| Tier | Definition | Examples | Approval needed |
|---|---|---|---|
| **Tier 0 — Read-only** | Agent observes/classifies, no external effect | Detecting an exception, classifying severity | None |
| **Tier 1 — Reversible, no money, no PII exposure** | Agent acts but the action can be undone or is low-blast-radius | Sending a status-update SMS, opening a portal session, generating a resolution link | None — but must be logged with full context |
| **Tier 2 — Reversible but customer/merchant-facing commitment** | Agent makes a promise or takes an action a human would need to honor | Offering a reshipment, confirming a new delivery address, **assembling a ready-to-submit carrier correction packet** (see correction 2026-07-15 below) | Auto-allowed **only within merchant-configured policy limits** (see below); logged; merchant can review/reverse within a grace window |
| **Tier 3 — Irreversible or involves money** | Refunds, credits, cancellations, chargebacks response | **Never fully autonomous in MVP.** Requires either (a) merchant-configured auto-approval rule with a hard dollar cap, explicitly opted into per merchant, or (b) human approval via the admin dashboard or merchant dashboard | See §5 |
| **Tier 4 — Irrecoverable / high blast radius** | Deleting data, disabling a merchant's integration, mass actions across many customers at once | Never agent-initiated. Human-only, admin-dashboard-gated, with confirmation step | Admin only |

**Rule:** when in doubt about which tier an action belongs to, classify it
one tier higher, not lower. Under-classifying an autonomous action is the
single biggest legal/trust risk this product has.

**Every agent action, regardless of tier, must be logged** with: timestamp,
merchant ID, customer/order ID, action taken, tier, and the exact reasoning/
inputs that led to the decision. This is what the admin dashboard's audit
trail surfaces (see §7 and `01-SRS.md`).

**Merchant-configurable policy limits** (Tier 2/3 auto-approval): each
merchant sets, per exception type, a maximum dollar value and a maximum
number of auto-actions per day the agent may take unsupervised. Default for
every new merchant is **the most conservative setting (Tier 3 always
requires human approval)** until they explicitly opt into higher autonomy.
Never default a new merchant into autonomous refunds.

**Correction 2026-07-15 (`16-CARRIER-POLICIES.md` §5):** exhaustive
research (Canada Post's own Developer Program service directory, UPS's
Delivery Intercept scope, Intelcom's full API suite) confirmed **none of
the 3 MVP carriers expose any programmatic way to redirect/correct a
parcel already in transit** — Canada Post's redirection is explicitly
portal-only ("customer service agents are not able to redirect a package
on your companies' behalf" — no API exists at all); UPS Delivery
Intercept is US+Puerto Rico only; Intelcom's 6 APIs have no
correction/update endpoint. This means the address_issue "carrier
write-back" mechanism described elsewhere in these docs is **not
achievable as fully autonomous system-to-system automation for any MVP
carrier** — the actual mechanism (Moses confirmed 2026-07-15) is the
agent assembling a ready-to-submit correction packet that the **merchant**
manually submits via their own carrier portal login. This is still a
Tier 2 action (a commitment the agent is making on the merchant's behalf
that a human — the merchant — must actually honor by clicking submit),
just not a system-to-system write-back. Every other doc referencing
"automatic carrier write-back" should be read through this correction.

---

## 3. Data Classification & PII

Classify every field before it's stored. Do this at schema-design time, not
after.

| Class | Examples | Handling rule |
|---|---|---|
| **Public** | Product names, carrier names | No restriction |
| **Internal** | Exception counts, aggregate metrics | Merchant + Rezlv staff only |
| **PII — standard** | Customer name, email, shipping address, phone number | Encrypted at rest (Supabase/Postgres column-level or pgcrypto where feasible), access logged, never in application logs, never sent to a third-party analytics tool unhashed |
| **PII — sensitive** | Full payment card data | **Rezlv must never store this.** Stripe/payment processor tokenizes; Rezlv stores only tokens/last4/processor references. See §5. |
| **PII — communications content** | SMS message bodies, portal chat transcripts | Retained only as long as needed for dispute resolution / support (define retention period in SRS §Data Retention), encrypted at rest |
| **Auth secrets** | Passwords (n/a if using Supabase Auth/OAuth), API keys, service-account JSON, webhook signing secrets | Never in git, never in client-side code, never in logs. See §4. |

**Rule of thumb:** if a field could identify a real person or let someone
impersonate a merchant/carrier, treat it as PII by default and downgrade
only with a documented reason.

**GDPR/CCPA-shaped baseline** (Rezlv will have EU/CA customers' customers
even if Rezlv itself isn't EU-based, because it's processing shipping data
for brands who sell internationally):
- Right to access / right to deletion must be technically possible (a
  customer or merchant can request their data be exported or deleted —
  design the schema so a "delete customer PII" operation is a bounded,
  testable function, not an ad-hoc manual SQL run).
- Data minimization: don't collect a field "because it might be useful
  later." Every column must map to a documented feature need.
- Sub-processor list: any third party that touches customer PII (Twilio/SMS
  provider, Stripe, Supabase, carrier APIs) must be listed publicly in a
  privacy policy page — required for legal compliance, see §6.

---

## 4. Secrets & Credential Handling

- **No secret, API key, private key, or service-account JSON is ever
  committed to git.** `.env.local` and any `*credentials*.json` /
  `*-service-account*.json` pattern must be in `.gitignore` — verify this
  file-by-file before every commit that touches config.
- Rezlv needs **its own** Google service account / OAuth credentials if it
  ever integrates with Google services (e.g. Google Sheets export for a
  merchant). Do not reuse personal automation service accounts
  (`life-project-500503`, `outreach-engine-495718`) found elsewhere on this
  machine — those belong to unrelated personal projects and mixing scopes
  is a credential-hygiene and blast-radius risk.
- Production secrets live in the hosting platform's secret manager (Vercel
  Environment Variables, or Supabase Vault for DB-adjacent secrets) — never
  passed around in chat, docs, or commit messages. `08-ENVIRONMENT-SETUP.md`
  lists *which* secrets are needed, never their values.
- Webhook signatures (Shopify HMAC, Stripe webhook signing secret, carrier
  webhook auth) must be verified on every inbound webhook before any
  processing — unverified webhook = drop the request, log it, alert if
  repeated (possible attack).
- Rotate any credential immediately if it's ever pasted into a chat log,
  screenshot, or non-secret-manager location, even accidentally.

---

## 5. Payment & Financial Guardrails

(Full logic lives in `04-PAYMENT-LOGIC.md` — this section is the gate, not
the implementation.)

- **Rezlv's own SaaS billing** (merchant subscription to Rezlv) uses
  **Stripe** (industry standard, PCI compliance offloaded to Stripe, has a
  usable free/pay-as-you-go tier for testing — no Rezlv-side card storage
  ever). Rezlv never touches raw card numbers — Stripe Elements/Checkout
  only.
- **Merchant-side money movement** (refunds/credits to end customers that
  the agent facilitates) is **not** Rezlv's money — Rezlv either (a)
  triggers the merchant's existing payment processor (Shopify's own refund
  API, since Shopify already holds the payment relationship) or (b) simply
  recommends/queues the action for merchant approval. Rezlv should avoid
  becoming a money-transmitter itself in MVP — that opens a much heavier
  regulatory burden (money transmitter licensing). Flag any feature idea
  that would require Rezlv to hold/move merchant customer funds directly as
  **out of scope for MVP**, escalate to Moses before building it.
- Every financial action (refund, credit, chargeback response) is logged
  with before/after amounts, initiator (agent/human/merchant), and approval
  chain — no exceptions, this is audit-trail-critical for disputes.
- Idempotency: every payment-adjacent operation (refund trigger, Stripe
  webhook handling, carrier claim filing) must be idempotent — use
  idempotency keys, because retries WILL happen (network failures, webhook
  redelivery) and double-refunding or double-charging is a direct financial
  and trust loss.

---

## 6. Legal / Liability Guardrails

Do not treat this section as legal advice — it is a **build-time checklist**
to make sure Moses gets real legal review before launch, and to keep the
product from accidentally overreaching into liability Rezlv can't absorb.

- **Terms of Service & Privacy Policy are launch blockers**, not nice-to-
  haves — cannot onboard a paying merchant without them live. Must disclose:
  what data is collected, sub-processors (Stripe, SMS provider, Supabase,
  hosting, carrier APIs), retention periods, and merchant vs. Rezlv
  responsibilities.
- **Rezlv should explicitly disclaim, in ToS, being a party to the
  merchant-customer sales contract.** Rezlv facilitates exception
  resolution; the merchant remains responsible for the underlying sale,
  fulfillment obligation, and refund policy. This limits Rezlv's liability
  exposure but must be drafted by an actual lawyer before launch — this doc
  only flags that it's needed, it does not substitute for one.
- **SMS/TCPA compliance (US):** any outbound SMS to an end customer requires
  a lawful basis to text them (typically: they placed an order with the
  merchant and the merchant's own ToS covers transactional messaging, OR
  Rezlv/merchant collects explicit opt-in). Must support **STOP/opt-out**
  handling on every SMS number used — this is a hard legal requirement, not
  optional, and carriers will shut down a number that doesn't honor STOP.
  Build this before the first real SMS goes out, not after.
- **CAN-SPAM (email)** if/when email notifications are added: unsubscribe
  link, real sender identity, no deceptive subject lines.
- **Carrier API Terms of Service**: each carrier (UPS, USPS, FedEx, etc.)
  has its own API usage terms — rate limits, permitted use cases, data
  handling requirements. Violating them risks losing API access entirely,
  which breaks the core product. Document each carrier's terms link in
  `08-ENVIRONMENT-SETUP.md` when integrated.
- **Liability for wrong agent action:** if the agent sends a customer
  incorrect information or takes a wrong Tier-2 action, Rezlv needs a
  documented internal incident process (see `10-DEPLOYMENT-RUNBOOK.md`) AND
  the ToS needs to address this risk allocation — flag to Moses for legal
  review, don't self-resolve the liability language.
- **Data breach notification obligations** vary by jurisdiction (US state
  laws, PIPEDA in Canada given Moses's own immigration/CA context, GDPR if
  EU end-customers are in scope). Design logging/audit trails now (§2, §7)
  so that if a breach ever happens, Rezlv can actually answer "what data was
  accessed and by whom" — this is unbuildable retroactively.

---

## 7. Observability & Incident Guardrails

- Every Tier 1+ agent action, every payment operation, every webhook
  received, and every auth event must be logged in a structured, queryable
  way (not just `console.log`) — see `01-SRS.md` Observability section for
  the concrete stack choice.
- Errors must be traceable to: which merchant, which customer/order, which
  code path, and (for agent actions) which decision inputs — "an SMS failed
  to send" is useless without knowing to whom and why.
- The admin dashboard (see `01-SRS.md`) is the required human interface for
  this — it must let Moses/ops see agent actions in near-real-time and pause
  a merchant or the whole system without a code deploy.

---

## 8. Testing Guardrails

- **No feature is considered done without an automated test** covering its
  primary path — see `09-TESTING-STRATEGY.md` for the concrete framework
  choices and CI wiring. This is non-negotiable for anything touching
  payments, agent autonomy tiers 2+, or webhook signature verification.
- Payment logic, webhook signature verification, and any Tier 2/3 agent
  action must have tests for the failure/edge paths, not just the happy
  path (e.g.: what happens on a duplicate webhook delivery, an expired
  Stripe session, a carrier API timeout).
- Never push a change that touches `04-PAYMENT-LOGIC.md`-governed code
  without running the payment test suite locally first.

---

## 9. Folder & Repo Structure Guardrails

- All build docs live in `docs/` at the repo root (this folder) — never
  duplicate a doc's content into another location; link to it instead.
- Secrets/config templates go in `.env.example` (committed, no real values)
  — actual secrets stay out of git entirely (§4).
- Agent-facing skill definitions for this project live under
  `.claude/skills/` (Claude) — see `06-AGENT-COLLABORATION-PROTOCOL.md` for
  where Gemini's equivalent lives and how the two stay in sync.
- Keep the admin dashboard and merchant-facing app clearly separated in the
  route structure (e.g. `app/admin/*` vs `app/dashboard/*`) with distinct
  auth checks — never let a single "isAdmin" boolean on the same session
  gate both; see `01-SRS.md` for the concrete auth model.

---

## 10. Change Control

- Any change to **this file** (guardrails) requires explicit Moses sign-off
  — an AI agent may propose an edit but must not silently loosen a
  guardrail (e.g. moving an action from Tier 3 to Tier 2) without flagging
  it clearly and getting confirmation.
- Log every material decision (new guardrail, guardrail change, tier
  reclassification) to `05-LIVE-BUILD-LOG.md` with the date and reasoning.
