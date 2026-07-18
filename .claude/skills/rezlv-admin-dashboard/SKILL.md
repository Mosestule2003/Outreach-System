---
name: rezlv-admin-dashboard
description: Builds Rezlv's internal admin dashboard — KYC review, agent-action audit trail, kill switch, billing overview. Backend API + structurally separate frontend shell. Stage 5 of rezlv-build. Use when the admin surface doesn't exist yet or needs updating.
---

# rezlv-admin-dashboard

Before anything else: read `docs/02-GUARDRAILS.md` and
`docs/05-LIVE-BUILD-LOG.md`. Then read `docs/01-SRS.md` §6 (Admin
Dashboard) and `docs/15-FRONTEND-SPEC.md` (screens 020-023, 034-035).

## Scope

1. `admin_users`-gated API layer, **server-side only, never client-side
   Supabase calls with elevated privileges** (`01-SRS.md` §2.3, §4.1).
2. Merchant KYC/onboarding review screen.
3. Cross-merchant agent-action audit feed (reads `agent_actions`,
   filterable by merchant/tier/type/date).
4. Kill switch: system-wide pause (Tier 4, confirmation-gated, not a
   single click) and per-merchant pause.
5. Audit log viewer (`audit_log` table, exportable).
6. Billing/usage overview (per-merchant Stripe status, MRR rollup).

## Hard constraints — do not deviate

- **Mandatory 2FA/TOTP for admin auth** — higher blast radius than
  merchant access, this is a hard launch requirement, not deferred
  (`01-SRS.md` §4.1).
- **`admin_users` is a separate table from `merchant_users`** — never a
  boolean flag shared with merchant accounts.
- **Admin sidebar/shell must be visually distinct from the merchant
  dashboard's** (built by `rezlv-frontend`) — never confusable at a
  glance. Check the actual merchant shell before building this, don't
  build in isolation and hope they end up different enough.
- **A merchant-scoped token hitting an admin route must fail closed**
  (403), never redirect-and-reveal (`15-FRONTEND-SPEC.md` screen 034,
  Spec D requirement).
- Kill switch actions require a confirmation step in the UI — this is a
  Tier 4 action per `02-GUARDRAILS.md` §2.
- `AdminOverrideDialog`'s reason field (required vs. optional) is an
  **open question flagged in the source UX data** — resolve it by asking
  Moses before building this specific dialog, don't default to either
  without confirming.

## When unclear

If the KYC review flow needs a specific business-verification step not
covered in `01-SRS.md` §6 (e.g. what documents a merchant submits), ask
Moses — this touches real compliance/legal territory
(`02-GUARDRAILS.md` §6), not an engineering judgment call.

## Done when

Fail-closed test for merchant-token-on-admin-route exists
(`09-TESTING-STRATEGY.md` §2 item 4's spirit applied to admin routes
specifically), kill-switch confirmation flow tested, `05-LIVE-BUILD-LOG.md`
updated.
