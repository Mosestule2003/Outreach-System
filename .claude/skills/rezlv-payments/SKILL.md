---
name: rezlv-payments
description: Builds Rezlv's Stripe Billing Meters integration (unified $8/$5/$3 graduated pricing) and merchant-side refund/credit trigger logic. Stage 6 of rezlv-build. Use when billing doesn't exist yet or needs updating.
---

# rezlv-payments

Before anything else: read `docs/02-GUARDRAILS.md` §5 and
`docs/05-LIVE-BUILD-LOG.md`. Then read `docs/04-PAYMENT-LOGIC.md` in full.

## Scope

1. Stripe Billing Meters wired to `resolved_success` — **use Stripe's
   native graduated-tier meter pricing, do not hand-roll tier math in
   Rezlv's backend** (`04-PAYMENT-LOGIC.md` §2).
2. Free-trial counter (first 10 resolved cases free per merchant, usage-
   boxed not time-boxed).
3. Merchant-side refund/credit trigger — calls the merchant's own Shopify
   refund API, Rezlv never processes payment itself (§5.1).

## Hard constraints — do not deviate

- **Test in Stripe Test Mode throughout the build**, including tier-
  boundary cases (case 100 vs 101, case 500 vs 501) — this is a
  zero-tolerance area (`09-TESTING-STRATEGY.md` §2 item 1).
- **Meter-event reporting must be idempotent** — use the exception's own
  ID as/part of the Stripe idempotency key. Coordinate with
  `rezlv-exceptions-engine` on the exact trigger point (the moment an
  exception hits `resolved_success`) so this logic lives in one place,
  not duplicated.
- Refunds/credits are Tier 3 (`02-GUARDRAILS.md` §2) — never fully
  autonomous in MVP without an explicit per-merchant opt-in with a hard
  cap. Partial-amount refunds always need human confirmation of the exact
  figure, even if the agent suggests one.
- Refund/credit triggers need their own idempotency key (exception ID) —
  a retried request must never double-refund a customer
  (`04-PAYMENT-LOGIC.md` §5.4, the single highest-trust-impact bug
  category this product can ship).
- Never store raw card numbers — Stripe Elements/Checkout only.

## When unclear

Enterprise volume-commitment pricing and the Returns Orchestration add-on
rate are both explicitly deferred/unvalidated in `04-PAYMENT-LOGIC.md` §6
— don't build either without checking with Moses first, they're open by
design, not an oversight to fill in.

Exact Shopify OAuth scope needed for triggering refunds server-side isn't
confirmed yet — confirm against Shopify's actual API docs when this stage
starts, record the answer in `08-ENVIRONMENT-SETUP.md`.

## Done when

Tier-boundary tests pass, idempotency tests pass for both meter-events and
refund triggers (duplicate submission never double-bills/double-refunds),
`05-LIVE-BUILD-LOG.md` updated.
