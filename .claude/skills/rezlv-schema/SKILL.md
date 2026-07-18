---
name: rezlv-schema
description: Builds Rezlv's Supabase/Postgres schema, RLS policies, Shopify webhook ingestion, and the NDR exception classifier. Stage 1 of the rezlv-build process. Use when the schema doesn't exist yet or needs a migration.
---

# rezlv-schema

Before anything else: read `docs/02-GUARDRAILS.md` and
`docs/05-LIVE-BUILD-LOG.md`. Then read `docs/01-SRS.md` §2 (Database) and
§3.1 (inbound webhooks), and `docs/03-EXCEPTIONS-TAXONOMY.md`.

## Scope

1. Supabase migrations for every table in `01-SRS.md` §2.2 — `merchants`,
   `merchant_users`, `admin_users`, `orders`, `shipments`, `exceptions`,
   `agent_actions`, `portal_sessions`, `notifications`, `billing_events`,
   `audit_log`.
2. RLS policy per merchant-scoped table (§2.3 pattern) — **write the
   cross-tenant-denial test alongside the policy, not after** (per
   `09-TESTING-STRATEGY.md` §2 item 4, this is zero-tolerance).
3. Shopify webhook route (`app/api/webhooks/shopify/route.ts`) — HMAC
   verification before any processing, acknowledge within Shopify's 5s
   timeout, heavy processing (classification) happens async after the 2xx.
4. NDR classifier — rule-based (per Product Roadmap: "Rule-based first;
   ML-enhanced Phase 2"), sorts into the 5 Confirmed categories in
   `03-EXCEPTIONS-TAXONOMY.md` §1, plus the cross-cutting types in §2.

## Constraints from the docs (don't deviate without flagging)

- UUID primary keys, not sequential integers.
- `agent_actions` and `audit_log` are append-only (no UPDATE/DELETE RLS
  policy) — this is a compliance requirement, not a style preference.
- PII columns (customer name/email/phone/address) — flag which need
  encryption-at-rest per `02-GUARDRAILS.md` §3, don't silently store
  plaintext and move on.
- Index `merchant_id` on every merchant-scoped table, `(merchant_id,
  status)` on `exceptions`.

## When unclear

Exact per-carrier NDR code mappings (what UPS Canada/Canada Post/Intelcom
actually return via EasyPost) won't be knowable until real EasyPost sandbox
testing happens — build the classifier's category enum now, wire real
carrier code mappings incrementally, and don't block the whole stage on
having every carrier's exact code list upfront.

If a schema question isn't answerable from `01-SRS.md` (e.g. an index
strategy question, a column type edge case), make the engineering call
and note it in the build log — that's a judgment call, not a product
decision requiring Moses. If it's genuinely a product/business question
(e.g. "should deleted merchants' data really be retained 90 days or
different"), stop and ask per `rezlv-build`'s "when unclear" section.

## Done when

RLS cross-tenant tests pass, webhook signature tests pass (valid/invalid/
missing-header), classifier has at least one test per exception category,
`05-LIVE-BUILD-LOG.md` updated.
