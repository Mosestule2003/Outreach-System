# Rezlv — Deployment & Incident Runbook

## 1. Environments

| Env | Purpose | Deploy trigger |
|---|---|---|
| **Local** | Development, `supabase start` for local DB | Manual |
| **Preview** | Per-PR Vercel preview deploy (already active per existing Vercel setup) | Automatic on PR push |
| **Production** | Live merchant traffic | Merge to `main`, after CI green (`09-TESTING-STRATEGY.md` §4) |

No separate staging environment for MVP — Vercel preview deploys plus
Shopify's development store (`08-ENVIRONMENT-SETUP.md` §4) and Stripe test
mode (§2) cover pre-production verification at this scale. Revisit once
merchant count and change velocity justify a dedicated staging tier.

## 2. CI/CD Pipeline

1. PR opened → GitHub Actions runs unit + integration tests
   (`09-TESTING-STRATEGY.md`) → Vercel builds a preview deploy.
2. Both green → mergeable. Neither a red test suite nor a failed preview
   build is mergeable (Guardrails §8).
3. Merge to `main` → Vercel deploys to production automatically.
4. **No manual production deploys outside this path** — if a hotfix is
   urgent, it still goes through a PR (can be fast-tracked, but not
   skipped) so the build log and test suite stay the source of truth for
   what's actually running in production.

## 3. Secrets in Each Environment

Per `02-GUARDRAILS.md` §4 and `08-ENVIRONMENT-SETUP.md` §10 — production
secrets live in Vercel's Production environment variables, preview/test
secrets (Stripe test keys, Shopify dev store token, Twilio trial creds)
live in Vercel's Preview environment variables, kept deliberately distinct
so a preview deploy can never accidentally act against live Stripe/Twilio/
Shopify data.

## 4. Rollback

- Vercel keeps prior deployments — a bad production deploy rolls back via
  Vercel's instant rollback to the last known-good deployment (no rebuild
  needed).
- **Database migrations are the harder rollback case** — write every
  Supabase migration to be backward-compatible with the immediately-prior
  app version where feasible (additive changes preferred over destructive
  ones in the same deploy), so a Vercel rollback doesn't leave the app
  pointed at a schema it can't read. Flag any migration that can't be made
  backward-compatible before merging it, not after.
- The admin dashboard's **kill switch** (`01-SRS.md` §6) is the fastest
  incident-response lever for a *behavioral* problem (agent doing
  something wrong) that doesn't require a code rollback at all — use it
  before reaching for a rollback when the issue is "the agent is taking a
  bad action," not "the code is broken."

## 5. Incident Response — by symptom

### 5.1 Agent takes a wrong/unexpected action

1. **Immediate:** admin dashboard → pause the affected merchant (or
   system-wide if it's not merchant-specific) via the kill switch
   (`01-SRS.md` §6).
2. Pull the `agent_actions` record for the specific case (`01-SRS.md`
   §2.2) — this is the audit trail, it has the exact inputs the agent
   decision was based on.
3. Determine: was this a Tier-classification bug (wrong tier assigned to
   an action type) or a bad decision within a correctly-classified tier?
   The fix differs — the former is a code bug in
   `checkAutonomyTier()` (`01-SRS.md` §5), the latter may be a
   classifier/prompt/logic issue in the resolution engine itself.
4. Fix, add a regression test covering this exact scenario
   (`09-TESTING-STRATEGY.md` §2 item 3), deploy via the normal pipeline,
   only then unpause the merchant.
5. Log the incident and fix in `05-LIVE-BUILD-LOG.md`.

### 5.2 Webhook signature verification failures spike

Per `01-SRS.md` §7 alerting — this fires an admin alert
(`14-CONTENT-TEMPLATES.md` §5.2) automatically. On receiving it:

1. Check `audit_log`/structured logs for the source and pattern — is it
   one IP hammering the endpoint (likely attack/scan) or a legitimate
   provider whose signing secret rotated without Rezlv's config being
   updated (likely misconfiguration)?
2. If misconfiguration: rotate/update the secret in Vercel env
   (`08-ENVIRONMENT-SETUP.md` §10), redeploy.
3. If attack: the endpoint should already be rejecting unsigned/invalid
   requests (Guardrails §4) — verify it's actually doing so (no
   processing occurred), consider rate-limiting the specific source if the
   volume is disruptive.

### 5.3 Payment/billing failure (meter event failed to report, invoice looks wrong)

1. **Never manually adjust a Stripe invoice as a first response** — first
   determine whether the underlying `resolved_success` event was actually
   duplicated or missed, using the idempotency-key trail
   (`04-PAYMENT-LOGIC.md` §2).
2. If a meter event genuinely failed to send (network/API error, not a
   logic bug): Stripe Billing Meters supports backdated event reporting
   within its event-reporting window — use that rather than a manual
   invoice edit, to keep Stripe as the single source of truth for billing
   math (`04-PAYMENT-LOGIC.md` §2 principle).
3. If it's a logic bug (double-report, wrong case counted): fix the bug,
   add a regression test, and only then decide whether a specific
   merchant's specific invoice needs a manual correction — that decision
   involves real money and should not be made solo; confirm with Moses.

### 5.4 Carrier write-back failing for a specific carrier

1. Check EasyPost's status/dashboard for the specific carrier connection
   (`08-ENVIRONMENT-SETUP.md` §5) — BYOD/BYOCA connections can expire or
   need re-auth per merchant.
2. If it's one merchant: their carrier connection likely needs
   reconnecting — this should already surface as the "Carrier Connection
   Status Panel" screen (`15-FRONTEND-SPEC.md` §4, screen 012) with a
   reconnect CTA; verify that screen is actually flagging it.
3. If it's all merchants on one carrier (Canada Post, Intelcom, or UPS
   Canada — `08-ENVIRONMENT-SETUP.md` §5): likely an EasyPost-side or
   carrier-side outage — this degrades to the "Manual Fallback" flow
   (`15-FRONTEND-SPEC.md` §4, screen 011) rather than silently failing;
   confirm that degradation path is actually functioning, don't assume it
   is just because it's documented.

### 5.5 Database/Supabase issue

1. Check Supabase's own status page first — rule out a provider-side
   outage before debugging application code.
2. If Supabase free tier's auto-pause has somehow re-triggered post-
   upgrade (shouldn't happen on Pro tier, but verify the tier is actually
   Pro before ruling this out — `08-ENVIRONMENT-SETUP.md` §1 hard launch
   blocker).
3. RLS-related "no data showing" symptoms are often a policy bug, not a
   connectivity bug — check the specific policy for the affected table
   before assuming it's an infra issue.

## 6. Monitoring Checklist (ties to `01-SRS.md` §7)

- Sentry error rate — baseline vs. spike.
- Webhook signature failure rate.
- SMS delivery failure rate (Twilio).
- Tier 3+ actions awaiting approval, aged (per the admin alert threshold).
- Stripe webhook processing failure rate.
- Supabase DB tier/pause status (manual periodic check until an automated
  check exists — flag as a gap if this isn't automated by the time real
  merchants are live).

## 7. Post-Incident

Every incident gets a `05-LIVE-BUILD-LOG.md` entry (what happened, root
cause, fix, regression test added) — this runbook improves by accumulating
real incidents into §5's symptom list, not by speculating exhaustively
upfront. Add a new §5.x subsection the first time a genuinely new failure
mode occurs in production.
