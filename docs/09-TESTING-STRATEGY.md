# Rezlv — Testing Strategy

Implements `02-GUARDRAILS.md` §8: no feature ships without a test covering
its primary path; payment logic, webhook signature verification, and
agent-autonomy-tier gating get zero-tolerance treatment for edge/failure
paths, not just happy path.

## 1. Test Boundaries

| Layer | Tool | Scope |
|---|---|---|
| **Unit** | Vitest (fast, native ESM/TS, works cleanly with Next.js 16 — avoid Jest's added config overhead for a greenfield app) | Pure functions: autonomy-tier checker (`01-SRS.md` §5), NDR classifier logic, pricing-tier calculator (sanity-check only — Stripe owns the real tier math per `04-PAYMENT-LOGIC.md` §2, but a unit test should assert Rezlv's own reporting logic never double-counts), address-validation wrapper |
| **Integration** | Vitest + a real (test-project) Supabase instance, or Supabase's local dev stack (`supabase start`) | API route handlers, RLS policy enforcement (a merchant A session must never read merchant B's rows — write this test explicitly, don't assume RLS works from config alone), webhook signature verification (valid signature accepted, invalid rejected, replayed/duplicate handled idempotently) |
| **E2E** | Playwright | Critical user flows only, not every screen: merchant login → onboarding → first exception appears in Case Queue; customer portal token → submit correction → confirmation state; admin kill-switch → merchant paused → agent stops acting for that merchant |
| **Manual/exploratory** | `verify` skill (already available in this session) + browser preview | UI states from `15-FRONTEND-SPEC.md` that are hard to assert cheaply (empty states, loading skeletons, responsive/mobile layout) |

## 2. Zero-Tolerance Areas (per Guardrails §8 — these need failure-path tests, not just happy path)

1. **Payment/billing** (`04-PAYMENT-LOGIC.md`): meter-event idempotency
   (duplicate `resolved_success` event never double-bills), tier-boundary
   correctness (case 100 vs 101, case 500 vs 501), free-trial counter
   (11th case actually bills, 10th doesn't).
2. **Webhook signature verification** (`01-SRS.md` §3.1, §4.3): Shopify
   HMAC, Stripe signature, Twilio inbound signature, carrier webhook auth
   — each needs a test for valid-accepted, invalid-rejected, and
   missing-header-rejected. This is the #1 real-world attack surface for
   this architecture.
3. **Agent autonomy tier gating** (`02-GUARDRAILS.md` §2, `01-SRS.md` §5):
   a Tier 3 action must never execute without either merchant-configured
   auto-approval within cap OR explicit human approval — test both the
   "blocked without approval" and "allowed within configured cap" paths,
   plus the default-conservative-config path for a brand-new merchant.
4. **RLS/multi-tenancy:** explicit cross-tenant-read-denied test per
   merchant-scoped table (`01-SRS.md` §2.2) — this is the test that
   protects against the single worst-case bug this architecture can have.
5. **Refund/credit idempotency** (`04-PAYMENT-LOGIC.md` §5.4): a retried
   refund trigger must never double-refund a customer.

## 3. Coverage Expectations by Build Stage

Not a single global coverage percentage — coverage requirements are scoped
to what each stage actually touches:

- Stage 1 (schema/backend foundation): RLS tests are **mandatory**, not
  optional, before a table is considered done.
- Stage 2/3 (frontend/portal): component-level tests for the specialized
  components in `15-FRONTEND-SPEC.md` §5 that carry accessibility/branding
  constraints (`FamilyBadge` text-label requirement, `ExpiredLinkState`
  no-Rezlv-branding requirement) — assert the constraint, not just that
  the component renders.
- Stage 4 (resolution engine): every exception type in
  `03-EXCEPTIONS-TAXONOMY.md` needs at least one test exercising its
  classify → notify → resolve path, plus the degraded-path cases (§4 edge
  cases in that doc — BYOD not connected yet, address re-validation
  failure, post-RTO-deadline resolution attempt).
- Stage 6 (billing): zero-tolerance area, see §2.

## 4. CI Wiring

- GitHub Actions (free for this repo, per `08-ENVIRONMENT-SETUP.md` §1) —
  run unit + integration tests on every PR/push. E2E runs on a schedule
  or pre-deploy, not every commit (Playwright suites are slower — don't
  block fast iteration on them).
- **No merge to `main` with failing tests** — this is a guardrail, not a
  preference (`02-GUARDRAILS.md` §8: "Never push a change that touches
  payment-governed code without running the payment test suite locally
  first," extended here to all zero-tolerance areas via CI enforcement).
- Vercel preview deploys already happen per-PR (existing setup) — treat a
  green preview + green CI as the merge gate together, not either alone.

## 5. Test Data / Fixtures

- Use Shopify's **development store** (`08-ENVIRONMENT-SETUP.md` §4) and
  Stripe **test mode** (§2) exclusively for all automated tests — never
  point tests at production-adjacent credentials.
- Seed fixture data that exercises each of the 5 NDR categories
  (`03-EXCEPTIONS-TAXONOMY.md` §1) plus the cross-cutting types (§2) —
  don't only test the common `address_issue` path.
- Mock carrier API responses (EasyPost sandbox mode where available) for
  unit/integration tests; reserve real EasyPost sandbox calls for a
  smaller set of integration tests specifically validating the BYOD/BYOCA
  connection flow.

## 6. What "Done" Means for a Feature (ties to `02-GUARDRAILS.md` §1 go/no-go gate)

A feature is not marked complete in `05-LIVE-BUILD-LOG.md` until:

- [ ] Its primary path has an automated test
- [ ] If it's in a zero-tolerance area (§2), its failure/edge paths are
      tested too
- [ ] Tests pass in CI, not just locally
- [ ] If it touches RLS-scoped data, a cross-tenant-denial test exists
