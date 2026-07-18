---
name: rezlv-build
description: Parent orchestrator for building Rezlv full-stack (frontend + backend). Reads the docs/ spec, determines the next unfinished build stage, and invokes the right sub-skill. Use when asked to build, continue building, or check status of the Rezlv product build (not GTM/marketing/outreach — that's the other rezlv-internal-ops plugin skills).
---

# rezlv-build

Full-stack orchestrator for Rezlv (Shopify delivery-exception resolution
agent). Scoped to this repo (`Rezlv Product/rezlv-product/`). Does not
touch GTM/messaging/outreach — those are `rezlv-internal-ops` plugin
skills, a different system entirely.

## Every invocation, in this order

1. Read `docs/00-INDEX.md` — confirm all 16 docs are still marked Done; if
   any regressed to "in progress" or a new conflict was logged, resolve
   doc state before touching code.
2. Read `docs/02-GUARDRAILS.md` in full. Always. No exceptions.
3. Read `docs/05-LIVE-BUILD-LOG.md`, at least the last ~20 entries — this
   is what tells you what's already built and what the last session left
   blocked or in-progress. **Never assume a stage hasn't started just
   because you don't remember it** — the log is the source of truth, not
   your own context.
4. Determine the next stage (see Stage Map below) from what the log shows
   is actually done vs. not, not from an assumed sequence — stages can be
   picked up out of order if Moses or Gemini already made progress on one.

## Stage Map → Sub-skill → Docs each stage reads

| Stage | Sub-skill | Scoped docs |
|---|---|---|
| 0. Setup | (handled by this parent skill directly, not a sub-skill) | `08-ENVIRONMENT-SETUP.md` |
| 1. Backend foundation (schema, RLS, Shopify webhook, NDR classifier) | `rezlv-schema` | `01-SRS.md` §2-3, `03-EXCEPTIONS-TAXONOMY.md` |
| 2. Frontend shell (auth, onboarding, dashboard, settings) | `rezlv-frontend` | `15-FRONTEND-SPEC.md`, `12-MERCHANT-ONBOARDING.md` |
| 3. Customer portal | `rezlv-portal` | `15-FRONTEND-SPEC.md` §4, `01-SRS.md` §4.1, `14-CONTENT-TEMPLATES.md` §4 |
| 4. Resolution engine + carrier write-back | `rezlv-exceptions-engine` | `03-EXCEPTIONS-TAXONOMY.md`, `14-CONTENT-TEMPLATES.md`, `02-GUARDRAILS.md` §2 |
| 5. Admin dashboard | `rezlv-admin-dashboard` | `01-SRS.md` §6, `15-FRONTEND-SPEC.md` (screens 020-023, 034-035) |
| 6. Billing | `rezlv-payments` | `04-PAYMENT-LOGIC.md` |
| 7. Testing/deployment hardening | `rezlv-testing` (+ ongoing, every stage) | `09-TESTING-STRATEGY.md`, `10-DEPLOYMENT-RUNBOOK.md` |

Every stage's sub-skill also reads `02-GUARDRAILS.md`,
`05-LIVE-BUILD-LOG.md`, and `11-GLOSSARY.md` on top of its scoped docs —
that's constant across all of them, not repeated in the table above.

**Either agent (Claude or Gemini) may pick up any stage** — this isn't
split by frontend/backend between the two. Coordination happens entirely
through `05-LIVE-BUILD-LOG.md`; check it before claiming a stage so two
agents don't build the same thing in parallel and conflict.

## Stage 0 — Setup (this skill's own responsibility, not delegated)

Before any sub-skill runs for the first time:

1. Check `.env.local` / Vercel env against `08-ENVIRONMENT-SETUP.md`'s
   account table.
2. Anything 🟢 (already exists — Vercel, Supabase, GitHub): confirm still
   working, move on.
3. Anything 🟡 (self-serve, free, no Moses identity needed — Sentry,
   EasyPost, Resend, GCP project if ever needed): can be prepared without
   asking, following the doc's setup order (§11 of that doc).
4. Anything 🔴 (needs Moses's identity/payment method — Stripe, Twilio,
   Shopify Partner, domain/business email): **stop, list exactly what's
   needed and why, in one consolidated ask** — don't trickle these out
   one at a time across a build session. Wait for Moses to complete them
   before the stage(s) that depend on them can proceed; other
   non-dependent stages may continue in the meantime.

## Go/No-Go Gate (applies to every stage, not just Stage 0)

Before starting any unit of work, check `02-GUARDRAILS.md` §1's checklist:
traceable to a doc, data classified if it touches PII, autonomy tier
assigned if agent-facing, test plan exists. **If any box can't be
checked, stop and surface the gap — don't guess and proceed.**

## When something is unclear

This is expected to happen — the docs are thorough but not omniscient.
When a sub-skill (or this parent) hits a genuine ambiguity (a doc doesn't
cover the specific case, two docs seem to imply different things, a
product/business decision is needed that isn't in scope for an engineering
judgment call):　**stop and ask Moses directly**, the same way this session
did for the pricing-model and carrier-scope conflicts. Don't:
- Guess and move on silently.
- Ask Gemini instead of Moses for a product decision — Gemini won't see
  this session live, and product/business calls aren't Gemini's to make
  either.
- Treat "the doc is silent on this" as permission to invent freely —
  silence usually means the doc needs updating, which is itself worth
  flagging.

Log every "asked and answered" resolution as a new `05-LIVE-BUILD-LOG.md`
entry, and if it was a real decision (not just a clarification), log it in
Product Control Center's Decision Log too
(`Rezlv Product/GTM Info/rezlv-sheets/sheet.cjs`) — see
`06-AGENT-COLLABORATION-PROTOCOL.md` for the credential/tool reference.

## Definition of done, per stage

A stage is not marked complete until:

- [ ] Code matches its scoped docs' spec (schema fields, screen states,
      component constraints, exception types, pricing tiers — whatever's
      actually relevant to that stage)
- [ ] `09-TESTING-STRATEGY.md`'s requirements for that stage are met
      (zero-tolerance areas get failure-path tests, not just happy path)
- [ ] `05-LIVE-BUILD-LOG.md` has an entry for the work
- [ ] Any new third-party service is added to `13-SUBPROCESSORS-AND-DPA.md`
      and `08-ENVIRONMENT-SETUP.md`
- [ ] Any new domain term is added to `11-GLOSSARY.md`

## Explicitly out of scope for this skill

- GTM/outreach/messaging work — that's `rezlv-internal-ops` plugin skills.
- Signing up for 🔴 services on Moses's behalf.
- Loosening `02-GUARDRAILS.md` without his explicit sign-off.
- Writing real Terms of Service/Privacy Policy legal language without
  flagging it needs real legal review before going live.
