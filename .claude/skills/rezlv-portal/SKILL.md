---
name: rezlv-portal
description: Builds Rezlv's customer-facing resolution portal — the JWT-linked, no-login, mobile-first page an end customer lands on from an SMS. Stage 3 of rezlv-build. Use when the customer portal doesn't exist yet or needs updating.
---

# rezlv-portal

Before anything else: read `docs/02-GUARDRAILS.md` and
`docs/05-LIVE-BUILD-LOG.md`. Then read `docs/15-FRONTEND-SPEC.md` §4
(screens 016-019), `docs/01-SRS.md` §4.1 (token model), and
`docs/14-CONTENT-TEMPLATES.md` §4 (portal copy).

## Scope

Screens: Active (016), Expired (017), Already Submitted (018), Confirmed
(019). This is a fully isolated surface — **no shared layout/nav with
`rezlv-frontend`'s merchant dashboard**, no login, no account.

## Hard constraints — do not deviate

- **JWT token: HS256, 24hr expiry, single-use.** Validate on every
  request: signature, expiry, not-already-used (`portal_sessions.used_at`
  — check and set atomically to prevent a race where the same token
  resolves twice).
- **No Rezlv branding anywhere on this surface** — merchant-branded only
  (per Content Tracker's explicit instruction, carried into
  `14-CONTENT-TEMPLATES.md` §7 and `15-FRONTEND-SPEC.md` §5's
  `ExpiredLinkState` note). This applies to the Expired state too — it
  shows the *merchant's* support contact, never Rezlv's.
- **`AddressCorrectionForm`: ≤3 fields max**, mobile-first, "done in under
  3 minutes" is the explicit design target from Content Tracker — don't
  add fields beyond what the specific exception type actually needs.
- Address submission validated against Google Maps API **before**
  allowing submission (`03-EXCEPTIONS-TAXONOMY.md` §4 edge case 3) — never
  let an unvalidated address reach the carrier write-back step.
- On submit, the token is marked used — the "Already Submitted" state
  (018) shows the submitted value and blocks resubmission, it does not
  error out with no context.

## Security note (this is the highest-exposure surface in the product)

This page is reachable by anyone with the link — it has no auth beyond
the token itself. Rate-limit submission attempts per token, never leak
whether a token is invalid vs. expired vs. already-used in a way that
helps an attacker enumerate valid tokens (the three states can look
different to the *legitimate* user who has the right context, without
leaking distinguishing info to someone probing blindly).

## When unclear

If a specific exception type's portal form isn't covered explicitly by
`03-EXCEPTIONS-TAXONOMY.md`'s resolution-path description (e.g. exactly
what fields an `access_issue` instructions-form needs vs. an
`address_issue` form), check the taxonomy doc's sub-type detail first;
if still ambiguous, ask Moses rather than inventing form fields — this
surface is customer-facing and mistakes here are visible to end customers
of every merchant on the platform.

## Done when

Token validation has tests for valid/expired/already-used/tampered-
signature paths (zero-tolerance area per the security note above).
`05-LIVE-BUILD-LOG.md` updated.
