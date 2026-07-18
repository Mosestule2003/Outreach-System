---
name: rezlv-testing
description: Writes and maintains Rezlv's test suite per docs/09-TESTING-STRATEGY.md. Invoked as Stage 7 for hardening, and incrementally by every other rezlv-* sub-skill at its own "done" checkpoint. Use when a feature needs test coverage or CI needs wiring/fixing.
---

# rezlv-testing

Before anything else: read `docs/02-GUARDRAILS.md` §8 and
`docs/05-LIVE-BUILD-LOG.md`. Then read `docs/09-TESTING-STRATEGY.md` in
full, and `docs/10-DEPLOYMENT-RUNBOOK.md` §2 (CI/CD pipeline) if wiring
or fixing CI specifically.

## Scope

1. Unit tests (Vitest) for pure logic: autonomy-tier checker, NDR
   classifier, pricing sanity checks, address-validation wrapper.
2. Integration tests (Vitest + Supabase local/test instance): API routes,
   RLS cross-tenant-denial, webhook signature verification (valid/invalid/
   missing-header/duplicate).
3. E2E tests (Playwright) for the critical flows only — full merchant
   onboarding to first exception, customer portal token-to-confirmation,
   admin kill-switch-to-agent-stops.
4. GitHub Actions CI wiring — unit/integration on every PR, E2E on a
   schedule/pre-deploy.

## Hard constraints — do not deviate

- **Zero-tolerance areas get failure-path tests, not just happy path**:
  payment/billing idempotency and tier-boundaries, webhook signature
  verification, agent-autonomy-tier gating, RLS multi-tenancy,
  refund/credit idempotency (`09-TESTING-STRATEGY.md` §2 — this is the
  actual list, don't treat it as optional extra coverage).
- **No merge to `main` with failing tests** — enforce via CI, not
  discipline alone.
- Test data uses Shopify dev store + Stripe test mode exclusively — never
  production-adjacent credentials in a test run.

## Cross-skill responsibility

Every other `rezlv-*` sub-skill is expected to write its own primary-path
test as part of its own "done" checklist — `rezlv-testing` is not solely
responsible for retrofitting tests onto everyone else's work. Its Stage 7
role is: closing coverage gaps other skills left, wiring/hardening CI, and
building the E2E suite that spans multiple sub-skills' work (which no
single feature-building skill is positioned to own alone).

## When unclear

If a feature's "primary path" isn't obvious (e.g. is the primary path of
the carrier-connect wizard "one carrier connects successfully" or "all
three carriers connect in sequence"), use judgment and document the
choice in the test file's description — this is normal test-scoping, not
something to escalate. Escalate only if a zero-tolerance area's actual
failure mode isn't clear from the docs (e.g. what SHOULD happen on a
duplicate Stripe webhook — that's answered in `04-PAYMENT-LOGIC.md`, but
if a comparable case isn't covered anywhere, ask rather than guess the
correct behavior for something money- or security-adjacent).

## Done when

CI is green, zero-tolerance areas (§ above) have failure-path coverage,
`05-LIVE-BUILD-LOG.md` updated with what was added/fixed.
