# Rezlv — Merchant Onboarding Flow

Maps to `15-FRONTEND-SPEC.md` §4 screens 001-006, 040. Covers the
merchant-side path from signup to first live exception — separate from
`01-SRS.md` §6's admin-side KYC *review* of that signup.

## 1. Flow Sequence

```
001 Login (Google OAuth via Supabase)
  ↓
002 Auth Callback/Loading → routes to 003 if first-time, else Case Queue
  ↓
003 Onboarding — Shopify OAuth Install
  ↓
004 Onboarding — BYOA Carrier Connect Wizard
    (Canada Post → Intelcom → UPS Canada, in that priority order —
     per-carrier OAuth or API-key flow, see §3)
  ↓
[005 Resume Prompt — shown instead of 004/006 if merchant abandons mid-flow]
  ↓
006 Onboarding — Complete ("You're live")
  ↓
040 Case Queue — First-Time Guided Tour (coachmark overlay, founder-
    requested addition — spotlights real UI elements in the actual Case
    Queue, Next/Skip/step-counter, dismissible, never reappears once
    skipped/finished)
  ↓
007 Case Queue (steady state)
```

## 2. Step 1 — Shopify Connect (Screen 003)

- Standard Shopify OAuth (`01-SRS.md` §4.3) — merchant redirected to
  Shopify's authorize URL, minimum necessary scopes
  (`read_orders`, `read_fulfillments`, `write_fulfillments`).
- On callback: verify HMAC + `state` param (CSRF), exchange code for
  access token server-side, store encrypted (`01-SRS.md` §4.3 TODO on
  encryption-at-rest for `merchants.shopify_access_token`).
- Failure state (screen 003 "error"): clear message, retry CTA — don't
  leave the merchant on a dead end if Shopify OAuth fails or scopes are
  denied.

## 3. Step 2 — Carrier Connect (Screen 004)

**Confirmed 2026-07-15: Canadian carriers only** — Canada Post (priority
1), Intelcom (priority 2), UPS Canada (priority 3), via EasyPost's
BYOD/BYOCA (`08-ENVIRONMENT-SETUP.md` §5, `15-FRONTEND-SPEC.md` §3).

- Each carrier gets its own real auth flow, not one generic form
  (`15-FRONTEND-SPEC.md` §5 `CarrierCredentialForm` has an OAuth-button
  variant AND an API-key-input variant — Canada Post/UPS Canada likely
  OAuth-style, Intelcom likely API-key, **confirm each carrier's actual
  auth mechanism against EasyPost's BYOCA docs when Stage 1/3 implements
  this** — don't assume a mechanism without checking).
- Per-carrier states: `not_started`, `connecting`, `connected`, `error`.
- Merchant can connect one, two, or all three — the resolution engine
  (`03-EXCEPTIONS-TAXONOMY.md` §4 edge case 4) must degrade gracefully for
  any exception involving a carrier the merchant hasn't connected yet
  (notify "connect this carrier to enable auto-resolution," never claim a
  fix was applied when it wasn't).
- This step is where **BYOCA's real cost** applies
  (`08-ENVIRONMENT-SETUP.md` §5: $20/mo + $0.08/label, per merchant
  connection) — surface this cost transparently during connect, don't
  bury it.

## 4. Abandon/Resume Handling (Screen 005)

If a merchant leaves mid-carrier-connect, the dashboard shows the Resume
Prompt on next login rather than restarting onboarding from scratch or
silently leaving them stuck between "Shopify connected" and "live." This
state must be derivable from `merchants` table fields already in
`01-SRS.md` §2.2 (e.g. `shopify_access_token` present + no carrier
connected yet + `kyc_status`/`status` not yet active) — don't add a
separate "onboarding_step" enum unless the existing fields genuinely can't
express it.

## 5. Completion (Screen 006) → First-Time Tour (Screen 040)

- "You're live" confirmation, then routes into the Case Queue with the
  coachmark tour overlaid — this is the merchant's actual first real
  interaction with the product, so the tour should point at real elements
  (even if the queue is empty at this point — the tour still teaches the
  UI shape before the first exception arrives).
- Tour never reappears once dismissed/finished (`15-FRONTEND-SPEC.md` §5).

## 6. Team/Role Setup (Screen 025, not blocking the above flow)

Owner/Admin/Viewer roles (`01-SRS.md` §2.2 `merchant_users.role`) — not
part of the required onboarding sequence, lives in Settings, but new
merchants should be pointed to it post-onboarding if they're likely to
need teammates (e.g. via the tour or a dashboard nudge) rather than
discovering it cold.

## 7. What This Doc Does NOT Cover

- Admin-side KYC review of a new merchant signup — `01-SRS.md` §6.
- Free trial mechanics (first 10 resolved cases free) — `04-PAYMENT-LOGIC.md` §1.
- Actual carrier API integration code — `01-SRS.md` §3, built in Stage 1/4
  of the `rezlv-build` process (`06-AGENT-COLLABORATION-PROTOCOL.md`).

## 8. Open Items

- Exact per-carrier auth mechanism (OAuth vs. API-key) for Canada Post,
  Intelcom, and UPS Canada under EasyPost's BYOCA — needs confirming
  against EasyPost's actual docs before Screen 004 is built, not assumed.
- Whether `merchants` table needs an explicit onboarding-step field or can
  derive resume state from existing columns (§4) — a build-time judgment
  call, not a product decision, resolve it when Stage 1/2 actually builds
  this screen.
