# Rezlv — Payment Logic

Covers two distinct money flows — keep them separate in code, schema, and
mental model:

1. **Rezlv's own SaaS billing** — merchant pays Rezlv (this doc, §1-4).
2. **Merchant-side money movement the agent facilitates** — refunds/credits
   to end customers, which is the *merchant's* money via *their* payment
   processor, not Rezlv's (§5). Per `02-GUARDRAILS.md` §5, Rezlv does not
   become a money-transmitter for this in MVP.

Governed by `02-GUARDRAILS.md` §5 (payment guardrails) — read that first.

## 1. Pricing Model (UNIFIED — decision logged 2026-07-15)

**One 3-tier graduated (marginal) per-case rate card**, used consistently
across Rezlv's own planning docs (Content Tracker's Business Model + ROI &
Pricing Calculator tabs) and this SRS:

| Tier | Monthly resolved cases | Rate per case |
|---|---|---|
| 1 | 1–100 | $8.00 |
| 2 | 101–500 | $5.00 |
| 3 | 501+ | $3.00 |

**Graduated, not volume-based:** each case is billed at the rate for *its
own* tier — the first 100 cases in a month always cost $8 each regardless
of total monthly volume, the next 400 cost $5 each, and so on. This avoids
the cost-cliff problem of volume pricing (where one extra case could
retroactively change the price of every case that month).

This replaces three previously-conflicting sources (flat $299/$599/$999
tiers, and two different 4-tier graduated rate cards) — see
`00-INDEX.md`'s decision log reference and the Product Control Center
Decision Log tab (entry 2026-07-15) for the full reasoning trail. All
source docs have been corrected; there is no remaining conflicting
reference as of this doc's last update.

### Worked examples

| Monthly resolved cases | Calculation | Total bill | Effective rate/case |
|---|---|---|---|
| 120 | 100×$8.00 + 20×$5.00 | $900.00 | $7.50 |
| 600 | 100×$8.00 + 400×$5.00 + 100×$3.00 | $3,100.00 | $5.17 |
| 3,200 | 100×$8.00 + 400×$5.00 + 2,700×$3.00 | $10,900.00 | $3.41 |

### What counts as a billable case

A case is billable **only** when it reaches `resolved_success` status
(`01-SRS.md` §2.2 `exceptions.status` — align the status enum to include
this exact value, not a loosely-similar synonym, so billing logic has one
unambiguous trigger). Specifically:

- Billable: exception corrected via automated BYOD/BYOCA carrier write-back,
  OR a manual action the merchant completed and confirmed through the
  system.
- **Not billable:** exceptions that hit `unresolved_window_expired` (the
  full escalation ladder ran out without resolution — see
  `03-EXCEPTIONS-TAXONOMY.md` `no_response`), exceptions still `detected`/
  `awaiting_customer`, or duplicate/retried attempts at the same exception
  (billed once per exception reaching `resolved_success`, never once per
  retry attempt).

### Free trial

First 10 resolved cases free per new merchant, no credit card required to
connect Shopify + first carrier account — matches the existing pilot/demo
offer. Implement as a per-merchant counter checked before invoicing the
first billing cycle, not a time-boxed trial (usage-boxed, not date-boxed).

### Enterprise volume commitment (deferred)

Larger accounts may eventually commit to a monthly minimum volume for a
negotiated flat effective rate lower than the standard tiers would
produce. **Not built for MVP** — offer only once real usage data exists to
price it responsibly; treat as a manually negotiated overlay on top of the
standard Stripe meter, not a second pricing engine.

### Add-ons (Phase 2+, not MVP-blocking)

- **Carrier Invoice Auditing:** 25% revenue share on recovered refunds,
  billed only when Rezlv actually recovers money for the merchant.
- **Returns Orchestration:** flat monthly add-on (rate TBD — legacy
  reference was $150/mo, revalidate before implementing).

## 2. Stripe Implementation

- Use **Stripe Billing Meters** (Stripe's 2025+ metered-billing
  primitive) — Rezlv reports a meter event when a case reaches
  `resolved_success`; Stripe calculates the graduated-tier invoice
  natively. **Do not hand-roll tier math in Rezlv's backend** — this is
  exactly the kind of logic that's easy to get subtly wrong (off-by-one
  tier boundaries, double-counting) and Stripe already solves it.
- Billing cycle: usage metered continuously, invoiced **monthly in
  arrears** for the prior month's resolved cases.
- Test in **Stripe Test Mode** throughout the build (`08-ENVIRONMENT-SETUP.md`
  §2) — verify the graduated meter pricing model end-to-end (including tier
  boundary cases: exactly 100, exactly 101, exactly 500, exactly 501
  resolved cases in a month) before ever switching to live keys.
- **Idempotency (Guardrails §5):** the meter-event report to Stripe on
  `resolved_success` must be idempotent — use the exception's own ID as
  (or as part of) the Stripe idempotency key, so a retried webhook or a
  duplicate internal event never reports the same resolved case twice.

## 3. Unit Economics (context for pricing sanity, not a build spec)

| Metric | Estimate |
|---|---|
| COGS per resolved case (SMS + email) | $0.05–0.10 (Twilio + Resend) |
| COGS per resolved case (AI voice step) | $0.30–0.60, only for cases reaching the voice-call escalation rung |
| COGS per resolved case (carrier API via BYOA) | Near-zero — executed via the merchant's own connected carrier account |
| Target gross margin | 70–80% at scale |

At the $8/$5/$3 unified rate card, even Tier 3's $3.00/case floor clears
the highest-COGS case (voice-escalated, ~$0.60) with wide margin — the
pricing model doesn't need per-tier COGS-awareness beyond this sanity
check.

## 4. What Rezlv's Billing Logic Must Never Do

Per `02-GUARDRAILS.md` §5:

- Never store raw card numbers — Stripe Elements/Checkout only.
- Never double-report a meter event for the same resolved case (idempotency
  above).
- Never silently change a merchant's effective rate mid-cycle without it
  being a transparent tier-boundary crossing the merchant can see reflected
  in their own dashard usage view.

## 5. Merchant-Side Money Movement (refunds, credits, reships) — NOT Rezlv's money

This is money the **merchant** owes their **customer** — Rezlv facilitates
the exception resolution, it does not hold or move these funds itself.

### 5.1 Mechanism

- Where the resolution is a **reship**: no payment logic at all, this is a
  fulfillment action (new Shopify fulfillment created), covered by
  `01-SRS.md` §3, not this doc.
- Where the resolution is a **refund or credit**: Rezlv triggers the
  merchant's **own** Shopify refund API (Shopify already holds the
  original payment relationship with the end customer) rather than
  Rezlv processing any payment itself. Rezlv is a trigger/orchestrator
  here, never a payment processor for merchant-customer transactions.
- Rezlv **never** becomes a money-transmitter — this is an explicit MVP
  scope boundary (Guardrails §5). Any feature idea that would require
  Rezlv to hold or move merchant-customer funds directly is out of scope;
  escalate to Moses before building it.

### 5.2 Autonomy gating (ties to `02-GUARDRAILS.md` §2)

Refunds/credits are **Tier 3** actions by default — never fully autonomous
in MVP unless a specific merchant has explicitly opted into an auto-
approval rule with a hard dollar cap (Guardrails §2). New merchants default
to requiring human approval for every refund/credit the agent recommends.

### 5.3 Calculation logic

- **Full refund:** order value as recorded in Shopify at time of the
  original order — Rezlv reads this from Shopify, never recalculates or
  overrides it.
- **Partial refund / credit (e.g. partial damage, partial shortage):**
  requires a human-entered or human-confirmed amount — the agent may
  *suggest* an amount (e.g. proportional to a damage description) but
  Guardrails §2's Tier 3 gate means a human confirms the actual figure
  before it's triggered. Never let the agent compute and execute a partial
  amount unsupervised in MVP.
- **Reverse-shipping/RTO-avoidance value** (the $12 reverse-shipping +
  $18 restock/write-off benchmark used in the ROI calculator) is a
  *modeling* input for Rezlv's own sales/ROI story — never treat it as an
  actual chargeable amount in real merchant-customer transactions; it's
  aggregate benchmark data, not a per-case calculation input.

### 5.4 Idempotency

Same principle as §2 — every refund/credit trigger needs an idempotency
key (the exception ID is a natural fit) so a retried request, a double
button-press, or a webhook redelivery can never double-refund a customer.
This is the single highest-trust-impact bug category this product can
ship — treat it with the zero-tolerance testing bar from
`02-GUARDRAILS.md` §8.

### 5.5 Chargebacks (distinct from merchant-initiated refunds)

A chargeback is initiated by the *end customer's bank*, not through
Rezlv's portal — Rezlv is not in this flow directly for MVP. If a
merchant's chargeback rate is visibly correlated with unresolved Rezlv
exceptions (a customer who never got their delivery issue resolved
disputes the charge instead), that's a useful signal for the **Exception
Analytics Dashboard** (V1.1, per Product Control Center roadmap) but not
something Rezlv processes or contests on the merchant's behalf in MVP.

## 6. Open Items

- Enterprise volume-commitment pricing mechanics — deferred until real
  usage data exists (§1).
- Returns Orchestration add-on rate — revalidate the $150/mo legacy figure
  before Phase 2 implementation.
- Exact refund-API scope requested during Shopify OAuth
  (`01-SRS.md` §4.3) must include whatever permission Shopify requires for
  triggering refunds server-side — confirm exact scope name during Sprint 3
  build and record it in `08-ENVIRONMENT-SETUP.md`.
