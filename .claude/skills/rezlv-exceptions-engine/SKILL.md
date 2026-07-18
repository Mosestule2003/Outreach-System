---
name: rezlv-exceptions-engine
description: Builds Rezlv's core resolution agent — the SMS/email/voice escalation ladder and Canadian carrier (Canada Post/Intelcom/UPS Canada) write-back via EasyPost BYOD. Stage 4 of rezlv-build, the heart of the product. Use when the resolution engine doesn't exist yet or needs updating.
---

# rezlv-exceptions-engine

Before anything else: read `docs/02-GUARDRAILS.md` (especially §2, agent
autonomy tiers — this skill builds the code that section governs) and
`docs/05-LIVE-BUILD-LOG.md`. Then read `docs/03-EXCEPTIONS-TAXONOMY.md`
and `docs/14-CONTENT-TEMPLATES.md` in full.

## Scope

1. The 3-step escalation ladder: SMS (Twilio) → email (Resend, if no
   reply) → AI voice agent call (last attempt before carrier RTO
   deadline). Every step automatic and timestamped on the `exceptions`
   row.
2. Carrier write-back for Canada Post, Intelcom, and UPS Canada
   (confirmed 2026-07-15, Canadian-only for MVP) via EasyPost's
   BYOD/BYOCA layer.
3. The shared `checkAutonomyTier(merchantId, actionType, context)`
   function — **one source of truth**, called by every code path that lets
   the agent act. Do not scatter tier-checking logic across call sites.
4. Every agent action writes an `agent_actions` row (append-only) before/
   immediately after execution — this is the audit trail the admin
   dashboard depends on, not optional logging.

## Hard constraints — do not deviate

- New merchants default to the **most conservative autonomy config**
  (`02-GUARDRAILS.md` §2) — enforce this at merchant-creation time in
  code, don't rely on it being a docs-only convention.
- The voice-call step **never commits a Tier 2+ action from verbal
  confirmation alone** (`14-CONTENT-TEMPLATES.md` §3) — it drives the
  customer back to the SMS/portal link, full stop.
- Refunds/credits are Tier 3 by default — never autonomous unless a
  specific merchant has explicitly opted into an auto-approval rule with
  a hard dollar cap (`02-GUARDRAILS.md` §2, `04-PAYMENT-LOGIC.md` §5.2).
- Degrade gracefully when a merchant hasn't connected the relevant
  carrier yet (`03-EXCEPTIONS-TAXONOMY.md` §4 edge case 4) — notify, don't
  silently fail or falsely confirm.
- `write_back_failure` gets an honest customer message, never a false
  "fixed!" confirmation (§4 edge case 5).
- Meter-event reporting to Stripe on `resolved_success` must be
  idempotent (exception ID as/part of the idempotency key) — coordinate
  with `rezlv-payments` on the exact trigger point, don't duplicate this
  logic in both skills.

## When unclear

Exact BYOCA auth mechanism (OAuth vs. API-key) per carrier — confirm
against EasyPost's actual docs when this stage starts, don't assume
(flagged as an open item in `12-MERCHANT-ONBOARDING.md` §8). AI voice
provider hasn't been selected yet (`08-ENVIRONMENT-SETUP.md` open item) —
this blocks the voice-call rung specifically; the SMS/email rungs can be
built and shipped independently while voice-provider selection is
pending, don't block the whole engine on it.

If a specific exception sub-type's resolution logic isn't fully specified
in `03-EXCEPTIONS-TAXONOMY.md` (e.g. exactly which write-back API call a
given carrier needs for a given correction type), that's expected to be
resolved via real EasyPost sandbox testing during this stage, not a reason
to stop — but if the *autonomy tier* for a new action type isn't obviously
covered by `02-GUARDRAILS.md` §2's tier table, stop and ask Moses. Under-
classifying an autonomous action is this product's single biggest risk.

## Done when

Every exception type in `03-EXCEPTIONS-TAXONOMY.md` §1-2 has a test
exercising classify→notify→resolve, autonomy-tier gating has tests for
both the "blocked without approval" and "allowed within cap" paths
(`09-TESTING-STRATEGY.md` §2 item 3), `05-LIVE-BUILD-LOG.md` updated.
